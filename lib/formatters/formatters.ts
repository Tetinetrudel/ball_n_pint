export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "-"

  const d = new Date(date)

  return d.toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}