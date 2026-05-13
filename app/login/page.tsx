"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials. Access Denied.");
      } else {
        toast.success("Identity Verified. Entering Command Center...");
        router.push("/");
      }
    } catch (error) {
      toast.error("An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--go)]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--bl)]/5 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md p-8 space-y-8 relative z-10 border-[var(--bd)]/50 bg-gradient-to-b from-[var(--c1)] to-[var(--bg)] shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-[var(--go-g)] border border-[var(--go)]/20 items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-[var(--go)]" />
          </div>
          <h1 className="text-2xl font-black text-[var(--wh)] tracking-tight">Family Wealth</h1>
          <p className="text-xs font-bold text-[var(--mt)] uppercase tracking-[0.2em]">Sovereign Command Center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <Input 
            label="Administrative Username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <div className="relative">
            <Input 
              label="Secure Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[32px] text-[var(--mt)] hover:text-[var(--tx)] transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-sm uppercase tracking-widest font-black"
              isLoading={isLoading}
            >
              Verify Identity
            </Button>
          </div>
        </form>

        <div className="pt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--dm)] font-bold uppercase tracking-widest">
            <Lock className="h-3 w-3" />
            End-to-End Encrypted Session
          </div>
        </div>
      </Card>
      
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-[var(--mt)] font-bold uppercase tracking-[0.3em] opacity-50">
        ShieldPro Security Protocol v4.0.2
      </p>
    </div>
  );
}
