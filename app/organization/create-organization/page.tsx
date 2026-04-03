import { CreateOrgForm } from "@/components/organization/forms/create-organization-form";

export default function CreateOrganizationPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center space-y-6">
            <h1>Bienvenue sur Ball'N'Pint</h1>
            <div className="flex items-center justify-center w-100">
                <CreateOrgForm />
            </div>
        </div>
    )
}