"use client";

import { useState } from "react";
import { Item } from "../ui/Item";
import { Field } from "ui/Field";
export default function Page() {
  const [content, setContent] = useState("initial value");
  const [isDone, setIsDone] = useState(true);
  return (
    <>
      <h1>My public Page</h1>
      <Item
        content={content}
        isDone={isDone}
        onContentChange={setContent}
        onIsDoneChange={setIsDone}
        onDelete={() => console.log("deletou")}
        onEdit={() => console.log("editou")}
      />
      <h1>Componente Field</h1>
      <h2> Com label</h2>
      <Field label="Category name" placeholder="Type your category name" />
      <h2>Sem label</h2>
      <Field placeholder="Type your task name here" variant="nolabel" />
    </>
  );
}
