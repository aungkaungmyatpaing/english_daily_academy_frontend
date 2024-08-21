import React from "react";
import RegisterPage from "../../_components/Register";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Register() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  return <RegisterPage />;
}
