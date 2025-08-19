import { DataTable } from "./data-table";
import { columns, Example } from "./columns";

async function getData(): Promise<Example[]> {
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "catchoro@example.com",
    },
    {
      id: "729ed52f",
      amount: 100,
      status: "pending",
      email: "dinossauro@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "elefante@example.com",
    },
    {
      id: "729ed52f",
      amount: 100,
      status: "pending",
      email: "falcao@example.com",
    },
    {
      id: "729ed52f",
      amount: 100,
      status: "pending",
      email: "gato@example.com",
    },
    {
      id: "729ed52f",
      amount: 100,
      status: "pending",
      email: "hipopotamo@example.com",
    },
    {
      id: "729ed52f",
      amount: 100,
      status: "pending",
      email: "iguana@example.com",
    },

    {
      id: "729ed52f",
      amount: 100,
      status: "pending",
      email: "pepino@example.com",
    },
    {
      id: "729ed52f",
      amount: 908,
      status: "pending",
      email: "mamao@example.com",
    },
    {
      id: "729ed52f",
      amount: 205,
      status: "pending",
      email: "jabuti@example.com",
    },
    {
      id: "729ed52f",
      amount: 100,
      status: "pending",
      email: "abacate@example.com",
    },
    {
      id: "729ed52f",
      amount: 190,
      status: "pending",
      email: "kiwi@example.com",
    },
    {
      id: "729ed52f",
      amount: 200,
      status: "pending",
      email: "banana@example.com",
    },
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container ">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
