"use client"

import { useEffect, useState } from "react"

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/admin/messages")
      .then(res => res.json())
      .then(data => setMessages(Array.isArray(data) ? data : []))
  }, [])

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">
        Contact Messages
      </h1>

      <div className="space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className="bg-white rounded-xl shadow p-6"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{msg.name}</p>
                <p className="text-sm text-gray-500">{msg.email}</p>
                {msg.phone && (
                  <p className="text-sm text-gray-500">{msg.phone}</p>
                )}
              </div>

              <span className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </span>
            </div>

            <p className="mt-4 text-gray-700">{msg.message}</p>
          </div>
        ))}
      </div>
    </>
  )
}
