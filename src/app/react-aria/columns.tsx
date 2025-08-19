"use client";
import { Button } from "react-aria-components";
import { ColumnDef } from "@tanstack/react-table";

export type Example = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Example>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="header-title">
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div>{formatted}</div>;
    },
  },
];
