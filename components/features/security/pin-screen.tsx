"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, ArrowRight, XCircle, SkipForward, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PinScreenProps {
  onSuccess: (pin: string | null) => void;
}

type PinMode = "loading" | "check" | "setup" | "confirm";

export default function PinScreen({ onSuccess }: PinScreenProps) {
  const [pinMode, setPinMode] = useState<PinMode>("loading");
  const [pinInput, setPinInput] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkPin = async () => {
      // Mimic storage check
      const savedPin = localStorage.getItem("family-wealth-pin");
      if (savedPin) {
        setStoredPin(savedPin);
        setPinMode("check");
      } else {
        setPinMode("setup");
      }
    };
    checkPin();
  }, []);

  const handlePinSubmit = () => {
    if (pinMode === "setup") {
      if (pinInput.length < 4) {
        setError("PIN must be 4 digits");
        return;
      }
      setPinMode("confirm");
      setError("");
    } else if (pinMode === "confirm") {
      if (pinInput !== pinConfirm) {
        setError("PINs do not match");
        setPinConfirm("");
        return;
      }
      localStorage.setItem("family-wealth-pin", pinInput);
      toast.success("Security PIN set successfully");
      onSuccess(pinInput);
    } else if (pinMode === "check") {
      if (pinInput === storedPin) {
        onSuccess(pinInput);
      } else {
        setError("Incorrect PIN");
        setPinInput("");
      }
    }
  };

  const handleSkip = () => {
    onSuccess(null);
  };

  if (pinMode === "loading") {
    return (
      <div className="h-screen w-full bg-[var(--bg)] flex items-center justify-center overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[var(--go)] font-mono text-sm tracking-widest"
        >
          INITIALIZING SECURITY LAYER...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[var(--bg)] flex flex-col items-center justify-center p-8 md:p-16 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--go-g)] via-transparent to-transparent opacity-30 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="w-full max-w-md relative z-10 my-12"
      >
        <Card className="p-8 md:p-12 border-[var(--bd)] bg-gradient-to-b from-[var(--c1)] to-[var(--bg)] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--go)] to-transparent opacity-50" />
          
          <div className="text-center space-y-6">
            {/* Logo Section */}
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-[var(--go)] tracking-[0.2em] font-mono">FAMILY WEALTH</h1>
            </div>

            {/* Icon/Status Section */}
            <div className="flex justify-center py-4">
              <div className="h-20 w-20 rounded-full bg-[var(--go-g)] border border-[var(--go)]/20 flex items-center justify-center relative">
                <AnimatePresence mode="wait">
                  {pinMode === "check" ? (
                    <motion.div key="lock" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Lock className="h-10 w-10 text-[var(--go)]" />
                    </motion.div>
                  ) : (
                    <motion.div key="shield" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Shield className="h-10 w-10 text-[var(--go)]" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-[var(--go)]/10"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
              </div>
            </div>

            {/* Instruction Section */}
            <div className="space-y-2">
              <h2 className="text-lg font-black text-[var(--wh)] uppercase tracking-wider">
                {pinMode === "setup" && "Secure Your Assets"}
                {pinMode === "confirm" && "Confirm Security Code"}
                {pinMode === "check" && "Authentication Required"}
              </h2>
              <p className="text-xs text-[var(--mt)] font-medium leading-relaxed max-w-[280px] mx-auto">
                {pinMode === "setup" && "Establish a 4-digit security PIN to protect your private estate data."}
                {pinMode === "confirm" && "Re-enter your 4-digit code to verify and lock the vault."}
                {pinMode === "check" && "Enter your private access code to unlock the Command Center."}
              </p>
            </div>

            {/* Input Section */}
            <div className="space-y-4 pt-4">
              <div className="relative group">
                <input
                  type="password"
                  value={pinMode === "confirm" ? pinConfirm : pinInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (pinMode === "confirm") setPinConfirm(val);
                    else setPinInput(val);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
                  placeholder="----"
                  className={cn(
                    "w-full bg-[var(--bg)] border-2 border-[var(--bd)] rounded-xl py-4 text-4xl text-center font-mono tracking-[1em] text-[var(--go)] outline-none transition-all focus:border-[var(--go)]",
                    error && "border-[var(--rd)] focus:border-[var(--rd)]"
                  )}
                  autoFocus
                />
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-1.5 mt-2 text-[var(--rd)] text-[10px] font-bold uppercase tracking-widest"
                  >
                    <XCircle className="h-3 w-3" />
                    {error}
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={handlePinSubmit} 
                  variant="blue" 
                  className="w-full h-12 text-sm font-black uppercase tracking-widest"
                  disabled={(pinMode === "confirm" ? pinConfirm : pinInput).length < 4}
                >
                  {pinMode === "setup" && "Create Access Code"}
                  {pinMode === "confirm" && "Verify & Initialize"}
                  {pinMode === "check" && "Unlock Vault"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {pinMode !== "check" && (
                  <Button 
                    onClick={handleSkip} 
                    variant="ghost" 
                    className="w-full text-[10px] font-bold text-[var(--mt)] uppercase tracking-widest hover:text-[var(--wh)]"
                  >
                    <SkipForward className="mr-2 h-3 w-3" />
                    Continue Without PIN
                  </Button>
                )}

                {pinMode === "check" && (
                  <button 
                    onClick={() => {
                      localStorage.removeItem("family-wealth-pin");
                      setPinMode("setup");
                      setPinInput("");
                      setPinConfirm("");
                    }}
                    className="text-[9px] text-[var(--dm)] uppercase font-bold tracking-widest hover:text-[var(--go)] transition-colors mt-2"
                  >
                    Reset Security Credentials
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="mt-12 flex items-center justify-center gap-2 border-t border-[var(--bd)]/50 pt-6">
            <CheckCircle2 className="h-3 w-3 text-[var(--gr)]" />
            <span className="text-[9px] font-black text-[var(--mt)] uppercase tracking-widest">End-to-End Encrypted Architecture</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
