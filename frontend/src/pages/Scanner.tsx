import { useState, useRef, useEffect } from "react"
import api from "@/services/api"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScanBarcode, Radio, Loader2, X, Activity } from "lucide-react"
import { Html5Qrcode } from "html5-qrcode"

function RFIDScannerCard({
  rfidInput,
  setRfidInput,
  isScanning,
  handleRfidSubmit,
  inputRef,
}: {
  rfidInput: string
  setRfidInput: (value: string) => void
  isScanning: boolean
  handleRfidSubmit: (e: React.FormEvent) => void
  inputRef: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-[0_0_0_1px_rgba(16,185,129,0.06),0_18px_40px_rgba(15,23,42,0.08)] dark:border-emerald-500/30 dark:bg-slate-900 dark:shadow-[0_0_0_1px_rgba(16,185,129,0.1),0_18px_40px_rgba(2,6,23,0.35)]">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-400">
        <Radio size={120} />
      </div>
      <CardHeader className="relative z-10 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-emerald-700 dark:text-emerald-300">
          <Radio className="text-emerald-500 dark:text-emerald-400" />
          RFID Scanner
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Use your physical RFID wand. Make sure this field is focused before scanning.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 p-5 pt-0">
        <form onSubmit={handleRfidSubmit} className="space-y-4">
          <Input
            autoFocus
            ref={inputRef}
            placeholder="Scan or type RFID number..."
            value={rfidInput}
            onChange={(e) => setRfidInput(e.target.value)}
            className="h-14 text-lg border border-emerald-200 bg-emerald-50 text-slate-900 placeholder:text-slate-500 focus-visible:ring-emerald-500 dark:border-emerald-500/40 dark:bg-slate-950/60 dark:text-white dark:placeholder:text-slate-400"
          />
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/15 dark:shadow-emerald-950/30"
            disabled={isScanning || !rfidInput}
          >
            {isScanning ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Process Scan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function QRScannerCard({
  isCameraOpen,
  setIsCameraOpen,
}: {
  isCameraOpen: boolean
  setIsCameraOpen: (value: boolean) => void
}) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-[0_0_0_1px_rgba(59,130,246,0.06),0_18px_40px_rgba(15,23,42,0.08)] dark:border-blue-500/30 dark:bg-slate-900 dark:shadow-[0_0_0_1px_rgba(59,130,246,0.1),0_18px_40px_rgba(2,6,23,0.35)]">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-400">
        <ScanBarcode size={120} />
      </div>
      <CardHeader className="relative z-10 pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-300">
          <ScanBarcode className="text-blue-500 dark:text-blue-400" />
          QR & Barcode Scanner
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Use your device camera to scan a printed QR code or Barcode.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 flex flex-col items-center justify-center py-8 px-5">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-xl border-4 border-dashed border-blue-300 bg-slate-100 text-blue-500 dark:border-blue-400/80 dark:bg-slate-950/60 dark:text-blue-300">
          <ScanBarcode size={48} />
        </div>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/15 dark:shadow-blue-950/30"
          onClick={() => setIsCameraOpen(true)}
        >
          Open Camera
        </Button>
      </CardContent>

      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 relative">
            <div className="flex justify-between items-center p-4 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <ScanBarcode className="text-blue-600" />
                Scan QR or Barcode
              </h3>
              <button
                onClick={() => setIsCameraOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 bg-white dark:bg-slate-800 rounded-md shadow-sm border dark:border-slate-700"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-black">
              <div id="reader" className="w-full rounded-lg overflow-hidden bg-black text-white"></div>
            </div>
            <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-700">
              Center the QR code inside the frame to scan automatically.
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default function Scanner() {
  const navigate = useNavigate()
  const [rfidInput, setRfidInput] = useState("")
  const [actionType, setActionType] = useState("profile")
  const [location, setLocation] = useState("Main Gate")
  
  const [isScanning, setIsScanning] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (isCameraOpen) {
      html5QrCode = new Html5Qrcode("reader")
      
      const startScanner = async () => {
        try {
          await html5QrCode?.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              html5QrCode?.stop().then(() => {
                html5QrCode?.clear()
                setIsCameraOpen(false)
                setRfidInput(decodedText)
                processScan(decodedText)
              }).catch(console.error)
            },
            () => {}
          )
        } catch (err) {
          console.error("Error starting camera:", err)
        }
      }

      startScanner()
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode?.clear()).catch(console.error)
      }
    }
  }, [isCameraOpen])

  const processScan = async (rfid: string) => {
    if (!rfid.trim()) return

    setIsScanning(true)
    
    try {
      const res = await api.get(`/livestock/rfid/${rfid}`)
      if (res.data && res.data.id) {
        if (actionType === "profile") {
          navigate(`/livestock/${res.data.id}`)
        } else {
          // Log Activity
          await api.post('/activities/', {
            animal_id: res.data.id,
            rfid_number: rfid,
            activity_type: actionType,
            location: location
          })
          alert(`Activity '${actionType}' logged for ${res.data.animal_code}`)
        }
      }
    } catch (error) {
      alert(`RFID ${rfid} not found or error occurred.`)
    } finally {
      setIsScanning(false)
      setRfidInput("")
      inputRef.current?.focus()
    }
  }

  const handleRfidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    processScan(rfidInput)
  }

  return (
    <div className="space-y-7 max-w-5xl mx-auto relative">
      <div className="pb-1">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">RFID & Activity Scanner</h2>
        <p className="text-slate-600 dark:text-slate-400">Scan RFID tags or QR/Barcodes to log activities or view profiles.</p>
      </div>

      <Card className="rounded-2xl border border-indigo-200 bg-white shadow-[0_0_0_1px_rgba(99,102,241,0.06),0_18px_40px_rgba(15,23,42,0.08)] dark:border-indigo-500/30 dark:bg-slate-900 dark:shadow-[0_0_0_1px_rgba(99,102,241,0.1),0_18px_40px_rgba(2,6,23,0.35)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-indigo-700 dark:text-indigo-300">
            <Activity className="text-indigo-500 dark:text-indigo-400" />
            Scan Action Configuration
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Select what should happen when a tag is scanned.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300">Action on Scan</Label>
            <select 
              value={actionType}
              onChange={e => setActionType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
              aria-label="Action on scan"
              title="Action on scan"
            >
              <option value="profile" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50">View Animal Profile</option>
              <option value="Feeding" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50">Log: Feeding</option>
              <option value="Vaccination" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50">Log: Vaccination</option>
              <option value="Health Checkup" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50">Log: Health Checkup</option>
              <option value="Barn Entry" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50">Log: Barn Entry</option>
              <option value="Barn Exit" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50">Log: Barn Exit</option>
            </select>
          </div>
          {actionType !== 'profile' && (
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300">Location</Label>
              <select 
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
                aria-label="Location"
                title="Location"
              >
                <option value="Main Gate" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50">Main Gate</option>
                <option value="Barn A" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50">Barn A</option>
                <option value="Barn B" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50">Barn B</option>
                <option value="Feeding Area" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50">Feeding Area</option>
                <option value="Clinic" className="bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-50">Clinic</option>
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RFIDScannerCard
          rfidInput={rfidInput}
          setRfidInput={setRfidInput}
          isScanning={isScanning}
          handleRfidSubmit={handleRfidSubmit}
          inputRef={inputRef}
        />

        <QRScannerCard
          isCameraOpen={isCameraOpen}
          setIsCameraOpen={setIsCameraOpen}
        />
      </div>
    </div>
  )
}
