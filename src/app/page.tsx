"use client";

import { useState } from "react";
import { Item } from "ui/Item";
import { Button } from "ui/Button/Button";
import "styles/global.css";

export default function Page() {
  const [content, setContent] = useState("initial value");
  const [isDone, setIsDone] = useState(true);
  return (
    <>
      <h1>My public Page</h1>
      <h1>Componente Item</h1>
      <Item
        content={content}
        isDone={isDone}
        onContentChange={setContent}
        onIsDoneChange={setIsDone}
        onDelete={() => console.log("deletou")}
        onEdit={() => console.log("editou")}
      />
      <h2>Item sem o checkbox</h2>
      <Item
        checkbox={false}
        content={content}
        onContentChange={setContent}
        onDelete={() => console.log("deletou")}
        onEdit={() => console.log("editou")}
      />
      <h2>Item sem o botão de edit</h2>
      <Item
        edit={false}
        content={content}
        isDone={isDone}
        onIsDoneChange={setIsDone}
        onDelete={() => console.log("deletou")}
      />
      <h2>Item sem o botão de delete</h2>
      <Item
        content={content}
        isDone={isDone}
        onContentChange={setContent}
        onIsDoneChange={setIsDone}
        onEdit={() => console.log("editou")}
      />
      <h2>Item só com content</h2>
      <Item
        checkbox={false}
        edit={false}
        content={content}
        onContentChange={setContent}
        onIsDoneChange={setIsDone}
        onEdit={() => console.log("editou")}
      />

      <h1>Componente Botão</h1>
      <div className="container">
        <Button>Padrão</Button>
        <Button size="sm">Pequeno</Button>
        <Button variant="transparent">Transparente</Button>
      </div>
    </>
  );
}
