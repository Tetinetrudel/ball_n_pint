import { redirect } from "next/navigation";
import { AddNotes } from "../forms/add-notes";
import { getClient, getClientNotes } from "@/actions/clients/clients";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClientNotesDisplay } from "../ui/client-notes-display";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
    params: Promise<{ clientId: string, orgId: string}>
}

export async function Notes({ params } : Props) {
    const { clientId, orgId } = await params
    if(!clientId) redirect(`/organization/${orgId}/clients`)
    

    const result = await getClient(clientId)
    if (!result.success) {
        redirect(`/organization/${orgId}/clients`)
    }

    const clientNotes = await getClientNotes(clientId)
    if(!clientNotes.success) { 
        return (
            <p>{clientNotes.message}</p>
        )
    }
    
    return (
        <div className="flex flex-col space-y-4">
            
            <ClientNotesDisplay notes={clientNotes.data} client={result.data}/>
        </div>
    )
}