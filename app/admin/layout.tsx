"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Link from "next/link";
import { TRPCProvider } from "../../components/providers/trpc-provider";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [storedPassword, setStoredPassword] = useState<string | undefined>();
  const [error, setError] = useState("");

  useEffect(() => {
    const authStatus = localStorage.getItem("admin-authenticated");
    const savedPassword = localStorage.getItem("admin-password");
    if (authStatus === "true" && savedPassword) {
      setIsAuthenticated(true);
      setStoredPassword(savedPassword);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      setIsAuthenticated(true);
      setStoredPassword(password);
      localStorage.setItem("admin-authenticated", "true");
      localStorage.setItem("admin-password", password);
      setError("");
    } else {
      setError("Please enter a password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStoredPassword(undefined);
    localStorage.removeItem("admin-authenticated");
    localStorage.removeItem("admin-password");
    setPassword("");
  };

  return (
    <TRPCProvider adminPassword={storedPassword}>
      {!isAuthenticated ? (
        <div className="min-h-screen bg-[#F1EFE7] text-black font-sans flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md">
            <h1 className="text-site-name font-semibold tracking-[0.05em] text-center mb-12">
              The Reiferson Collection
            </h1>

            <div className="bg-white border border-black/10 rounded-sm p-8">
              <h2 className="text-navigation tracking-[0.05em] font-medium text-center mb-6 opacity-80">
                Admin Access
              </h2>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border-black/10 text-black placeholder:text-black/40 tracking-[0.05em]"
                  />
                </div>

                {error && (
                  <p className="text-navigation tracking-[0.05em] opacity-60 text-center">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-black text-white tracking-[0.05em] font-medium admin-btn-primary"
                >
                  Login
                </Button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-[#F1EFE7] text-black font-sans">
          <nav className="sticky top-0 z-50 bg-[#F1EFE7] border-b border-black/10">
            <div className="flex justify-between items-center p-6 md:p-8">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <h1 className="text-site-name font-semibold tracking-[0.05em] cursor-pointer">
                    The Reiferson Collection
                  </h1>
                </Link>
                <span className="text-utility tracking-[0.05em] opacity-60">
                  / Admin
                </span>
              </div>

              <div className="flex gap-6 items-center">
                <Link
                  href="/"
                  className="text-navigation tracking-[0.05em] font-medium opacity-60 admin-link"
                >
                  View Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-navigation tracking-[0.05em] font-medium opacity-60 admin-link"
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>

          <main className="p-6 md:p-8">{children}</main>
        </div>
      )}
    </TRPCProvider>
  );
}
