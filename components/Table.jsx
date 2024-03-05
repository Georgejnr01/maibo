import Link from "next/link";
import React from "react";
import { formatter } from "../utils/Formatter";

const Row = ({ id, data }) => {
  return (
    <tr className="text-xs border">
      <td className="h-10 align-middle pr-2 pl-4">
        <Link
          href={`/orders/${id}`}
          className="border block p-1 w-fit overflow-hidden cursor-pointer font-medium opacity-70"
          title={id}
        >
          #{id}
        </Link>
      </td>
      <td className="h-10 px-2 align-middle">
        {new Date(data?.date_created?.seconds * 1000).toDateString()}
      </td>
      <td className="h-10 px-2 align-middle">{data.payment_status}</td>
      <td className="h-10 px-2 align-middle">{data.fulfillment_status}</td>
      <td className="h-10 px-2 align-middle">
        {formatter.format(data.totalPrice)}
      </td>
    </tr>
  );
};

function Table({ data }) {
  return (
    <table className="w-full whitespace-nowrap uppercase">
      <thead className="border">
        <tr className="text-xs font-extralight text-left">
          {[
            "Order",
            "Date",
            "Payment status",
            "Fulfillment status",
            "Total",
          ].map((h) => (
            <th className="h-10 first:pl-4 px-2 align-middle" key={h}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data && data.map((d) => <Row key={d.id} id={d.id} data={d.order} />)}
      </tbody>
    </table>
  );
}

export default Table;
