"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BackButton() {
  const router = useRouter()

  return (
    <div 
        onClick={() => router.back()}
        className="flex items-center gap-1 cursor-pointer"
    >
      <div className="rounded-full w-6 h-6 bg-primary flex items-center justify-center">
        <ArrowLeft className="size-4 text-primary-foreground" />
      </div>    
      <span className="text-sm">Retour aux clients</span>
    </div>
  )
}