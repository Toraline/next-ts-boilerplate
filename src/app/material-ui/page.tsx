import "./page.css";
import * as React from "react";
import Menu from "./components/menu";
import { CustomButton } from "./components/Button";

export default function Page() {
  return (
    <body>
      <h1>My public Page</h1>
      <div className="button-container">
        <CustomButton variant="contained" className="button">
          Click me
        </CustomButton>
      </div>
      <div>
        <Menu />
      </div>
    </body>
  );
}
