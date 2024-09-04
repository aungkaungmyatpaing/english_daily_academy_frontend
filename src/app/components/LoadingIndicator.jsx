"use client";

const LoadingIndicator = () => {
  //   useEffect(() => {
  //     if (isLoading) {
  //       document.body.style.overflow = "hidden";
  //     } else {
  //       document.body.style.overflow = "auto";
  //     }
  //     return () => {
  //       document.body.style.overflow = "auto";
  //     };
  //   }, [isLoading]);

  return (
    <div className="w-full h-screen z-[999] fixed inset-0 bg-base-100 flex justify-center items-center">
      <span className="loading loading-bars text-error loading-lg"></span>
    </div>
  );
};

export default LoadingIndicator;
