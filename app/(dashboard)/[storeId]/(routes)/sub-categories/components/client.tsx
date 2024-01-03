"use client"

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SubCategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface SubCategoryClientProps {
    data: SubCategoryColumn[]
}

export const SubCategoryClient: React.FC<SubCategoryClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return ( 
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Sub-Categories (${data.length})`}
                    description="Manage sub-categories for your store"
                />
                <Button onClick={() => router.push(`/${params.storeId}/sub-categories/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading 
                title={`API`}
                description="Manage API calls for sub-categories"
            />
            <Separator />
            <ApiList entityName="subcategories" entityIdName="subcategoryId" />
        </>
     );
}
 