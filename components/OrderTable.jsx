import Link from "next/link";
import React from "react";
import { formatter } from "../utils/Formatter";

const Row = ({ data }) => {
  return (
    <tr className="text-xs border">
      <td className="h-10 align-middle pr-2 pl-4">
        <Link
          href={`/products/${data.id}`}
          className="underline block w-fit overflow-hidden cursor-pointer font-medium"
          title={data.id}
        >
          {data.name || data.id}
        </Link>
      </td>
      <td className="h-10 px-2 align-middle">{formatter.format(data.price)}</td>
      <td className="h-10 px-2 align-middle">{data.quantity}</td>
      <td className="h-10 px-2 align-middle">
        {formatter.format(data.price * data.quantity)}
      </td>
    </tr>
  );
};

function Table({ data }) {
  return (
    <table className="w-full whitespace-nowrap uppercase">
      <thead className="border">
        <tr className="text-xs font-extralight text-left">
          {["Product", "Price", "Quantity", "Total"].map((h) => (
            <th className="h-10 first:pl-4 px-2 align-middle" key={h}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data &&
          data?.data?.order.map((order) => <Row key={order.id} data={order} />)}
      </tbody>
    </table>
  );
}

export default Table;
