import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/register");
  }
  return <div>ProfilePage</div>;
}
