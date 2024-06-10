"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { StyleColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface StyleClientProps {
  data: StyleColumn[];
}

export const StyleClient: React.FC<StyleClientProps> = ({
  data,
}) => {
  const router = useRouter();
  const params = useParams();

  console.log("Styles:", data.length > 0 ? data[0].name : "No data");

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Styles (${data.length})`}
          description="Manage styles for your store"
        />
        <Button
          onClick={() => router.push(`/${params.store_id}/styles/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading
        title={`API`}
        description="Manage API calls for styles"
      />
      <Separator />
      <ApiList entityName="styles" entityIdName="style_id" />
    </>
  );
};
