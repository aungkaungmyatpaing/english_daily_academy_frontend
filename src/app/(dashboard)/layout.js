import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-full">
      <div className="h-[80px] fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <main className="pt-[60px] h-full">{children}</main>
      <Footer />
    </div>
  );
}
