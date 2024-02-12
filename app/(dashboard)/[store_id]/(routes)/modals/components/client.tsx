"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ModalColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface ModalClientProps {
  data: ModalColumn[];
}

export const ModalClient: React.FC<ModalClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Modals (${data.length})`}
          description="Manage page pop-up modals for your store"
        />
        <Button onClick={() => router.push(`/${params.store_id}/modals/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title={`API`} description="Manage API calls for Modals" />
      <Separator />
      <ApiList entityName="modals" entityIdName="modal_id" />
    </>
  );
};
