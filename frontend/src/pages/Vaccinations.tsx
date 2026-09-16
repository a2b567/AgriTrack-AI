import { useState, useEffect } from "react"
import api from "@/services/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Syringe, Plus, X } from "lucide-react"

export default function Vaccinations() {
  const [vaccinations, setVaccinations] = useState<any[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    animal_id: "",
    vaccine_name: "",
    vaccine_type: "",
    cost: "",
    date_given: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchVaccinations()
  }, [])

  const fetchVaccinations = async () => {
    try {
      const res = await api.get("/vaccinations/")
      setVaccinations(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error("Failed to fetch vaccinations", error)
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
        animal_id: parseInt(formData.animal_id),
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        date_given: new Date(formData.date_given).toISOString()
      }
      await api.post("/vaccinations/", payload)
      setShowAddModal(false)
      fetchVaccinations()
      setFormData({ ...formData, vaccine_name: "", vaccine_type: "", cost: "" })
    } catch (error) {
      console.error("Failed to record health entry", error)
      alert("Error adding health entry. Check the animal ID.")
    }
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Medical & Health Records</h2>
          <p className="text-slate-500 dark:text-slate-400">Track vaccines, medicines, and vitamins for all livestock.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30">
          <Plus className="mr-2 h-4 w-4" /> Record Health Entry
        </Button>
      </div>

      <Card className="border border-slate-200 bg-white/80 shadow-[0_20px_40px_rgba(15,23,42,0.08)] dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-[0_20px_40px_rgba(2,6,23,0.28)]">
        <CardContent className="p-0">
          {vaccinations.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                <Syringe className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No medical records found</h3>
              <p className="mt-2 max-w-sm text-slate-500 dark:text-slate-400">
                Keep your herd healthy by tracking vaccines, medicines, and vitamins. Click the button above to record your first entry.
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-slate-200 bg-slate-100 text-xs uppercase text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <tr>
                    <th className="px-6 py-3">Animal ID</th>
                    <th className="px-6 py-3">Item Name</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Cost (₱)</th>
                    <th className="px-6 py-3">Date Given</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900/80">
                  {vaccinations.map((vac) => (
                    <tr key={vac.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/80">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{vac.animal_id}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{vac.vaccine_name}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-300">
                          {vac.vaccine_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{vac.cost ? `₱${vac.cost.toFixed(2)}` : '₱0.00'}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{new Date(vac.date_given).toLocaleDateString()}</td>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
              title="Close"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-100 mb-4">Record Health Entry</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="animal_id" className="text-slate-200">Animal ID (Number)</Label>
                <Input id="animal_id" type="number" value={formData.animal_id} onChange={handleInputChange} required className="border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vaccine_name" className="text-slate-200">Item Name (e.g. Rabies, Vitamin C)</Label>
                <Input id="vaccine_name" value={formData.vaccine_name} onChange={handleInputChange} required className="border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vaccine_type" className="text-slate-200">Category</Label>
                <select
                  id="vaccine_type"
                  value={formData.vaccine_type}
                  onChange={(e) => setFormData({ ...formData, vaccine_type: e.target.value })}
                  required
                  className="w-full rounded-md border border-slate-600 bg-slate-800 p-2 text-sm text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="" disabled className="bg-slate-800">Select category</option>
                  <option value="Vaccine" className="bg-slate-800">Vaccine</option>
                  <option value="Medicine" className="bg-slate-800">Medicine</option>
                  <option value="Vitamin" className="bg-slate-800">Vitamin</option>
                  <option value="Other" className="bg-slate-800">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost" className="text-slate-200">Cost (₱)</Label>
                <Input id="cost" type="number" step="0.01" value={formData.cost} onChange={handleInputChange} placeholder="0.00" className="border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_given" className="text-slate-200">Date Given</Label>
                <Input id="date_given" type="date" value={formData.date_given} onChange={handleInputChange} required className="border-slate-600 bg-slate-800 text-white" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700">Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500">Save Record</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
