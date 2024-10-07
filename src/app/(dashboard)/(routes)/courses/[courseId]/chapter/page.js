import { getServerSession } from "next-auth";
import ChapterPage from "./Index";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import LoadingIndicator from "@/app/components/LoadingIndicator";

async function CheckSession({ courseId }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return <ChapterPage courseId={courseId} />;
}

// Main component that uses Suspense for loading
export default function Chapter({ params }) {
  const { courseId } = params;
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CheckSession courseId={courseId} />
    </Suspense>
  );
}
