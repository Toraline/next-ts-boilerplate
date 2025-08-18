export const categoryComplete = {
  name: "Category Complete",
  slug: "category_complete",
  description: "Description for Category Complete",
};

export const categoryRequiredData = {
  name: "Category required data",
  slug: "category_required",
};

export const categories = [categoryComplete, categoryRequiredData];

export const missingSlugError = {
  error: "Validation error",
  issues: {
    slug: {
      errors: ["Slug should be a string"],
    },
  },
};

export const emptySlugError = {
  error: "Validation error",
  issues: {
    slug: {
      errors: ["Slug can not be empty"],
    },
  },
};

export const missingNameError = {
  error: "Validation error",
  issues: {
    name: {
      errors: ["Name should be a string"],
    },
  },
};

export const emptyNameError = {
  error: "Validation error",
  issues: {
    name: {
      errors: ["Name can not be empty"],
    },
  },
};
