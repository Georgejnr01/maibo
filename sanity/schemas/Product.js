/* eslint-disable import/no-anonymous-default-export */
export default {
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Product Name",
    },
    {
      name: "description",
      type: "string",
      title: "Product Description",
    },
    {
      name: "productLink",
      type: "string",
      title: "Product Link",
    },
    {
      name: "new",
      type: "boolean",
      title: "New Stock",
    },
    {
      name: "inStock",
      type: "boolean",
      title: "In Stock",
    },
    {
      name: "discountedPrice",
      type: "number",
      title: "Discounted Price (in Yuan)",
    },
    {
      name: "originalPrice",
      type: "number",
      title: "Original Price (in Yuan)",
    },
    {
      name: "productImage",
      type: "image",
      title: "Product Image 1",
      options: {
        hotspot: true, // <-- Defaults to false
      },
    },
    {
      name: "productImage2",
      type: "image",
      title: "Product Image 2",
      options: {
        hotspot: true, // <-- Defaults to false
      },
    },
    {
      name: "colors",
      type: "array",
      title: "Colors",
      of: [
        {
          type: "object",
          fields: [
            { title: "Image", name: "image", type: "image" },
            { title: "color", name: "color", type: "string" },
          ],
        },
      ],
    },
    {
      name: "sizes",
      type: "array",
      title: "Sizes",
      of: [
        {
          type: "object",
          fields: [
            { title: "Image", name: "image", type: "image" },
            { title: "size", name: "size", type: "string" },
          ],
        },
      ],
    },
    {
      title: "Category",
      name: "category",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "category" }],
        },
      ],
    },
  ],
  initialValue: {
    new: true,
  },
};
