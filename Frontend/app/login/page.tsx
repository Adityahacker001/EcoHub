"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const u = searchParams.get("userId");
        const p = searchParams.get("password");
        const r = searchParams.get("role");
        if (u) setUserId(u);
        if (p) setPassword(p);
        if (r) setRole(r);
    }, [searchParams]);

    const handleLogin = () => {
        if (!userId || !password || !role) {
            setError("Please fill all fields.");
            return;
        }
        setError("");
        let dashboardPath = "/dashboard";
        switch (role) {
            case "admin":
                dashboardPath = "/admin/admin-dashboard";
                break;
            case "manager":
                dashboardPath = "/manager/manager-dashboard";
                break;
            case "Supervisor":
                dashboardPath = "/Supervisor/Supervisor-dashboard";
                break;
            case "workers":
                dashboardPath = "/workers/workers-dashboard";
                break;
            default:
                dashboardPath = "/dashboard";
        }

        router.push(dashboardPath);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white/50 p-6">
            <motion.div
                className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => router.push('/')}
                    aria-label="Close"
                >
                    <X size={20} />
                </button>
                <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-text">
                    Welcome Back
                </h2>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        User ID
                    </label>
                    <input
                        type="text"
                        className="w-full border border-gray-300/70 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-white/60 transition"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter User ID"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        className="w-full border border-gray-300/70 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 bg-white/60 transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Select Role
                    </label>
                    <select
                        className="w-full border border-gray-300/70 rounded-lg px-3 py-2 bg-white/60 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">Choose your role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="workers">Workers</option>
                    </select>
                </div>
                {error && (
                    <div className="text-red-500 mb-4 text-sm">{error}</div>
                )}
                <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-600/50"
                    onClick={handleLogin}
                >
                    Login
                </Button>
            </motion.div>

            <style jsx global>{`
                @keyframes gradientShift {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                .animate-text {
                  background-size: 200% 200%;
                  animation: gradientShift 8s ease infinite;
                }
              `}</style>
        </div>
    );
}