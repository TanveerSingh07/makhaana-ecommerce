"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminDeliveryRulesPage() {
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/delivery-rules")
      .then((res) => res.json())
      .then((data) => setRules(Array.isArray(data) ? data : []));
  }, []);

  const updateRule = async (rule: any) => {
    const res = await fetch(`/api/admin/delivery-rules/${rule.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rule),
    });

    if (res.ok) toast.success("Updated");
    else toast.error("Failed");
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Delivery Rules</h1>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white p-6 rounded-xl shadow">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Min Order Value
                </label>
                <input
                  type="number"
                  value={rule.minOrderValue}
                  onChange={(e) =>
                    setRules(
                      rules.map((r) =>
                        r.id === rule.id
                          ? { ...r, minOrderValue: Number(e.target.value) }
                          : r,
                      ),
                    )
                  }
                  className="border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Max Order Value
                </label>
                <input
                  type="number"
                  value={rule.maxOrderValue}
                  onChange={(e) =>
                    setRules(
                      rules.map((r) =>
                        r.id === rule.id
                          ? { ...r, maxOrderValue: Number(e.target.value) }
                          : r,
                      ),
                    )
                  }
                  className="border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Delivery Charges
                </label>
                <input
                  type="number"
                  value={rule.deliveryCharge}
                  onChange={(e) =>
                    setRules(
                      rules.map((r) =>
                        r.id === rule.id
                          ? { ...r, deliveryCharge: Number(e.target.value) }
                          : r,
                      ),
                    )
                  }
                  className="border px-3 py-2 rounded"
                />
              </div>
            </div>

            <button
              onClick={() => updateRule(rule)}
              className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
