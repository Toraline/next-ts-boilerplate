import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TextArea } from "./TextArea";

const meta = {
  title: "UI/TextArea",
  component: TextArea,
  tags: ["autodocs"],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "textarea",
    placeholder: "Insert text here",
    label: "label",
  },
};

export const NoLabel: Story = {
  args: {
    id: "textarea",
    placeholder: "Insert text here",
  },
};
