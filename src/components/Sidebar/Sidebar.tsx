import { Menu } from "components/Menu/Menu";
import Link from "next/link";
import { Button } from "ui/Button/Button";
import { PlusSign } from "ui/Icons/PlusSign";
import "./Sidebar.style.css";
import { listCategories } from "modules/categories";

export const Sidebar = async () => {
  const categories = await listCategories();
  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Link className="sidebar__header-title" href="/categories">
          Categories
        </Link>
        <div className="sidebar__button-container">
          <Button href="/categories/new" size="sm">
            <PlusSign />
          </Button>
        </div>
      </div>
      <span>
        <Menu initialState={categories || []} />
      </span>
    </div>
  );
};
