"use client";

import { TextArea } from "ui/TextArea/TextArea";
import "./styles/page.style.css";
import { useState } from "react";
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
      <div className="button-container">
        <Button>Padrão</Button>
        <Button size="sm">Pequeno</Button>
        <Button variant="transparent">Transparente</Button>
      </div>

      <h1>Componente TextArea</h1>
      <h2>Com label</h2>
      <TextArea label="Description" id="textarea" placeholder="Daily description" />
      <h2>Sem label</h2>
      <TextArea id="textarea" placeholder="Daily description" />
    </div>
  );
}
