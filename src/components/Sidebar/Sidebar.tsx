import { Menu } from "components/Menu/Menu";
import Link from "next/link";
import { Button } from "ui/Button/Button";
import { PlusSign } from "ui/Icons/PlusSign";
import "./Sidebar.style.css";

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="header">
        <Link className="header__title" href="/categories">
          Categories
        </Link>
        <Button className="button"> {<PlusSign className="button_icon" />}</Button>
      </div>
      <span className="menu">
        <Menu />
      </span>
    </div>
  );
};
