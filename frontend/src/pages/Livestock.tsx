import { useState, useEffect } from "react"
import api from "@/services/api"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, X } from "lucide-react"
import { Label } from "@/components/ui/label"

// Interface matching backend struct
interface Livestock {
  id: number
  animal_code: string
  rfid_number: string
  species: string
  breed: string
  health_status: string
}

export default function LivestockPage() {
  const navigate = useNavigate()
  const [animals, setAnimals] = useState<Livestock[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    animal_code: "",
    rfid_number: "",
    species: "",
    breed: "",
    health_status: "Healthy",
  })

  useEffect(() => {
    fetchAnimals()
  }, [])

  const fetchAnimals = async () => {
    try {
      const response = await api.get("/livestock/")
      setAnimals(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Failed to fetch livestock", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post("/livestock/", formData)
      setShowAddModal(false)
      fetchAnimals()
      setFormData({ animal_code: "", rfid_number: "", species: "", breed: "", health_status: "Healthy" })
    } catch (error) {
      console.error("Failed to add animal", error)
      alert("Error adding animal. Make sure the Code and RFID are unique.")
    }
  }

  const exportToCSV = () => {
    const headers = ["ID", "Code", "RFID", "Species", "Breed", "Health Status"];
    const csvContent = [
      headers.join(","),
      ...animals.map(a => `${a.id},${a.animal_code},${a.rfid_number},${a.species},${a.breed},${a.health_status}`)
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "livestock_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Livestock Management</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage all your animals across the farm.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportToCSV} className="border-slate-300 bg-white text-slate-800 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
            Export CSV
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20">
            <Plus className="mr-2 h-4 w-4" /> Add Animal
          </Button>
        </div>
      </div>

      <Card className="border border-slate-200 bg-white/90 shadow-[0_20px_40px_rgba(15,23,42,0.08)] dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-[0_20px_40px_rgba(2,6,23,0.28)]">
        <CardHeader className="py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input placeholder="Search by ID or RFID..." className="pl-9 border-slate-300 bg-slate-50 text-slate-800 placeholder:text-slate-500 focus-visible:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400" />
            </div>
            <Button variant="outline" className="border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white">Filter</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-slate-400">Loading animals...</p>
          ) : animals.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg bg-slate-950/30">
              <h3 className="text-lg font-medium text-slate-100">No animals found</h3>
              <p className="text-slate-400 mt-1">Get started by creating a new animal record.</p>
              <Button onClick={() => setShowAddModal(true)} className="mt-4 bg-emerald-600 hover:bg-emerald-500">
                <Plus className="mr-2 h-4 w-4" /> Add Animal
              </Button>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase border-b border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Code</th>
                    <th className="px-6 py-3 font-semibold">Species</th>
                    <th className="px-6 py-3 font-semibold">Breed</th>
                    <th className="px-6 py-3 font-semibold">RFID Tag</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900/80">
                  {animals.map((animal) => (
                    <tr key={animal.id} className="border-b border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/80">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{animal.animal_code}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{animal.species}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{animal.breed}</td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{animal.rfid_number || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 shadow-sm dark:border-emerald-300/50 dark:bg-emerald-500/20 dark:text-emerald-100">
                          {animal.health_status || "Healthy"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="font-semibold text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:text-white dark:hover:bg-slate-700" onClick={() => navigate(`/livestock/${animal.id}`)}>View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Animal Modal */}
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
            <h3 className="text-xl font-bold text-slate-100 mb-4">Add New Animal</h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="animal_code" className="text-slate-200">Animal Code</Label>
                <Input id="animal_code" value={formData.animal_code} onChange={handleInputChange} required placeholder="e.g. COW-001" className="border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rfid_number" className="text-slate-200">RFID Tag Number</Label>
                <Input id="rfid_number" value={formData.rfid_number} onChange={handleInputChange} placeholder="Scan or type RFID..." className="border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="species" className="text-slate-200">Species</Label>
                  <select
                    id="species"
                    value={formData.species}
                    onChange={handleInputChange as any}
                    required
                    title="Species"
                    aria-label="Select Species"
                    className="flex h-10 w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <option value="" disabled className="bg-slate-800">Select species...</option>
                    <option value="Cattle" className="bg-slate-800">Cattle</option>
                    <option value="Sheep" className="bg-slate-800">Sheep</option>
                    <option value="Pig" className="bg-slate-800">Pig</option>
                    <option value="Chicken" className="bg-slate-800">Chicken</option>
                    <option value="Goat" className="bg-slate-800">Goat</option>
                    <option value="Horse" className="bg-slate-800">Horse</option>
                    <option value="Other" className="bg-slate-800">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breed" className="text-slate-200">Breed</Label>
                  <Input id="breed" value={formData.breed} onChange={handleInputChange} required placeholder="e.g. Angus" className="border-slate-600 bg-slate-800 text-white placeholder:text-slate-400" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700">Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500">Save Animal</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
