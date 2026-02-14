"use client"

import { useState } from "react"
import { Version } from "@/types/version"
import { validateCode } from "@/lib/validator"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table } from "@/components/ui/table"
import { Modal } from "@/components/ui/modal"
import { Sidebar } from "@/components/ui/sidebar"
import { Navbar } from "@/components/ui/navbar"
import { Chart } from "@/components/ui/chart"

export default function Home() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<Version[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(-1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function generate() {
    if (!input.trim()) return

    setLoading(true)
    setError("")

    try {
      /* ---------------------------------- */
      /* 🔥 ONLY SEND LAST INSTRUCTION      */
      /* ---------------------------------- */

      const lines = input
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0)

      const lastInstruction = lines[lines.length - 1]

      const lower = lastInstruction.toLowerCase()

      const isModification =
        lower.startsWith("add") ||
        lower.startsWith("remove") ||
        lower.startsWith("modify") ||
        lower.startsWith("update") ||
        lower.startsWith("delete")

      const previousPlanToSend =
        currentIndex >= 0 && isModification
          ? history[currentIndex].plan
          : null

      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: lastInstruction,
          previousPlan: previousPlanToSend,
        }),
      })

      const data = await res.json()

      if (!data?.plan) {
        throw new Error("No plan returned")
      }

      const cleaned = data.plan
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()

      let parsedPlan

      try {
        parsedPlan = JSON.parse(cleaned)
      } catch (e) {
        console.error("Planner JSON error:", cleaned)
        throw new Error("Invalid JSON from planner")
      }

      if (data.code) {
        validateCode(data.code)
      }

      const newVersion: Version = {
        plan: parsedPlan,
        code: data.code || "",
        explanation: data.explanation || "",
      }

      setHistory((prev) => {
        const updated = [...prev, newVersion]
        setCurrentIndex(updated.length - 1)
        return updated
      })

    } catch (err) {
      console.error(err)
      setError("Error generating UI")
    }

    setLoading(false)
  }

  function rollback(index: number) {
    setCurrentIndex(index)
  }

  const current =
    currentIndex >= 0 && currentIndex < history.length
      ? history[currentIndex]
      : null

  function renderComponent(component: any) {
    if (!component || !component.type) return null

    const { type, props = {}, children } = component

    const componentsMap: any = {
      Button,
      Card,
      Input,
      Table,
      Modal,
      Sidebar,
      Navbar,
      Chart,
    }

    const Component = componentsMap[type]

    if (!Component) {
      console.warn("Invalid component type:", type)
      return null
    }

    return (
      <Component {...props}>
        {Array.isArray(children) &&
          children.map((child: any, i: number) => (
            <div key={i}>
              {renderComponent(child)}
            </div>
          ))}
      </Component>
    )
  }

  return (
    <div className="h-screen flex">

      {/* LEFT PANEL */}
      <div className="w-1/3 border-r p-4 flex flex-col">
        <h2 className="font-bold mb-2">AI Chat</h2>

        <textarea
          className="border p-3 w-full rounded resize-none overflow-y-auto min-h-[150px] max-h-[350px]"
          placeholder="Describe your UI..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            e.target.style.height = "auto"
            e.target.style.height = e.target.scrollHeight + "px"
          }}
        />

        <button
          onClick={generate}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate UI"}
        </button>

        <button
          onClick={() => {
            setHistory([])
            setCurrentIndex(-1)
            setError("")
          }}
          className="mt-2 bg-gray-500 text-white px-4 py-2 rounded"
        >
          New UI
        </button>

        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}

        <div className="mt-6">
          <h3 className="font-semibold">Versions</h3>
          {history.map((_, i) => (
            <button
              key={i}
              onClick={() => rollback(i)}
              className="block text-sm mt-2 underline"
            >
              Rollback to version {i}
            </button>
          ))}
        </div>

        {current && (
          <div className="mt-6 text-sm">
            <h3 className="font-semibold">Explanation</h3>
            <p>{current.explanation}</p>
          </div>
        )}
      </div>

      {/* CODE PANEL */}
      <div className="w-1/3 bg-gray-900 text-white p-4 overflow-auto">
        <h2 className="font-bold mb-2">Generated Code</h2>
        <pre className="text-xs whitespace-pre-wrap">
          {current?.code}
        </pre>
      </div>

      {/* PREVIEW PANEL */}
      <div className="w-1/3 p-4 overflow-auto">
        <h2 className="font-bold mb-2">Live Preview</h2>
        <div className="border p-4 min-h-[200px]">
          {Array.isArray(current?.plan?.components) &&
            current.plan.components.map((comp: any, i: number) => (
              <div key={i}>
                {renderComponent(comp)}
              </div>
            ))}
        </div>
      </div>

    </div>
  )
}
