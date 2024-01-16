"use client"

import { StyleColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface StyleClientProps {
    data: StyleColumn[]
}

export const StyleClient: React.FC<StyleClientProps> = ({
    data
}) => {

    const stylesArray = Array.isArray(data) ? data : [data];

    return (
      <DataTable
          searchKey="styleName"
          columns={columns}
          data={stylesArray}
        />
    );
  };
 