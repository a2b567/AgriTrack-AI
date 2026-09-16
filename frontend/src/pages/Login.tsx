import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useNavigate } from "react-router-dom"
import api from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tractor, ArrowRight, Leaf } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await api.post("/auth/login", data)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      navigate("/dashboard")
    } catch (error) {
      console.error("Login failed", error)
      alert("Invalid email or password")
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('/farm_bg.png')] bg-cover bg-center bg-no-repeat" />
      <div className="absolute inset-0 z-0 bg-emerald-950/60 backdrop-blur-sm mix-blend-multiply" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-emerald-950/80 to-transparent" />

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 z-10 flex items-center gap-2 text-white/80 font-medium tracking-wider">
        <Leaf size={24} className="text-emerald-400" />
        <span>POWERED BY AI</span>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] p-8 mx-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
        
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6 transform transition-transform hover:scale-105 duration-300">
            <Tractor size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            AgriTrack AI
          </h1>
          <p className="text-emerald-100/70 text-center text-sm font-medium">
            Next-generation livestock monitoring and health analytics
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2 group">
            <Label htmlFor="email" className="text-emerald-100 font-medium ml-1">Email Address</Label>
            <div className="relative">
              <Input 
                id="email" 
                type="email" 
                placeholder="farmer@agritrack.ai" 
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-emerald-100/30 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all rounded-xl pl-4"
                {...register("email")} 
              />
            </div>
            {errors.email && <p className="text-xs text-red-300 ml-1 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="password" className="text-emerald-100 font-medium">Password</Label>
              <a href="#" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-emerald-100/30 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all rounded-xl pl-4 tracking-widest"
              {...register("password")} 
            />
            {errors.password && <p className="text-xs text-red-300 ml-1 font-medium">{errors.password.message}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:shadow-emerald-500/40 hover:-translate-y-0.5 group mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Authenticating..." : "Sign into platform"}
            {!isSubmitting && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/75">
            DEV: Rey Tristan Salvador
          </p>
          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.12em] text-emerald-100/60">
            Licensed by CMDI Junior Philippine Computing Society (JPCS) - Bay Chapter
          </p>
          <p className="mt-4 text-xs text-emerald-100/50">
            &copy; 2026 AgriTrack AI. Built with precision.
          </p>
        </div>
      </div>
    </div>
  )
}
