'use client'

import { useState } from "react"
import { signIn } from "next-auth/react"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"register" | "login">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    setLoading(false)

    if (res?.error) {
      toast.error("Invalid email or password")
    } else {
      toast.success("Welcome back!")
      router.push("/")
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    setLoading(false)

    if (!res.ok) {
      toast.error("User already exists")
      return
    }

    toast.success("Account created! Please login.")
    setMode("login")
  }

  return (
    <>
      <Header />
      <main className=" bg-gray-50 pt-24 flex justify-center px-4 pb-24">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            {mode === "register" ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-center text-gray-500 mb-6">
            {mode === "register"
              ? "Register to track orders and faster checkout"
              : "Login to continue shopping"}
          </p>

          {/* Toggle */}
          <div className="flex mb-6 bg-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => setMode("login")}
              className={`w-1/2 py-2 font-semibold transition ${
                mode === "login"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`w-1/2 py-2 font-semibold transition ${
                mode === "register"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-600"
              }`}
            >
              Register
            </button>
          </div>

          <input
            type="email"
            placeholder="Email address"
            className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button
            onClick={mode === "login" ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:bg-gray-400"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>

          {mode === "login" && (
            <p className="text-center text-sm text-gray-500 mt-4">
              New here?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-emerald-600 font-medium hover:underline"
              >
                Create an account
              </button>
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
