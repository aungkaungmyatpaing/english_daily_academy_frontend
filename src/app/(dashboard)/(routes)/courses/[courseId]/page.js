import { Suspense } from "react";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import CourseDetailPage from "./Index"; // Adjust this import if necessary
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function CheckSession({ courseId }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/register");
  }

  return <CourseDetailPage courseId={courseId} />;
}

// Main component that uses Suspense for loading
export default function CourseDetail({ params }) {
  const { courseId } = params; // Extract courseId from URL params

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <CheckSession courseId={courseId} />
    </Suspense>
  );
}
