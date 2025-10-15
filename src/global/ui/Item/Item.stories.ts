import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Item } from "./Item";

const meta = {
  title: "UI/Item",
  component: Item,
  tags: ["autodocs"],
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "initial value",
    isDone: true,
    editButton: false,
  },
};

export const HaveButtons: Story = {
  args: {
    content: "initial value",
    isDone: true,
    onDelete: () => console.log("deletou"),
  },
};
