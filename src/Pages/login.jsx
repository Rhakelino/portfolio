import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, AlertCircle, Loader2 } from "lucide-react"

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Cek apakah sudah login saat komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem('supabase_token')
    if (token) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Simpan informasi login di localStorage
        localStorage.setItem('supabase_token', data.session.access_token)
        localStorage.setItem('user_email', data.user.email)

        navigate('/dashboard')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 transition-colors duration-200">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] bg-[length:16px_16px] pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-border/40 backdrop-blur-xl bg-card/80">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-3xl font-black tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-base text-muted-foreground">Sign in to your admin dashboard</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="bg-destructive/15 border border-destructive/30 text-destructive px-4 py-3 rounded-lg mb-6 flex items-start gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="pl-10"
                />
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline hover:underline-offset-4 font-medium transition-all">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-r-md"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  <span className="sr-only">
                    {isPasswordVisible ? "Hide password" : "Show password"}
                  </span>
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col border-t border-border/40 pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Secure admin access only.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login