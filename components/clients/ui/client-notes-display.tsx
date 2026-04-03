"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMutation } from "@/hooks/use-mutations"
import { updateNote, deleteNote } from "@/actions/clients/clients"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { ClientWithRelations, MembershipWithUser } from "@/drizzle/schema"
import { AddNotes } from "../forms/add-notes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type ClientNote = {
  id: string
  clientId: string
  organizationId: string
  notes: string
  createdAt: Date
  updatedAt: Date
  memberships: MembershipWithUser
}

type Props = {
  notes: ClientNote[]
  client: ClientWithRelations
}

export function ClientNotesDisplay({ notes, client }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const { mutate: mutateUpdate, isLoading: isUpdating } = useMutation(updateNote, {
    successMessage: "Note mise à jour",
    onSuccess: () => {
      setEditingId(null)
      setEditText("")
    },
  })


  const { mutate: mutateDelete } = useMutation(deleteNote, {
    successMessage: "Note supprimée",
  })

  const startEditing = (note: ClientNote) => {
    setEditingId(note.id)
    setEditText(note.notes)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditText("")
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Notes</CardTitle>
            {notes.length === 0 && (
              <CardDescription className="mt-1">Aucune note</CardDescription>
            )}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                Ajouter une note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une note</DialogTitle>
              </DialogHeader>
              <AddNotes client={client} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="p-4 bg-background/80 rounded-md flex flex-col">
            <div className="flex items-center justify-between gap-2">
              {editingId === note.id ? (
                <div className="flex flex-1 items-start gap-2">
                  <Textarea
                    className="flex-1"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      disabled={isUpdating}
                      onClick={() =>
                        mutateUpdate({
                          notes: editText,
                          noteId: note.id,
                        })
                      }
                    >
                      Sauvegarder
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEditing}>
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p>{note.notes}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEditing(note)}>
                      Modifier
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          Supprimer
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer cette note ?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => mutateDelete(note.id)}
                            className="bg-red-600 text-white"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(note.updatedAt) > new Date(note.createdAt)
                ? `Modifiée le ${new Date(note.updatedAt).toLocaleString()}`
                : `Créée le ${new Date(note.createdAt).toLocaleString()}`}{" "}
              par {note.memberships?.user?.name || "Inconnu"}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
