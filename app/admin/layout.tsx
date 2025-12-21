"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F1EFE7] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TRPCProvider adminPassword={storedPassword}>
      {!isAuthenticated ? (
        <div className="min-h-screen bg-[#F1EFE7] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Admin Access</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="min-h-screen bg-[#F1EFE7]">
          <header className="bg-white border-b border-black/10 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Collection Admin</h1>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      )}
    </TRPCProvider>
  );
}
