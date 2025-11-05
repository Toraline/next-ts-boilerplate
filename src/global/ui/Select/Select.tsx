"use client";

import {
  Select as RACSelect,
  SelectValue,
  Button,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import type { SelectProps as RACSelectProps, Key } from "react-aria-components";
import { ReactNode } from "react";
import clsx from "clsx";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<RACSelectProps, "children"> {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
  errorMessage?: string;
  description?: ReactNode;
  selectedKey?: string | null;
  onSelectionChange?: (key: string | null) => void;
}

export function Select({
  options,
  label,
  placeholder,
  className,
  errorMessage,
  description,
  selectedKey,
  onSelectionChange,
  ...props
}: SelectProps) {
  // Handle selection change - React Aria uses Key type
  const handleSelectionChange = (key: Key | null) => {
    if (onSelectionChange) {
      onSelectionChange(key ? String(key) : null);
    }
  };

  // Build props for RACSelect, prioritizing our selectedKey/onSelectionChange over props
  const racSelectProps = {
    ...props,
    // Always override with our selectedKey if provided (even if null)
    ...(selectedKey !== undefined ? { selectedKey } : {}),
    // Always override with our onSelectionChange handler if provided
    ...(onSelectionChange ? { onSelectionChange: handleSelectionChange } : {}),
  };

  return (
    <RACSelect
      className={clsx("flex flex-col gap-1", className)}
      {...racSelectProps}
      validationBehavior="aria"
    >
      {label && <label className="font-medium text-sm text-fg-muted p-1">{label}</label>}
      <Button className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-surface-1 text-fg border border-border text-sm font-normal cursor-pointer min-w-[120px] transition-colors hover:bg-surface-2 pressed:bg-surface-2 pressed:border-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 aria-invalid:border-danger aria-disabled:opacity-50 aria-disabled:cursor-not-allowed">
        <SelectValue>
          {({ selectedText }) => selectedText || placeholder || "Select an option..."}
        </SelectValue>
        <span
          aria-hidden="true"
          className="text-[10px] opacity-60 transition-transform expanded:rotate-180"
        >
          ▼
        </span>
      </Button>
      {description && <div className="text-xs text-fg-muted pl-1">{description}</div>}
      {errorMessage && <div className="text-xs text-danger pl-1">{errorMessage}</div>}
      <Popover className="max-h-[300px] overflow-auto rounded-md bg-surface-1 border border-border shadow-soft p-1 mt-1 z-50 absolute min-w-[trigger-width]">
        <ListBox className="flex flex-col gap-0.5">
          {options.map((option) => (
            <ListBoxItem
              key={option.value}
              id={option.value}
              textValue={option.label}
              className="px-3 py-2 rounded-sm text-sm text-fg cursor-pointer outline-none transition-colors hovered:bg-surface-2 selected:bg-primary selected:text-primary-fg focus-visible:bg-surface-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-[-2px]"
            >
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </RACSelect>
  );
}
