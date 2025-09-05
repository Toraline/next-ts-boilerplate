import { Category } from "./categories.schema";

// TODO: Ticket TOR-52
const postCategory = async (newCategory: Category) => {
  const response = await fetch("http://localhost:3000/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCategory),
  });
  const savedCategory = await response.json();
  return savedCategory;
};

const getCategoryByIdOrSlug = async (idOrSlug: string) => {
  const response = await fetch("http://localhost:3000/api/categories/" + idOrSlug);
  const category = await response.json();
  return category;
};
const updateCategoryByIdOrSlug = async (category: Category, id: string) => {
  const { slug } = category;
  const response = await fetch("http://localhost:3000/api/categories/" + id || slug, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  const updatedCategory = await response.json();
  return updatedCategory;
};

export { postCategory, getCategoryByIdOrSlug, updateCategoryByIdOrSlug };
