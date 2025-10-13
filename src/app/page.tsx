"use client";

import { TextArea } from "ui/TextArea/TextArea";
import "./styles/page.style.css";
import { useState } from "react";
import { Field } from "ui/Field";
import { Item } from "ui/Item";
import { Button } from "global/ui";
import "styles/global.css";

export default function Page() {
  const [content, setContent] = useState("initial value");
  const [isDone, setIsDone] = useState(true);
  return (
    <div className="page">
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
        editButton={false}
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
        onlyEditing={true}
        checkbox={false}
        editButton={false}
        onContentChange={setContent}
        onIsDoneChange={setIsDone}
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
      <h1>Componente TextArea</h1>
      <h2>Com label</h2>
      <TextArea label="Description" id="textarea" placeholder="Daily description" />
      <h2>Sem label</h2>
      <TextArea id="textarea" placeholder="Daily description" />
    </div>
  );
}
