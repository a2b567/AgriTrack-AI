import { useState, useRef, useEffect } from "react"
import { Bot, X, Send, User } from "lucide-react"
import { Button } from "./ui/button"

type Message = {
  id: string
  role: "user" | "ai"
  text: string
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "openai/gpt-oss-20b"

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "ai", text: "Hello! I am your AgriTrack AI Assistant. Ask me about your farm's health, feed costs, or animal inventory!" }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [panelHeight, setPanelHeight] = useState(440)
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number; panelX: number; panelY: number } | null>(null)
  const [panelPosition, setPanelPosition] = useState({ x: 24, y: 24 })
  const panelRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (!dragging || !dragStart) return

    const handleMove = (event: MouseEvent) => {
      const width = panelRef.current?.offsetWidth ?? 420
      const height = panelRef.current?.offsetHeight ?? 440
      const dx = event.clientX - dragStart.x
      const dy = event.clientY - dragStart.y

      const nextX = Math.min(Math.max(dragStart.panelX + dx, 12), window.innerWidth - width - 12)
      const nextY = Math.min(Math.max(dragStart.panelY + dy, 12), window.innerHeight - height - 12)

      setPanelPosition({ x: nextX, y: nextY })
    }

    const handleUp = () => {
      setDragging(false)
      setDragStart(null)
    }

    window.addEventListener("mousemove", handleMove)
    window.addEventListener("mouseup", handleUp)

    return () => {
      window.removeEventListener("mousemove", handleMove)
      window.removeEventListener("mouseup", handleUp)
    }
  }, [dragging, dragStart])

  useEffect(() => {
    if (!isOpen) return

    const handleResize = (event: MouseEvent) => {
      const nextHeight = window.innerHeight - event.clientY - 18
      setPanelHeight(Math.min(Math.max(nextHeight, 300), 620))
    }

    const stopResize = () => {
      document.body.style.userSelect = ""
    }

    const beginResize = (event: MouseEvent) => {
      if ((event.target as HTMLElement).dataset.resizeHandle !== "true") return
      document.body.style.userSelect = "none"
      const onMove = (moveEvent: MouseEvent) => handleResize(moveEvent)
      const onUp = () => {
        window.removeEventListener("mousemove", onMove)
        window.removeEventListener("mouseup", onUp)
        stopResize()
      }
      window.addEventListener("mousemove", onMove)
      window.addEventListener("mouseup", onUp)
    }

    window.addEventListener("mousedown", beginResize)
    return () => window.removeEventListener("mousedown", beginResize)
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim()) return

    if (!GROQ_API_KEY) {
      setMessages((currentMessages) => [
        ...currentMessages,
        { id: Date.now().toString(), role: "ai", text: "The AI assistant is not configured. Set VITE_GROQ_API_KEY and try again." },
      ])
      return
    }

    const userMsg = input.trim()
    const newMessages: Message[] = [...messages, { id: Date.now().toString(), role: "user", text: userMsg }]
    setMessages(newMessages)
    setInput("")
    setIsTyping(true)

    try {
      const recentMessages = newMessages.slice(-6).map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text,
      }))

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are AgriTrack AI, an expert livestock and farm management assistant. Give short, practical, helpful responses focused on livestock health, feed, breeding, vaccinations, and farm operations.",
            },
            ...recentMessages,
          ],
          temperature: 0.5,
          max_tokens: 300,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Groq API error: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      const reply = data.choices?.[0]?.message?.content?.trim() || "I couldn’t generate an answer right now."

      setMessages([...newMessages, { id: (Date.now() + 1).toString(), role: "ai", text: reply }])
    } catch (error) {
      console.error("Groq request failed", error)
      setMessages([
        ...newMessages,
        { id: (Date.now() + 1).toString(), role: "ai", text: "I’m having trouble reaching the Groq API right now. Please try again in a moment." },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        title="Open AI Assistant"
        className="fixed bottom-6 right-6 h-14 w-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 z-50 animate-bounce"
        aria-label="Open AI Assistant"
      >
        <Bot size={28} />
      </button>
    )
  }

  return (
    <div
      ref={panelRef}
      className="fixed z-50 flex w-[92vw] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950/95 shadow-[0_25px_60px_rgba(15,23,42,0.5)] backdrop-blur-md animate-in slide-in-from-bottom-5"
      style={{
        height: `${panelHeight}px`,
        left: `${panelPosition.x}px`,
        top: `${panelPosition.y}px`,
        right: "auto",
        bottom: "auto"
      }}
    >
      <div
        className="flex cursor-grab items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white active:cursor-grabbing"
        onMouseDown={(event) => {
          if ((event.target as HTMLElement).closest("button")) return

          const rect = panelRef.current?.getBoundingClientRect()
          if (!rect) return

          setDragging(true)
          setDragStart({
            x: event.clientX,
            y: event.clientY,
            panelX: rect.left,
            panelY: rect.top,
          })
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
            <Bot size={20} />
          </div>
          <h3 className="text-base font-bold">AgriTrack AI Assistant</h3>
        </div>
        <button onClick={() => setIsOpen(false)} title="Close Chat" aria-label="Close Chat" className="rounded-full p-1.5 text-emerald-50 transition-colors hover:bg-white/10 hover:text-white">
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.18),_transparent_35%),_#0b1220] p-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-900/40' : 'bg-emerald-200 text-emerald-900'}`}>
              {msg.role === 'user' ? <User size={15} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'rounded-tr-md bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-indigo-950/30' : 'rounded-tl-md border border-slate-700 bg-slate-800/90 text-slate-100'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-emerald-900">
              <Bot size={16} />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-slate-700 bg-slate-800/90 px-4 py-3 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"></span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:75ms]"></span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 border-t border-slate-700 bg-slate-950/80 p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 rounded-full border border-emerald-500/40 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 shadow-inner shadow-emerald-500/10 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        <Button onClick={handleSend} title="Send message" aria-label="Send message" className="h-11 w-11 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 p-0 text-white shadow-lg shadow-emerald-900/30 hover:from-emerald-400 hover:to-teal-400">
          <Send size={16} />
        </Button>
      </div>
      <div
        data-resize-handle="true"
        className="h-3 w-full cursor-row-resize bg-gradient-to-r from-emerald-500/0 via-emerald-400/70 to-teal-500/0"
        aria-label="Resize chat panel"
        title="Drag to resize"
      />
    </div>
  )
}
