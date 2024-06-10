"use client"

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

export type StyleColumn = {
  id: string;
  name: string;
  subcategory: string;
  category: string;
  createdAt: string;
}

export const columns: ColumnDef<StyleColumn>[] = [
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => row.original.category,
    },
  {
    accessorKey: "subcategory",
    header: ({ column }) => {
      return (
        <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Sub-Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => row.original.subcategory,
    },
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Style(s)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <span>
          {Array.isArray(row.original.name) ? (
            <ul>
              {row.original.name.map((style: string, index: number) => (
                <li key={index}>{style}</li>
              ))}
            </ul>
          ) : (
            row.original.name
          )}
        </span>
      ),
    },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]
