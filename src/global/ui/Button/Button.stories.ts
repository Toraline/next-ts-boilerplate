import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { Button } from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Button",
    onClick: fn(),
    size: "md",
  },
};

export const Small: Story = {
  args: {
    children: "Button",
    onClick: fn(),
    size: "sm",
  },
};

export const Transparent: Story = {
  args: {
    children: "Button",
    onClick: fn(),
    variant: "transparent",
  },
};

export const Link: Story = {
  args: {
    children: "Button",
    onClick: fn(),
    href: "/",
  },
};
