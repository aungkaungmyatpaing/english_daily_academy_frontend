import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Suspense } from "react";
import AboutUs from ".";

async function CheckSession() {
  const session = await getServerSession();

  if (!session) {
    redirect("/register");
    return null;
  }

  return <AboutUs />;
}
export default function AboutUsPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CheckSession />
    </Suspense>
  );
}
