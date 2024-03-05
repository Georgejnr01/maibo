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
      title: "Discounted Price",
    },
    {
      name: "originalPrice",
      type: "number",
      title: "Original Price",
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
  ],
  initialValue: {
    new: true,
  },
};
