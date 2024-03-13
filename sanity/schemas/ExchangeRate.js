/* eslint-disable import/no-anonymous-default-export */
export default {
  name: "rate",
  type: "document",
  title: "Exchange Rate",
  fields: [
    {
      name: "currency",
      type: "string",
      title: "Currency (code)",
    },
    {
      name: "rate",
      type: "number",
      title: "Rate",
      description: "Exchange rate from - Yuan to NGN",
    },
  ],
};
