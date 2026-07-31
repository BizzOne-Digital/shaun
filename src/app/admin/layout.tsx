import type { Metadata } from "next";
import "@/app/admin/admin.css";

export const metadata: Metadata = {
  title: "Admin | Monsterous Radio",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root min-h-screen bg-[#050407] text-white">{children}</div>;
}
