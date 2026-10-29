import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <div className="flex">

        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto">

          {children}

        </main>

      </div>

    </div>
  );
}
