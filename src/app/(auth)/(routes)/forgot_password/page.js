import React from "react";

import { getServerSession } from "next-auth";
import ForgotPasswordPage from "../../_components/ForgotPassword";
import { redirect } from "next/navigation";

export default async function ForgotPassword() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }
  return <ForgotPasswordPage />;
}
