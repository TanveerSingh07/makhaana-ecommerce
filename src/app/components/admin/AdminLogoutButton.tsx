"use client"

import { signOut } from "next-auth/react"

export default function AdminLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="block mt-6 text-sm text-red-400 hover:text-red-300"
    >
      Logout
    </button>
  )
}
