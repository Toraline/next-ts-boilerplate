"use client";

import { useState } from "react";
import { Item } from "../ui/Item";
import { TextArea } from "ui/TextArea/TextArea";

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
      <h1>Componente TextArea</h1>
      <TextArea label="Description" id="textarea" placeholder="Daily description" />
    </>
  );
}
