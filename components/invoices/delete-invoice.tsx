import { DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useMutation } from "@/hooks/use-mutations";
import { deleteInvoice } from "@/actions/invoices/invoices";

type Props = {
    invoiceId: string;
}

export function DeleteInvoice({ invoiceId } : Props) {

    const { mutate: deleteClientMutation } = useMutation(deleteInvoice, {
        successMessage: "Facture supprimée avec succès",
        onSuccess: () => {
        },
    })

    return (
            <DialogContent>
                <DialogTitle>Supprimer la facture</DialogTitle>
                <p>Êtes-vous sûr de vouloir supprimer <b>la facture</b> ? Cette action est irréversible.</p>
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline">
                        Annuler
                    </Button>
                    <Button variant="destructive"  onClick={() => deleteClientMutation(invoiceId)}>
                        Supprimer
                    </Button>
                </div>
            </DialogContent>
    )
}
