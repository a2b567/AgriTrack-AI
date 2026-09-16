import { useEffect, useState, useRef } from "react"
import api from "@/services/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tractor, Syringe, Heart, Wheat, TrendingUp, Download } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Button } from "@/components/ui/button"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const dashboardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/analytics/dashboard")
        setStats(res.data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const exportPDF = async () => {
    if (!dashboardRef.current) return
    setIsExporting(true)
    
    try {
      const canvas = await html2canvas(dashboardRef.current, { scale: 2 })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('agritrack_dashboard_report.pdf')
    } catch (err) {
      console.error("Failed to export PDF", err)
      alert("Error exporting PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard data...</div>
  if (!stats) return <div className="p-8 text-center text-slate-500">Failed to load dashboard.</div>

  const COLORS = ['#10b981', '#f43f5e', '#f59e0b', '#3b82f6'];

  return (
    <div className="space-y-6 relative min-w-0">
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Farm Overview</h2>
          <p className="text-slate-500 dark:text-slate-400">At-a-glance analytics and key performance indicators.</p>
        </div>
        <Button
          onClick={exportPDF}
          disabled={isExporting}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/30"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export PDF"}
        </Button>
      </div>

      <div ref={dashboardRef} className="min-w-0 space-y-6 overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-2 sm:p-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)] dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-[0_20px_50px_rgba(2,6,23,0.45)]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Card className="border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_12px_30px_rgba(2,6,23,0.32)]">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-300">Total Livestock</p>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{stats.total_livestock}</h3>
                </div>
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <Tractor className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_12px_30px_rgba(2,6,23,0.32)]">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-300">Total Health Records</p>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{stats.total_vaccinations}</h3>
                </div>
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                  <Syringe className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-0 overflow-hidden border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-slate-700/80 dark:bg-slate-800/80 dark:shadow-[0_12px_30px_rgba(2,6,23,0.28)]">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-300">Active Pregnancies</p>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{stats.active_pregnancies}</h3>
                </div>
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-slate-700/80 dark:bg-slate-800/80 dark:shadow-[0_12px_30px_rgba(2,6,23,0.28)]">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-300">Total Feed Cost</p>
                  <h3 className="mt-2 text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">₱{stats.total_feed_cost?.toFixed(2) || "0.00"}</h3>
                </div>
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
                  <Wheat className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-slate-700/80 dark:bg-slate-800/80 dark:shadow-[0_12px_30px_rgba(2,6,23,0.28)]">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-300">All Costs (Expenses)</p>
                  <h3 className="mt-2 text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">₱{stats.total_expenses?.toFixed(2) || "0.00"}</h3>
                </div>
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="min-w-0 overflow-hidden border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-slate-700/80 dark:bg-slate-800/80 dark:shadow-[0_12px_30px_rgba(2,6,23,0.28)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <TrendingUp className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                Health Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[260px] px-2 sm:h-[300px] sm:px-6 flex items-center justify-center">
              {stats.health_status_data?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.health_status_data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.health_status_data.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(148, 163, 184, 0.4)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-400 dark:text-slate-400">No health data available.</p>
              )}
            </CardContent>
          </Card>

          <Card className="min-w-0 overflow-hidden border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] dark:border-slate-700/80 dark:bg-slate-800/80 dark:shadow-[0_12px_30px_rgba(2,6,23,0.28)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <Tractor className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                Livestock by Species
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[260px] px-2 sm:h-[300px] sm:px-6">
              {stats.species_data?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.species_data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#e2e8f0', fontSize: 12 }} axisLine={{ stroke: '#475569' }} tickLine={{ stroke: '#475569' }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#e2e8f0', fontSize: 12 }} axisLine={{ stroke: '#475569' }} tickLine={{ stroke: '#475569' }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(148, 163, 184, 0.4)',
                        borderRadius: '12px',
                        color: '#f8fafc',
                      }}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="flex h-full items-center justify-center text-slate-400 dark:text-slate-400">No species data available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
