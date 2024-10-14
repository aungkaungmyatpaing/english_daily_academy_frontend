"use client";

import { useState } from "react";
import SubscriptionHistory from "./_payment_history_components/Subscription";
import OrderHistory from "./_payment_history_components/Order";

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
            {tab === 1 && <SubscriptionHistory />}
            {tab === 2 && <OrderHistory />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentHistory;
