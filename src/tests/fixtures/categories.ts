import { CATEGORY_ERRORS } from "modules/categories";

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
  error: CATEGORY_ERRORS.VALIDATION_ERROR,
  issues: {
    slug: {
      errors: [CATEGORY_ERRORS.SLUG_TYPE_ERROR],
    },
  },
};

export const emptySlugError = {
  error: CATEGORY_ERRORS.VALIDATION_ERROR,
  issues: {
    slug: {
      errors: [CATEGORY_ERRORS.SLUG_EMPTY_ERROR],
    },
  },
};

export const missingNameError = {
  error: CATEGORY_ERRORS.VALIDATION_ERROR,
  issues: {
    name: {
      errors: [CATEGORY_ERRORS.NAME_TYPE_ERROR],
    },
  },
};

export const emptyNameError = {
  error: CATEGORY_ERRORS.VALIDATION_ERROR,
  issues: {
    name: {
      errors: [CATEGORY_ERRORS.NAME_EMPTY_ERROR],
    },
  },
};
