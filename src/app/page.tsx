"use client";

import { useState } from "react";
import { Item } from "../ui/Item";
import { Button } from "./Button/Button";

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

      <h1>Componente Botão</h1>
      <div className="container">
        <Button variant="default">Padrão</Button>
        <Button size="sm">Pequeno</Button>
        <Button variant="transparent">Transparente</Button>
      </div>
    </>
  );
}
