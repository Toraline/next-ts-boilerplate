import { Menu } from "components/Menu/Menu";
import Link from "next/link";
import { PlusSign } from "ui/Icons/PlusSign";
import "./Sidebar.style.css";
import { listCategories } from "modules/categories";
import { Button } from "ui/Button/Button";

export const Sidebar = async () => {
  const categories = await listCategories();
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link className="sidebar-header__title" href="/categories">
          Categories
        </Link>
        <div className="sidebar__button-container">
          <Button href="/categories/new" size="sm">
            <PlusSign />
          </Button>
        </div>
      </div>
      <nav>
        <Menu initialState={categories || []} />
      </nav>
    </div>
  );
};
