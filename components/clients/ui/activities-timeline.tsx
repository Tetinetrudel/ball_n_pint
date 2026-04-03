"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ClipboardList,
  CreditCard,
  FileText,
  UserPlus,
  CircleDot,
} from "lucide-react"

type ActivityItem = {
  id: string
  event: string
  message: string
  createdAt: Date
  memberships?: {
    user?: {
      name: string
    }
  }
}

type FilterKey = "all" | "invoice" | "note" | "card" | "client"

const EVENT_META: Record<
  string,
  {
    label: string
    family: Exclude<FilterKey, "all">
    badge: "default" | "secondary" | "outline" | "success" | "warning" | "destructive"
  }
> = {
  client_created: { label: "Client", family: "client", badge: "secondary" },
  invoice_created: { label: "Facture", family: "invoice", badge: "warning" },
  invoice_paid: { label: "Facture payée", family: "invoice", badge: "success" },
  invoice_item_paid: { label: "Item payé", family: "invoice", badge: "success" },
  note_added: { label: "Note", family: "note", badge: "outline" },
  note_updated: { label: "Note modifiée", family: "note", badge: "outline" },
  note_deleted: { label: "Note supprimée", family: "note", badge: "destructive" },
  card_created_from_invoice: { label: "Carte", family: "card", badge: "warning" },
  card_consumption_used: { label: "Consommation", family: "card", badge: "default" },
  card_depleted: { label: "Carte à 0", family: "card", badge: "destructive" },
}

function getEventMeta(event: string) {
  return (
    EVENT_META[event] ?? {
      label: "Activité",
      family: "client" as const,
      badge: "secondary" as const,
    }
  )
}

function EventIcon({ family }: { family: Exclude<FilterKey, "all"> }) {
  if (family === "invoice") return <FileText className="size-4" />
  if (family === "note") return <ClipboardList className="size-4" />
  if (family === "card") return <CreditCard className="size-4" />
  if (family === "client") return <UserPlus className="size-4" />
  return <CircleDot className="size-4" />
}

export function ActivitiesTimeline({ activities }: { activities: ActivityItem[] }) {
  const [filter, setFilter] = useState<FilterKey>("all")
  const [visibleCount, setVisibleCount] = useState(5)

  const filtered = useMemo(() => {
    if (filter === "all") return activities
    return activities.filter((activity) => getEventMeta(activity.event).family === filter)
  }, [activities, filter])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length
  const canShowLess = visibleCount > 5

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          Tous
        </Button>
        <Button size="sm" variant={filter === "invoice" ? "default" : "outline"} onClick={() => setFilter("invoice")}>
          Factures
        </Button>
        <Button size="sm" variant={filter === "note" ? "default" : "outline"} onClick={() => setFilter("note")}>
          Notes
        </Button>
        <Button size="sm" variant={filter === "card" ? "default" : "outline"} onClick={() => setFilter("card")}>
          Cartes
        </Button>
        <Button size="sm" variant={filter === "client" ? "default" : "outline"} onClick={() => setFilter("client")}>
          Client
        </Button>
      </div>

      {visible.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucune activité pour ce filtre.</p>
      )}

      <div className="relative pl-8">
        <div className="absolute left-[14px] top-1 bottom-1 w-px bg-border" />

        <div className="space-y-4">
          {visible.map((activity) => {
            const meta = getEventMeta(activity.event)

            return (
              <div key={activity.id} className="relative rounded-md border p-3">
                <div className="absolute -left-8 top-4 z-10 flex size-7 items-center justify-center rounded-full border bg-background text-muted-foreground">
                  <EventIcon family={meta.family} />
                </div>

                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant={meta.badge}>{meta.label}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-sm">{activity.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Par {activity.memberships?.user?.name ?? "Inconnu"}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasMore && (
          <Button variant="outline" size="sm" onClick={() => setVisibleCount((prev) => prev + 5)}>
            Voir plus
          </Button>
        )}
        {canShowLess && (
          <Button variant="ghost" size="sm" onClick={() => setVisibleCount(5)}>
            Voir moins
          </Button>
        )}
      </div>
    </div>
  )
}
