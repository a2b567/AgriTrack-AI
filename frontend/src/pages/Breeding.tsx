import { useState, useEffect } from "react"
import api from "@/services/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Plus, X } from "lucide-react"

export default function Breeding() {
  const [records, setRecords] = useState<any[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    female_animal_id: "",
    pregnancy_status: "Pending",
    breeding_date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const res = await api.get("/breeding/")
      setRecords(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error("Failed to fetch breeding records", error)
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
        female_animal_id: parseInt(formData.female_animal_id),
        breeding_date: new Date(formData.breeding_date).toISOString()
      }
      await api.post("/breeding/", payload)
      setShowAddModal(false)
      fetchRecords()
      setFormData({ ...formData, female_animal_id: "" })
    } catch (error) {
      console.error("Failed to add breeding record", error)
      alert("Error saving record. Check Animal ID.")
    }
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Breeding Cycles</h2>
          <p className="text-slate-600 dark:text-slate-400">Monitor pregnancies, breeding logs, and birth expectations.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> Log Breeding
        </Button>
      </div>

      <Card className="border border-slate-200 bg-white/80 shadow-[0_20px_40px_rgba(15,23,42,0.08)] dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-[0_20px_40px_rgba(2,6,23,0.28)]">
        <CardContent className="p-0">
          {records.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 dark:bg-pink-500/10">
                <Heart className="h-10 w-10 text-pink-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No breeding records found</h3>
              <p className="mt-2 max-w-sm text-slate-600 dark:text-slate-400">
                Start tracking breeding activities to monitor herd growth and genetics.
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-100 text-xs uppercase text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    <th className="px-6 py-3">Female ID</th>
                    <th className="px-6 py-3">Breeding Date</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900/80">
                  {records.map((rec) => (
                    <tr key={rec.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/80">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{rec.female_animal_id}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{new Date(rec.breeding_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-medium text-pink-800 dark:bg-pink-500/15 dark:text-pink-300">
                          {rec.pregnancy_status}
                        </span>
                      </td>
                    </tr>
                  ))}
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
            <h3 className="mb-4 text-xl font-bold text-slate-800 dark:text-white">Log Breeding</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="female_animal_id" className="text-slate-700 dark:text-slate-200">Female Animal ID (Number)</Label>
                <Input id="female_animal_id" type="number" value={formData.female_animal_id} onChange={handleInputChange} required className="border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="breeding_date" className="text-slate-700 dark:text-slate-200">Breeding Date</Label>
                <Input id="breeding_date" type="date" value={formData.breeding_date} onChange={handleInputChange} required className="border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pregnancy_status" className="text-slate-700 dark:text-slate-200">Status</Label>
                <Input id="pregnancy_status" value={formData.pregnancy_status} onChange={handleInputChange} required placeholder="Pending, Confirmed, etc." className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400" />
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
