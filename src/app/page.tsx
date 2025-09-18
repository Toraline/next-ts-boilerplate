"use client";

import "./styles/page.style.css";
import { useState } from "react";
import { Item } from "ui/Item";
import { Button } from "ui/Button/Button";
import "styles/global.css";

export default function Page() {
  const [content, setContent] = useState("initial value");
  const [isDone, setIsDone] = useState(true);
  return (
    <div className="page__container">
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
        <Button>Padrão</Button>
        <Button size="sm">Pequeno</Button>
        <Button variant="transparent">Transparente</Button>
      </div>
    </div>
  );
}
