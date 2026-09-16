import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "@/services/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tractor, QrCode, ArrowLeft, Scale, Plus, X, Radio, Pencil, Download } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { QRCodeSVG } from "qrcode.react"
import html2canvas from "html2canvas"

export default function LivestockProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [animal, setAnimal] = useState<any>(null)
  const [weightRecords, setWeightRecords] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [showWeightModal, setShowWeightModal] = useState(false)
  const [weightInput, setWeightInput] = useState("")

  const [showEditModal, setShowEditModal] = useState(false)
  const [isDownloadingQr, setIsDownloadingQr] = useState(false)
  const qrCardRef = useRef<HTMLDivElement>(null)
  const [editFormData, setEditFormData] = useState({
    species: "",
    breed: "",
    rfid_number: "",
    health_status: ""
  })

  useEffect(() => {
    if (id) {
      fetchAnimal()
      fetchWeights()
      fetchActivities()
    }
  }, [id])

  const fetchAnimal = async () => {
    try {
      const res = await api.get(`/livestock/${id}`)
      setAnimal(res.data)
    } catch (error) {
      console.error("Failed to fetch animal", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWeights = async () => {
    try {
      const res = await api.get(`/livestock/${id}/weight`)
      setWeightRecords(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error("Failed to fetch weights", error)
    }
  }

  const fetchActivities = async () => {
    try {
      const res = await api.get(`/activities/livestock/${id}`)
      setActivities(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error("Failed to fetch activities", error)
    }
  }

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post(`/livestock/${id}/weight`, {
        weight_kg: parseFloat(weightInput),
        date: new Date().toISOString()
      })
      setShowWeightModal(false)
      setWeightInput("")
      fetchWeights()
    } catch (error) {
      console.error("Failed to add weight", error)
      alert("Failed to add weight record.")
    }
  }

  const openEditModal = () => {
    setEditFormData({
      species: animal.species || "",
      breed: animal.breed || "",
      rfid_number: animal.rfid_number || "",
      health_status: animal.health_status || "Healthy"
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put(`/livestock/${id}`, {
        ...animal,
        ...editFormData
      })
      setShowEditModal(false)
      fetchAnimal()
    } catch (error) {
      console.error("Failed to update animal", error)
      alert("Failed to update animal details.")
    }
  }

  const downloadQrCard = async () => {
    if (!qrCardRef.current || !animal) return

    setIsDownloadingQr(true)
    try {
      const canvas = await html2canvas(qrCardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
      })
      const link = document.createElement("a")
      link.download = `${animal.animal_code}-qr-tag.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Failed to download QR tag", error)
      alert("Failed to download the QR tag. Please try again.")
    } finally {
      setIsDownloadingQr(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Loading animal profile...</div>
  if (!animal) return <div className="p-8 text-center text-slate-500">Animal not found.</div>

  const chartData = weightRecords.map(w => ({
    date: new Date(w.date).toLocaleDateString(),
    weight: w.weight_kg
  }))

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/livestock")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{animal.animal_code}</h2>
          <p className="text-slate-500 dark:text-slate-400">View detailed health, breeding, and activity logs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="shadow-sm border-none dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <Tractor className="text-emerald-500" />
                General Information
              </CardTitle>
              <Button size="sm" variant="ghost" onClick={openEditModal} className="text-slate-500 hover:text-emerald-600">
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <p className="text-sm text-slate-500 dark:text-slate-400">Species</p>
                   <p className="font-medium text-slate-900 dark:text-white">{animal.species}</p>
                 </div>
                 <div>
                   <p className="text-sm text-slate-500 dark:text-slate-400">Breed</p>
                   <p className="font-medium text-slate-900 dark:text-white">{animal.breed}</p>
                 </div>
                 <div>
                   <p className="text-sm text-slate-500 dark:text-slate-400">RFID Tag</p>
                   <p className="font-medium text-slate-900 dark:text-white">{animal.rfid_number || "None"}</p>
                 </div>
                 <div>
                   <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                   <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                     {animal.health_status}
                   </span>
                 </div>
               </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-indigo-500">
                <Scale />
                Weight Monitoring
              </CardTitle>
              <Button size="sm" variant="outline" onClick={() => setShowWeightModal(true)}>
                <Plus className="h-4 w-4 mr-2" /> Log Weight
              </Button>
            </CardHeader>
            <CardContent>
              {weightRecords.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 py-4 text-center">No weight records found.</p>
              ) : (
                <div className="h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-violet-500">
                <Radio className="h-5 w-5" />
                RFID Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                 <p className="text-slate-500 dark:text-slate-400 py-4 text-center">No activity records found.</p>
              ) : (
                 <div className="space-y-4">
                   {activities.map((act) => (
                     <div key={act.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                       <div>
                         <p className="font-semibold text-slate-800 dark:text-slate-200">{act.activity_type}</p>
                         <p className="text-sm text-slate-500 dark:text-slate-400">Location: {act.location}</p>
                       </div>
                       <p className="text-sm text-slate-400">{new Date(act.timestamp).toLocaleString()}</p>
                     </div>
                   ))}
                 </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <div ref={qrCardRef} className="rounded-xl">
            <Card className="shadow-sm border-none h-fit dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <QrCode />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="w-40 h-40 bg-white flex items-center justify-center rounded-xl mb-4 shadow-sm border border-slate-200">
                 <QRCodeSVG value={animal.rfid_number || animal.animal_code} size={128} />
              </div>
              <p className="text-sm text-center text-slate-500 dark:text-slate-400 font-medium">{animal.animal_code}</p>
              <p className="text-xs text-center text-slate-400">Printable tag for easy mobile scanning</p>
            </CardContent>
            </Card>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={downloadQrCard}
            disabled={isDownloadingQr}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloadingQr ? "Preparing QR tag..." : "Download QR tag"}
          </Button>
        </div>
      </div>

      {showWeightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowWeightModal(false)} title="Close" className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Log Weight</h3>
            <form onSubmit={handleAddWeight} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weightInput">Weight (kg)</Label>
                <Input 
                  id="weightInput" 
                  type="number" 
                  step="0.01" 
                  value={weightInput} 
                  onChange={(e) => setWeightInput(e.target.value)} 
                  required 
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  autoFocus
                />
              </div>
              <div className="pt-2">
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">Save Weight</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowEditModal(false)} title="Close" className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Edit General Information</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="species">Species</Label>
                <Input 
                  id="species" 
                  value={editFormData.species} 
                  onChange={(e) => setEditFormData({ ...editFormData, species: e.target.value })} 
                  required 
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input 
                  id="breed" 
                  value={editFormData.breed} 
                  onChange={(e) => setEditFormData({ ...editFormData, breed: e.target.value })} 
                  required 
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rfid_number">RFID Tag</Label>
                <Input 
                  id="rfid_number" 
                  value={editFormData.rfid_number} 
                  onChange={(e) => setEditFormData({ ...editFormData, rfid_number: e.target.value })} 
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="health_status">Status</Label>
                <select 
                  id="health_status" 
                  value={editFormData.health_status} 
                  onChange={(e) => setEditFormData({ ...editFormData, health_status: e.target.value })} 
                  required 
                  className="w-full border-slate-200 dark:border-slate-600 border rounded-md p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-700 dark:text-white"
                >
                  <option value="Healthy">Healthy</option>
                  <option value="Sick">Sick</option>
                  <option value="Under Treatment">Under Treatment</option>
                  <option value="Recovering">Recovering</option>
                  <option value="Deceased">Deceased</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
