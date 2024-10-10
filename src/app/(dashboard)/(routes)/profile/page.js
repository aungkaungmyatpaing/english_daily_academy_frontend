import LoadingIndicator from "@/app/components/LoadingIndicator";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Profile from ".";

async function CheckSession() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
    return null;
  }

  return <Profile />;
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CheckSession />
    </Suspense>
  );
}
