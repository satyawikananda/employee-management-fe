"use client"

import { useEffect } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Search } from "lucide-react"

function AppSearch() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        document.getElementById("app-search-input")?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <InputGroup className="rounded-2xl w-sm">
      <InputGroupInput id="app-search-input" className="text-foreground" placeholder="Search Dashboard" />
      <InputGroupAddon>
        <Search size={20} className="text-foreground/60" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd className="text-foreground/60">/</Kbd>
      </InputGroupAddon>
    </InputGroup>
  )
}

export default AppSearch