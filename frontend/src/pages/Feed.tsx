import { useState, useEffect } from "react"
import api from "@/services/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wheat, Plus, X } from "lucide-react"

export default function Feed() {
  const [records, setRecords] = useState<any[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    feed_type: "",
    quantity: "",
    supplier: "",
    cost: "",
    estimated_days: "",
    date_recorded: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const res = await api.get("/feed/")
      setRecords(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error("Failed to fetch feed records", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        cost: parseFloat(formData.cost),
        estimated_days: parseInt(formData.estimated_days) || 0,
        date_recorded: new Date(formData.date_recorded).toISOString()
      }
      await api.post("/feed/", payload)
      setShowAddModal(false)
      fetchRecords()
      setFormData({ ...formData, feed_type: "", quantity: "", supplier: "", cost: "", estimated_days: "" })
    } catch (error) {
      console.error("Failed to add feed record", error)
      alert("Error saving record.")
    }
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Feed Management</h2>
          <p className="text-slate-600 dark:text-slate-400">Track daily feed consumption and costs.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> Log Feed
        </Button>
      </div>

      <Card className="border border-slate-200 bg-white/80 shadow-[0_20px_40px_rgba(15,23,42,0.08)] dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-[0_20px_40px_rgba(2,6,23,0.28)]">
        <CardContent className="p-0">
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-500/10">
                <Wheat className="h-10 w-10 text-amber-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No feed logs found</h3>
              <p className="mt-2 max-w-sm text-slate-600 dark:text-slate-400">
                Monitor your feed usage and supplier costs to optimize farm expenses.
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-100 text-xs uppercase text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Feed Type</th>
                    <th className="px-6 py-3">Quantity (kg)</th>
                    <th className="px-6 py-3">Cost (₱)</th>
                    <th className="px-6 py-3">Est. Depletion</th>
                    <th className="px-6 py-3">Supplier</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900/80">
                  {records.map((rec) => {
                    const estDate = new Date(rec.date_recorded);
                    estDate.setDate(estDate.getDate() + (rec.estimated_days || 0));
                    return (
                      <tr key={rec.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/80">
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{new Date(rec.date_recorded).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{rec.feed_type}</td>
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{rec.quantity}</td>
                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100">₱{rec.cost.toFixed(2)}</td>
                        <td className="px-6 py-4 font-medium text-emerald-600 dark:text-emerald-400">
                          {rec.estimated_days > 0 ? estDate.toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{rec.supplier}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200 dark:bg-slate-900">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Close"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <h3 className="mb-4 text-xl font-bold text-slate-800 dark:text-white">Log Feed</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feed_type" className="text-slate-700 dark:text-slate-200">Feed Type</Label>
                  <Input id="feed_type" value={formData.feed_type} onChange={handleInputChange} required placeholder="e.g. Alfalfa" className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-slate-700 dark:text-slate-200">Quantity (kg)</Label>
                  <Input id="quantity" type="number" step="0.01" value={formData.quantity} onChange={handleInputChange} required className="border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier" className="text-slate-700 dark:text-slate-200">Supplier</Label>
                  <Input id="supplier" value={formData.supplier} onChange={handleInputChange} required className="border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost" className="text-slate-700 dark:text-slate-200">Total Cost (₱)</Label>
                  <Input id="cost" type="number" step="0.01" value={formData.cost} onChange={handleInputChange} required className="border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_recorded" className="text-slate-700 dark:text-slate-200">Date Recorded</Label>
                  <Input id="date_recorded" type="date" value={formData.date_recorded} onChange={handleInputChange} required className="border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_days" className="text-slate-700 dark:text-slate-200">Est. Days to Last</Label>
                  <Input id="estimated_days" type="number" value={formData.estimated_days} onChange={handleInputChange} placeholder="e.g. 7" className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Save Record</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
