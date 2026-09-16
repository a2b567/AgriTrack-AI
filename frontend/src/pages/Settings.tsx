import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Bell, Shield, MapPin, Building, Save } from "lucide-react"

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    farmName: "AgriTrack Farm Ltd.",
    location: "123 Country Road, Farmland",
    email: "admin@agritrack.com",
    phone: "+1 234 567 8900",
    userName: "",
    password: "",
  })

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    healthWarnings: true,
    inventoryLow: true
  })

  const [securityForm, setSecurityForm] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSecurityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecurityForm({ ...securityForm, [e.target.id]: e.target.value })
  }

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.userName.trim()) {
      alert("Please enter your name before saving.")
      return
    }

    if (!formData.password.trim()) {
      alert("Please enter your password before saving.")
      return
    }

    alert("Settings saved successfully!")
  }

  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!securityForm.currentPassword.trim()) {
      alert("Please enter your current password before changing the email.")
      return
    }

    if (!securityForm.email.trim()) {
      alert("Please enter a new email address.")
      return
    }

    alert("Email updated successfully!")
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!securityForm.currentPassword.trim()) {
      alert("Please enter your current password before changing the password.")
      return
    }

    if (!securityForm.newPassword.trim()) {
      alert("Please enter a new password.")
      return
    }

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert("New password and confirm password do not match.")
      return
    }

    alert("Password updated successfully!")
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your farm profile, account preferences, and system configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "profile" 
                ? "bg-emerald-100 text-emerald-800 font-semibold dark:bg-emerald-900/50 dark:text-emerald-400" 
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <User size={18} />
            Farm Profile
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "notifications" 
                ? "bg-emerald-100 text-emerald-800 font-semibold dark:bg-emerald-900/50 dark:text-emerald-400" 
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <Bell size={18} />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "security" 
                ? "bg-emerald-100 text-emerald-800 font-semibold dark:bg-emerald-900/50 dark:text-emerald-400" 
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <Shield size={18} />
            Security
          </button>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <Card className="border-none shadow-md dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Farm Profile</CardTitle>
                <CardDescription>Update your general farm information and contact details.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="farmName" className="flex items-center gap-2 dark:text-slate-300">
                        <Building size={16} className="text-slate-400" />
                        Farm Name
                      </Label>
                      <Input 
                        id="farmName" 
                        value={formData.farmName} 
                        onChange={handleInputChange} 
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2 dark:text-slate-300">
                        <MapPin size={16} className="text-slate-400" />
                        Location
                      </Label>
                      <Input 
                        id="location" 
                        value={formData.location} 
                        onChange={handleInputChange} 
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="dark:text-slate-300">Contact Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="dark:text-slate-300">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userName" className="dark:text-slate-300">User Name</Label>
                      <Input 
                        id="userName" 
                        value={formData.userName} 
                        onChange={handleInputChange} 
                        placeholder="Enter your name"
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="dark:text-slate-300">Password</Label>
                      <Input 
                        id="password" 
                        type="password"
                        value={formData.password} 
                        onChange={handleInputChange} 
                        placeholder="Enter your password"
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="border-none shadow-md dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Notification Preferences</CardTitle>
                <CardDescription>Choose what events you want to be notified about.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-xl dark:border-slate-700">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">Email Alerts</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Receive daily digest and important updates via email.</p>
                    </div>
                    <button 
                      onClick={() => toggleNotification("emailAlerts")}
                      className={`w-12 h-6 rounded-full transition-colors relative ${notifications.emailAlerts ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      aria-label="Toggle Email Alerts"
                      title="Toggle Email Alerts"
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications.emailAlerts ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-xl dark:border-slate-700">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">SMS Alerts</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Receive urgent text messages for critical events.</p>
                    </div>
                    <button 
                      onClick={() => toggleNotification("smsAlerts")}
                      className={`w-12 h-6 rounded-full transition-colors relative ${notifications.smsAlerts ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      aria-label="Toggle SMS Alerts"
                      title="Toggle SMS Alerts"
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications.smsAlerts ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-xl dark:border-slate-700">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">Health Warnings</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Notify me immediately if an animal shows signs of illness.</p>
                    </div>
                    <button 
                      onClick={() => toggleNotification("healthWarnings")}
                      className={`w-12 h-6 rounded-full transition-colors relative ${notifications.healthWarnings ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      aria-label="Toggle Health Warnings"
                      title="Toggle Health Warnings"
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications.healthWarnings ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-xl dark:border-slate-700">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">Inventory Low Alerts</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Notify me when feed or medicine stock is running low.</p>
                    </div>
                    <button 
                      onClick={() => toggleNotification("inventoryLow")}
                      className={`w-12 h-6 rounded-full transition-colors relative ${notifications.inventoryLow ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      aria-label="Toggle Inventory Alerts"
                      title="Toggle Inventory Alerts"
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications.inventoryLow ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="border-none shadow-md dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Security Settings</CardTitle>
                <CardDescription>Manage your email, password, and security preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                
                {/* Update Email Section */}
                <div className="space-y-4 max-w-md">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Change Email Address</h4>
                  <div className="space-y-2">
                    <Label className="dark:text-slate-300">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={handleSecurityInputChange}
                      placeholder="••••••••"
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="dark:text-slate-300">New Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={securityForm.email}
                      onChange={handleSecurityInputChange}
                      placeholder="new.email@example.com"
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                  <Button onClick={handleEmailUpdate} type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">Update Email</Button>
                </div>

                <div className="border-t dark:border-slate-700 pt-6 space-y-4 max-w-md">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Change Password</h4>
                  <div className="space-y-2">
                    <Label className="dark:text-slate-300">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={handleSecurityInputChange}
                      placeholder="••••••••"
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="dark:text-slate-300">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={securityForm.newPassword}
                      onChange={handleSecurityInputChange}
                      placeholder="••••••••"
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="dark:text-slate-300">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={handleSecurityInputChange}
                      placeholder="••••••••"
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                  </div>
                  <Button onClick={handlePasswordUpdate} type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full">Update Password</Button>
                </div>

                <div className="pt-6 border-t dark:border-slate-700 max-w-md">
                  <h4 className="font-semibold text-rose-600 mb-2">Danger Zone</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <Button variant="destructive" className="w-full">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
