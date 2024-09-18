import React, { Suspense } from "react";
import HomePage from "../_components/Home";
import LoadingIndicator from "@/app/components/LoadingIndicator";

// Component to fetch data server-side
async function fetchCmsData() {
  const res = await fetch(`${process.env.API_HOST}home-page/cms`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch CMS data");
  }

  const data = await res.json();
  return data.data;
}

// This component will suspend until the data is available
async function CmsData() {
  const cms = await fetchCmsData();
  return <HomePage cms={cms} />;
}

// Main component with Suspense to handle loading state
export default function Home() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CmsData />
    </Suspense>
  );
}
