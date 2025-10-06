"use client";

import "./styles/page.style.css";
import { useState } from "react";
import { Field } from "ui/Field";
import { Item } from "ui/Item";
import { Button } from "ui/Button/Button";
import "styles/global.css";

export default function Page() {
  const [content, setContent] = useState("initial value");
  const [isDone, setIsDone] = useState(true);
  return (
    <div className="page-container">
      <h1>My public Page</h1>
      <Item
        content={content}
        isDone={isDone}
        onContentChange={setContent}
        onIsDoneChange={setIsDone}
        onDelete={() => console.log("deletou")}
        onEdit={() => console.log("editou")}
      />

      <h1>Componente Botão</h1>
      <div className="button__container">
        <Button>Padrão</Button>
        <Button size="sm">Pequeno</Button>
        <Button variant="transparent">Transparente</Button>
      </div>

      <h1>Componente Field</h1>
      <h2> Com label</h2>
      <Field label="Category name" placeholder="Type your category name" />
      <h2>Sem label</h2>
      <Field placeholder="Type your task name here" />
    </div>
  );
}
