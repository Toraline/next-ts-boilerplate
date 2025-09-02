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

export { postCategory };
