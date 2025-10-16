"use client";

import { TextArea } from "global/ui/TextArea/TextArea";
import "./styles/page.style.css";
import { useState } from "react";
import { Field } from "ui/Field";
import { Item } from "ui/Item";
import { Button } from "global/ui";
import "global/styles/global.css";

export default function Page() {
  const [content, setContent] = useState("initial value");
  const [isDone, setIsDone] = useState(true);
  return (
    <div>
      <h1>My public Page</h1>
      <h2 className="title">Componente Item</h2>
      <Item
        content={content}
        isDone={isDone}
        onContentChange={setContent}
        onIsDoneChange={setIsDone}
        onDelete={() => console.log("deletou")}
        onEdit={() => console.log("editou")}
      />
      <h3>Item sem o checkbox</h3>
      <Item
        checkbox={false}
        content={content}
        onContentChange={setContent}
        onDelete={() => console.log("deletou")}
        onEdit={() => console.log("editou")}
      />
      <h3>Item sem o botão de edit</h3>
      <Item
        editButton={false}
        content={content}
        isDone={isDone}
        onIsDoneChange={setIsDone}
        onDelete={() => console.log("deletou")}
      />
      <h3>Item sem o botão de delete</h3>
      <Item
        content={content}
        isDone={isDone}
        onContentChange={setContent}
        onIsDoneChange={setIsDone}
        onEdit={() => console.log("editou")}
      />
      <h3>Item só com content</h3>
      <Item
        onlyEditing={true}
        checkbox={false}
        editButton={false}
        onContentChange={setContent}
        onIsDoneChange={setIsDone}
        onEdit={() => console.log("editou")}
      />

      <h2>Componente Botão</h2>
      <div className="button__container">
        <Button>Padrão</Button>
        <Button size="sm">Pequeno</Button>
        <Button variant="transparent">Transparente</Button>
      </div>

      <h2>Componente Field</h2>
      <h3> Com label</h3>
      <Field label="Category name" placeholder="Type your category name" />
      <h3>Sem label</h3>
      <Field placeholder="Type your task name here" />
      <h2>Componente TextArea</h2>
      <h3>Com label</h3>
      <TextArea label="Description" id="textarea" placeholder="Daily description" />
      <h3>Sem label</h3>
      <TextArea id="textarea" placeholder="Daily description" />
    </div>
  );
}
