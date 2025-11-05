import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "./Select";

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export const Default: Story = {
  args: {
    label: "Select an option",
    options: defaultOptions,
    placeholder: "Choose...",
  },
};

export const WithDescription: Story = {
  args: {
    label: "Theme",
    options: [
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
      { value: "system", label: "System" },
    ],
    description: "Applied: light",
  },
};

export const WithError: Story = {
  args: {
    label: "Select an option",
    options: defaultOptions,
    errorMessage: "This field is required",
    isInvalid: true,
  },
};

export const NoLabel: Story = {
  args: {
    options: defaultOptions,
    placeholder: "Select...",
  },
};

export const Selected: Story = {
  args: {
    label: "Select an option",
    options: defaultOptions,
    selectedKey: "option2",
  },
};

export const Disabled: Story = {
  args: {
    label: "Select an option",
    options: defaultOptions,
    isDisabled: true,
  },
};

export const ManyOptions: Story = {
  args: {
    label: "Country",
    options: [
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
      { value: "mx", label: "Mexico" },
      { value: "uk", label: "United Kingdom" },
      { value: "fr", label: "France" },
      { value: "de", label: "Germany" },
      { value: "it", label: "Italy" },
      { value: "es", label: "Spain" },
      { value: "br", label: "Brazil" },
      { value: "ar", label: "Argentina" },
    ],
    placeholder: "Select a country...",
  },
};
