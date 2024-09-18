import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Pricing from ".";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Suspense } from "react";

async function CheckSession() {
  const session = await getServerSession();

  if (!session) {
    redirect("/register");
    return null;
  }

  return <Pricing />;
}

export default function PricingPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CheckSession />
    </Suspense>
  );
}
