import { useState, useEffect } from "react"
import api from "@/services/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, Plus, X, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"

export default function Finance() {
  const [records, setRecords] = useState<any[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    type: "Income",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const res = await api.get("/finance/")
      setRecords(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error("Failed to fetch finance records", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      }
      await api.post("/finance/", payload)
      setShowAddModal(false)
      fetchRecords()
      setFormData({ ...formData, amount: "", description: "", category: "" })
    } catch (error) {
      console.error("Failed to record finance", error)
      alert("Error adding financial record.")
    }
  }

  const totalIncome = records.filter(r => r.type === "Income").reduce((sum, r) => sum + r.amount, 0)
  const totalExpense = records.filter(r => r.type === "Expense").reduce((sum, r) => sum + r.amount, 0)
  const netProfit = totalIncome - totalExpense

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Financial Management</h2>
          <p className="text-slate-500 dark:text-slate-400">Track all income, expenses, and farm profitability.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> Add Record
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm dark:bg-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Income</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">₱{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <ArrowUpRight className="h-6 w-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm dark:bg-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Expenses</p>
              <h3 className="text-2xl font-bold text-rose-600 mt-1">₱{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="h-12 w-12 bg-rose-100 rounded-full flex items-center justify-center">
              <ArrowDownRight className="h-6 w-6 text-rose-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm dark:bg-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Net Profit</p>
              <h3 className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                ₱{netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm dark:bg-slate-800">
        <CardContent className="p-0">
          {records.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="h-20 w-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 dark:text-white">No financial records found</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                Start tracking your farm's income and expenses by adding a record above.
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900 border-b dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr key={rec.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750">
                      <td className="px-6 py-4 font-medium dark:text-white">{new Date(rec.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${rec.type === 'Income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {rec.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 dark:text-slate-300">{rec.category}</td>
                      <td className="px-6 py-4 dark:text-slate-300">{rec.description}</td>
                      <td className={`px-6 py-4 text-right font-bold ${rec.type === 'Income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {rec.type === 'Income' ? '+' : '-'}₱{rec.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowAddModal(false)}
              title="Close modal"
              aria-label="Close modal"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Add Financial Record</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="dark:text-slate-300">Transaction Type</Label>
                <select 
                  id="type" 
                  value={formData.type} 
                  onChange={handleInputChange} 
                  title="Transaction Type"
                  aria-label="Transaction Type"
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                  required
                >
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className="dark:text-slate-300">Category</Label>
                <Input id="category" value={formData.category} onChange={handleInputChange} required placeholder="e.g. Feed, Vet Bill, Sale" className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="dark:text-slate-300">Amount (₱)</Label>
                <Input id="amount" type="number" step="0.01" value={formData.amount} onChange={handleInputChange} required className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="dark:text-slate-300">Description</Label>
                <Input id="description" value={formData.description} onChange={handleInputChange} required className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="dark:text-slate-300">Date</Label>
                <Input id="date" type="date" value={formData.date} onChange={handleInputChange} required className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="dark:border-slate-600 dark:text-slate-300">Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Record</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
