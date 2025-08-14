"use client";

import {
  Button,
  ButtonGroup,
  Checkbox,
  Heading,
  IconButton,
  Menu,
  Pagination,
  Portal,
  Stack,
  Table,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useState } from "react";

export default function Page() {
  const [selection, setSelection] = useState<string[]>([]);

  const items = [
    { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
    { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
    { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
    { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
    { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
  ];
  const indeterminate = selection.length > 0 && selection.length < items.length;

  const rows = items.map((item) => (
    <Table.Row
      key={item.name}
      data-selected={selection.includes(item.name) ? "" : undefined}
    >
      <Table.Cell>
        <Checkbox.Root
          size="sm"
          mt="0.5"
          aria-label="Select row"
          checked={selection.includes(item.name)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, item.name]
                : selection.filter((name) => name !== item.name)
            );
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      <Table.Cell>{item.name}</Table.Cell>
      <Table.Cell>{item.category}</Table.Cell>
      <Table.Cell>${item.price}</Table.Cell>
    </Table.Row>
  ));

  return (
    <body>
      <Button>Click me</Button>
      <Menu.Root>
        <Menu.Trigger asChild>
          <Button variant="outline" size="sm">
            Open
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="new-txt-a">
                New Text File <Menu.ItemCommand>⌘E</Menu.ItemCommand>
              </Menu.Item>
              <Menu.Item value="new-file-a">
                New File... <Menu.ItemCommand>⌘N</Menu.ItemCommand>
              </Menu.Item>
              <Menu.Item value="new-win-a">
                New Window <Menu.ItemCommand>⌘W</Menu.ItemCommand>
              </Menu.Item>
              <Menu.Item value="open-file-a">
                Open File... <Menu.ItemCommand>⌘O</Menu.ItemCommand>
              </Menu.Item>
              <Menu.Item value="export-a">
                Export <Menu.ItemCommand>⌘S</Menu.ItemCommand>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      <Stack width="full" gap="5">
        <Heading size="xl">Products</Heading>
        <Table.Root size="sm" variant="outline" striped>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="13">
                <Checkbox.Root
                  size="sm"
                  mt="0.5"
                  aria-label="Select all rows"
                  checked={
                    indeterminate ? "indeterminate" : selection.length > 0
                  }
                  onCheckedChange={(changes) => {
                    setSelection(
                      changes.checked ? items.map((item) => item.name) : []
                    );
                  }}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </Table.ColumnHeader>
              <Table.ColumnHeader>Product</Table.ColumnHeader>
              <Table.ColumnHeader>Category</Table.ColumnHeader>
              <Table.ColumnHeader>Price</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>{rows}</Table.Body>
        </Table.Root>

        <Pagination.Root count={items.length * 5} pageSize={5} page={3}>
          <ButtonGroup variant="ghost" size="sm" wrap="wrap">
            <Pagination.PrevTrigger asChild>
              <IconButton>
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(page) => (
                <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                  {page.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger asChild>
              <IconButton>
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </Stack>
    </body>
  );
}
