"use client";

import { setCheckoutFormValidated } from "@/store";
import { useDispatch, useSelector } from "react-redux";

const Checkout = () => {
  const checkoutFormValidated = useSelector(
    (state) => state.mainLoading.checkoutFormValidated
  );
  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(setCheckoutFormValidated(false));
  };
  return (
    <div className="w-full h-screen bg-green-500">
      Checkout
      <button onClick={() => handleBack()} className="btn">
        Back
      </button>
    </div>
  );
};

export default Checkout;
