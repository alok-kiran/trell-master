import { OrganizationList } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <OrganizationList
                hidePersonal
                afterSelectOrganizationUrl="/organization/:id"
                afterCreateOrganizationUrl="/organization/:id"
            />
        </div>
    )
}