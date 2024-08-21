import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import Course from "./Index";

export default async function CoursePage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/register");
  }
  return <Course />;
}
