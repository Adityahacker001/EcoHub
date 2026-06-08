"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Factory,
  Users,
  Cpu,
  BarChart3,
  Shield,
  Activity,
  Zap,
  Lock,
  PieChart,
  TrendingUp,
  Settings,
  Mail,
  Twitter,
  Linkedin,
  Github,
  ArrowRight,
  Sparkles
} from "lucide-react";

// Navbar
const Navbar = ({ onLogin }: { onLogin: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 sm:p-6 pointer-events-none">
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-6xl pointer-events-auto transition-all duration-500 rounded-full border ${
          isScrolled
            ? "bg-[#0A0A0A]/70 backdrop-blur-2xl shadow-[0_30px_70px_-15px_rgba(124,58,237,0.2)] border-white/10 py-3 px-6"
            : "bg-white/5 backdrop-blur-md border-white/10 py-5 px-8"
        }`}
      >
        <div className="mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] via-[#A855F7] to-[#3B82F6] flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] group-hover:scale-105 transition-transform duration-300">
              <Factory className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white bg-clip-text">
              Eco-Innovator Hub
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 bg-white/5 border border-white/5 rounded-full px-6 py-2">
            {["Home", "Features", "Stakeholders", "Impact", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <Button
              onClick={onLogin}
              className="bg-white hover:bg-neutral-200 text-black rounded-full px-6 py-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 font-medium tracking-wide text-sm"
            >
              Login
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors rounded-full bg-white/5 border border-white/10"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden absolute top-[calc(100%+16px)] left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 overflow-hidden shadow-2xl rounded-3xl p-6"
            >
              <nav className="flex flex-col space-y-4">
                {["Home", "Features", "Stakeholders", "Impact", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-neutral-300 font-medium text-lg hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
                  >
                    {item}
                  </a>
                ))}
                <Button onClick={() => { onLogin(); setMobileMenuOpen(false); }} className="w-full bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white rounded-xl py-6 text-base font-medium shadow-[0_0_30px_rgba(124,58,237,0.3)] mt-4">
                  Login
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
};

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
    })
  };

  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden antialiased">
      <Navbar onLogin={handleLogin} />

      {/* GLOBAL BACKGROUND MESH & BLURRED BLOBS */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[#050505]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        {/* Massive Animated Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.15)_0%,transparent_60%)] blur-[100px]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_60%)] blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.12)_0%,transparent_60%)] blur-[100px]"></div>
      </div>

      {/* HERO SECTION */}
      <section id="home" className="relative pt-44 pb-32 lg:pt-56 lg:pb-40 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
            
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="lg:col-span-6 flex flex-col items-start"
            >
              <motion.div variants={fadeInUp} custom={0} className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-purple-300 flex items-center gap-1">
                  New: Advanced Machine Analytics <Sparkles className="w-3 h-3" />
                </span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} custom={1} className="text-5xl sm:text-6xl lg:text-[72px] font-black tracking-tighter leading-[1.05] mb-6">
                Transforming Industries Through{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#3B82F6] animate-gradient bg-[size:200%]">
                  Smart Workforce
                </span>{" "}
                Management.
              </motion.h1>
              
              <motion.p variants={fadeInUp} custom={2} className="text-lg text-neutral-400 mb-10 leading-relaxed max-w-lg">
                A centralized platform for managing production, employees, machines, analytics, and industrial operations through a secure role-based system.
              </motion.p>
              
              <motion.div variants={fadeInUp} custom={3} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button 
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white rounded-full px-8 py-6 text-base font-semibold shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white/5 border border-white/10 text-white rounded-full px-8 py-6 text-base font-semibold hover:bg-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105"
                >
                  Request Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Hero Visuals */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              className="relative hidden lg:block lg:col-span-6 h-[500px]"
            >
              {/* Premium Glass Dashboard Representation */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[85%] bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(124,58,237,0.15)] overflow-hidden">
                <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4 h-full">
                  <div className="col-span-2 h-32 bg-white/5 rounded-xl border border-white/5"></div>
                  <div className="bg-white/5 rounded-xl border border-white/5 h-24"></div>
                  <div className="bg-white/5 rounded-xl border border-white/5 h-24"></div>
                </div>
              </div>

              {/* Floating Widgets */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] -left-10 bg-neutral-900/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex items-center space-x-4 shadow-2xl hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Production</p>
                  <p className="text-sm font-bold text-white">+24% Efficiency</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[20%] -right-10 bg-neutral-900/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex items-center space-x-4 shadow-2xl hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Employees</p>
                  <p className="text-sm font-bold text-white">452 Active</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-[60%] -left-16 bg-neutral-900/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex items-center space-x-4 shadow-2xl hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Machines</p>
                  <p className="text-sm font-bold text-white">All Online</p>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* STAKEHOLDERS SECTION */}
      <section id="stakeholders" className="py-32 relative border-y border-white/5 bg-[#080808]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-[48px] font-black tracking-tight mb-4">Stakeholders</h2>
            <p className="text-neutral-400 text-lg">Empowering every level of your organization with role-specific tools.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: "Admin", desc: "Platform & User Management", icon: Shield, gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
              { role: "Manager", desc: "Production Oversight", icon: TrendingUp, gradient: "from-purple-500 to-pink-500", bg: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
              { role: "Supervisor", desc: "Task & Shift Monitoring", icon: Activity, gradient: "from-cyan-500 to-blue-500", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
              { role: "Worker", desc: "Daily Operations", icon: Settings, gradient: "from-neutral-500 to-neutral-300", bg: "bg-neutral-800 text-neutral-300 border-neutral-700" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeInUp}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:-translate-y-2 hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <div className={`w-14 h-14 rounded-2xl border ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.role}</h3>
                <p className="text-neutral-400 text-sm">{item.desc}</p>
                <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r ${item.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left shadow-[0_0_10px_rgba(255,255,255,0.3)]`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM MODULES SECTION */}
      <section id="features" className="py-32 relative">
        <div className="absolute top-1/2 left-0 w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-[48px] font-black tracking-tight mb-4">Platform Modules</h2>
            <p className="text-neutral-400 text-lg">A comprehensive suite designed to modernize industrial operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Production Management", desc: "Streamline workflows, track outputs, and optimize your entire production lifecycle.", icon: Factory },
              { title: "Employee Management", desc: "Handle scheduling, attendance, performance, and communications centrally.", icon: Users },
              { title: "Machine Monitoring", desc: "Real-time telemetry, predictive maintenance, and utilization tracking.", icon: Cpu },
              { title: "Analytics & Reporting", desc: "Generate actionable insights with customizable dashboards and automated reports.", icon: BarChart3 }
            ].map((mod, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeInUp}
                className="group flex flex-col sm:flex-row items-start p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex flex-shrink-0 items-center justify-center mb-6 sm:mb-0 sm:mr-6 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-blue-500 group-hover:border-transparent transition-all duration-300">
                  <mod.icon className="w-8 h-8 text-neutral-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-300 transition-colors">{mod.title}</h3>
                  <p className="text-neutral-400 leading-relaxed text-base">{mod.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT & PURPOSE SECTION */}
      <section id="impact" className="py-32 bg-[#080808] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-[48px] font-black tracking-tight">Impact & Purpose</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Improved Productivity", icon: Zap, glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]", iconGlow: "text-purple-400" },
              { title: "Better Workforce Coordination", icon: Users, glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]", iconGlow: "text-blue-400" },
              { title: "Real-Time Monitoring", icon: Activity, glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]", iconGlow: "text-cyan-400" },
              { title: "Data-Driven Decisions", icon: PieChart, glow: "group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]", iconGlow: "text-indigo-400" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeInUp}
                className={`relative overflow-hidden rounded-2xl p-8 bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-300 group hover:-translate-y-2 ${item.glow}`}
              >
                <div className={`w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${item.iconGlow}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="py-32 relative border-b border-white/5">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "95%", label: "Operational Efficiency" },
              { value: "24/7", label: "Monitoring" },
              { value: "50+", label: "Machines Managed" },
              { value: "500+", label: "Employees Managed" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm"
              >
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/20 via-[#A855F7]/20 to-[#3B82F6]/20 backdrop-blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Ready to Modernize Your Industrial Operations?
            </h2>
            <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
              Take control of workforce management, production monitoring, and industrial performance from one platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={handleLogin}
                className="bg-white text-black hover:bg-neutral-200 rounded-full px-10 py-7 text-lg font-bold shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
              >
                Get Started
              </Button>
              <Button 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full px-10 py-7 text-lg font-bold backdrop-blur-md transition-all"
              >
                Request Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-[#050505] text-neutral-400 py-20 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#3B82F6] flex items-center justify-center">
                  <Factory className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Eco-Innovator Hub
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm mb-6">
                The modern operating system for industrial workforce and production management. Built for scale, security, and efficiency.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"><Twitter className="w-4 h-4" /></a>
                <a href="#" className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"><Linkedin className="w-4 h-4" /></a>
                <a href="#" className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"><Github className="w-4 h-4" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Platform Modules</a></li>
                <li><a href="#stakeholders" className="hover:text-white transition-colors">Stakeholders</a></li>
                <li><a href="#impact" className="hover:text-white transition-colors">Impact & Purpose</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:hello@ecoinnovator.com" className="hover:text-white transition-colors">hello@ecoinnovator.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>© {new Date().getFullYear()} Eco-Innovator Hub. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}