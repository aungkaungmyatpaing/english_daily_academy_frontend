import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Course from "./Index";
import LoadingIndicator from "@/app/components/LoadingIndicator";

// Component that checks for session
async function CheckSession() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login"); // Redirect if no session
    return null; // This won't be rendered due to redirect
  }

  return <Course />;
}

// Main component with Suspense to show loading state
export default function CoursePage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CheckSession />
    </Suspense>
  );
}
