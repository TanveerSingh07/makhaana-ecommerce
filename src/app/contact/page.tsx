"use client";

import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success(
        "Message sent successfully! Our team will contact you soon."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 pt-10">
        {/* Header */}
        <section className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-6 py-14 text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">
              We’d love to hear from you.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* INFO */}
            <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
              <h2 className="text-2xl font-bold">Get in Touch</h2>

              {[
                {
                  icon: EnvelopeIcon,
                  title: "Email",
                  lines: ["hello@makhaana.com", "support@makhaana.com"],
                },
                {
                  icon: PhoneIcon,
                  title: "Phone",
                  lines: ["+91 98765 43210", "Mon–Sat: 9 AM – 6 PM"],
                },
                {
                  icon: MapPinIcon,
                  title: "Address",
                  lines: [
                    "Makhaana Foods Pvt. Ltd.",
                    "Ludhiana, Punjab – 141001",
                  ],
                },
              ].map(({ icon: Icon, title, lines }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    {lines.map((l) => (
                      <p key={l} className="text-sm text-gray-600">
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* FORM */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <input
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <textarea
                  name="message"
                  rows={5}
                  placeholder="Your message..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
