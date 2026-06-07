import { Outlet, useLocation } from "react-router";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import api from "../../api";

export function RootLayout() {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!sessionStorage.getItem("hasVisited")) {
      api.post("/analytics/visit").catch(console.error);
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Outlet />
        </main>
        {!isAdminDashboard && <Footer />}
      </div>
    </ThemeProvider>
  );
}
