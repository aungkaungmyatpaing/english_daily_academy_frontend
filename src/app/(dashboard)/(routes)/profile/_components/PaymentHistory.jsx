"use client";

import { useState } from "react";

const PaymentHistory = () => {
  const [tab, setTab] = useState(2);

  return (
    <div className="w-full h-auto px-16">
      <div className="w-full h-auto flex flex-col gap-5 ">
        <span className="text-2xl text-white font-bold">Payment History</span>
        <div className="w-full flex flex-col gap-5">
          <div className="w-full flex gap-10">
            <div
              onClick={() => setTab(1)}
              className={`py-2 cursor-pointer ${
                tab === 1 && "border-b-4  border-error"
              }`}
            >
              <span className="text-xl">Subscription</span>
            </div>
            <div
              onClick={() => setTab(2)}
              className={`py-2 cursor-pointer ${
                tab === 2 && "border-b-4  border-error"
              }`}
            >
              <span className="text-xl">Shop</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            {tab === 1 && (
              <table className="table table-xs table-pin-rows table-pin-cols">
                <thead>
                  <tr>
                    <th></th>
                    <td>Date</td>
                    <td>Subscription Plan</td>
                    <td>Price</td>
                    <td>Wallet</td>
                    <td>Transaction Number</td>
                    <td>Slip</td>
                    <td>Status</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>11/10/2024</td>
                    <td>1 Year Plan</td>
                    <td>100000 MMK</td>
                    <td>KBZ Pay</td>
                    <td>09769575696</td>
                    <td>
                      <span className="tooltip" data-tip="View Image">
                        {" "}
                        <i className="fa-regular fa-image text-error "></i>
                      </span>
                    </td>
                    <td>
                      <span className="text-warning">Pending</span>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr></tr>
                </tfoot>
              </table>
            )}
            {tab === 2 && (
              <table className="table table-xs table-pin-rows table-pin-cols">
                <thead>
                  <tr>
                    <th></th>

                    <td>Order ID</td>
                    <td>Date</td>
                    <td>Name</td>
                    <td>phone</td>
                    <td>Product</td>
                    <td>Quantity</td>
                    <td>Price</td>
                    <td>Total Price</td>
                    <td>Status</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <td>#1</td>
                    <td>11/11/2024</td>
                    <td>arka</td>
                    <td>09760575696</td>
                    <td>Soap</td>
                    <td>2</td>
                    <td>1000 MMK</td>
                    <td>2000 MMK</td>
                    <td>
                      <span className="tooltip" data-tip="View Image">
                        {" "}
                        <i className="fa-regular fa-image text-error "></i>
                      </span>
                    </td>
                    <td>
                      <span className="text-warning">Pending</span>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr></tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentHistory;
