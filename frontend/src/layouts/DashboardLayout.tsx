import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom"
import { Tractor, LayoutDashboard, QrCode, Settings, LogOut, Syringe, Heart, Wheat, Sun, Moon, DollarSign, Bell, Menu, X } from "lucide-react"
import AIChatWidget from "@/components/AIChatWidget"
import api from "@/services/api"

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
    
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Close sidebar when route changes (mobile nav)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/")
      setNotifications(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error("Failed to fetch notifications")
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`)
      fetchNotifications()
    } catch (error) {
      console.error("Failed to mark as read")
    }
  }

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      setIsDarkMode(true)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Livestock", path: "/livestock", icon: Tractor },
    { label: "Medical & Health", path: "/vaccinations", icon: Syringe },
    { label: "Breeding", path: "/breeding", icon: Heart },
    { label: "Feed Management", path: "/feed", icon: Wheat },
    { label: "Finance", path: "/finance", icon: DollarSign },
  ]

  const secondaryMenuItems = [
    { label: "Scanner", path: "/scanner", icon: QrCode },
    { label: "Settings", path: "/settings", icon: Settings },
  ]

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-50" : "bg-[radial-gradient(circle_at_top,_#f0fdf4,_#f8fafc_35%,_#edf6f0_100%)] text-slate-900"}`}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed md:relative inset-y-0 left-0 z-40
        w-64 flex flex-col border-r border-emerald-800/20 text-emerald-50
        transform transition-all duration-300 ease-in-out
        ${isDarkMode ? "bg-[linear-gradient(180deg,#062f2e_0%,#021a1d_100%)] shadow-[0_0_40px_rgba(16,185,129,0.18)]" : "bg-[linear-gradient(180deg,#0d4b46_0%,#0a3637_100%)] shadow-[0_0_35px_rgba(7,89,133,0.12)]"}
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 flex items-center justify-between gap-3 border-b border-emerald-100/10">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-600/30">
              <Tractor className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">AgriTrack AI</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-emerald-200 hover:text-white p-1"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-emerald-400/15 text-emerald-200 font-medium border border-emerald-300/25 shadow-inner shadow-emerald-950/30"
                  : "text-emerald-100/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          ))}

          <div className="pt-3 mt-2 border-t border-emerald-100/10">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/60">
              Operations
            </div>
            {secondaryMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-emerald-400/15 text-emerald-200 font-medium border border-emerald-300/25 shadow-inner shadow-emerald-950/30"
                    : "text-emerald-100/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-emerald-100/10 flex flex-col gap-2">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-emerald-100/80 hover:bg-white/5 hover:text-white transition-colors"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-emerald-100/80 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>

          <div className="pt-3 mt-1 border-t border-emerald-100/10">
            <p className="text-[8px] uppercase tracking-[0.2em] text-emerald-100/70 text-center">
              DEV: Rey Tristan Salvador
            </p>
            <p className="mt-1 text-[7px] uppercase tracking-[0.08em] text-emerald-100/55 text-center leading-relaxed">
              Licensed by CMDI Junior Philippine Computing Society (JPCS) - Bay Chapter
            </p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
        <header className={`h-16 md:h-20 border-b px-4 md:px-8 flex items-center justify-between z-10 shrink-0 backdrop-blur-sm transition-colors ${isDarkMode ? "bg-slate-950/90 border-slate-700/90" : "bg-white/80 border-slate-200 shadow-sm"}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`md:hidden p-2 rounded-lg transition-colors ${isDarkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-100"}`}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className={`text-lg md:text-2xl font-semibold truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              {menuItems.find(item => item.path === location.pathname)?.label || "Platform"}
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 transition-colors focus:outline-none ${isDarkMode ? "text-slate-300 hover:text-white" : "text-slate-500 hover:text-slate-700"}`}
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl shadow-2xl border overflow-hidden z-50 animate-in slide-in-from-top-2 ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
                  <div className={`p-4 border-b ${isDarkMode ? "bg-slate-950 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                    <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className={`p-4 text-center text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        You have no new notifications.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-4 border-b cursor-pointer transition-colors ${isDarkMode ? "border-slate-700/50 hover:bg-slate-700/50" : "border-slate-100 hover:bg-slate-50"}`} onClick={() => markAsRead(n.id)}>
                          <p className={`text-sm font-medium ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{n.title}</p>
                          <p className={`text-xs mt-1 line-clamp-2 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{n.message}</p>
                          <p className="text-[10px] text-emerald-500 mt-2 font-medium">Click to mark as read</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={`h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center font-bold border-2 text-sm ${isDarkMode ? "bg-emerald-500/20 text-emerald-300 border-emerald-400" : "bg-emerald-100 text-emerald-800 border-emerald-500"}`}>
              U
            </div>
          </div>
        </header>

        <div className={`flex-1 min-w-0 overflow-auto p-3 sm:p-4 md:p-8 ${isDarkMode ? "bg-slate-950/80" : "bg-slate-50/70"}`}>
          <Outlet />
        </div>

        <AIChatWidget />
      </main>
    </div>
  )
}
