"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare, ArrowRight, CheckCircle2, Globe, Smartphone, Server } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  // Simple state to handle form selection (UI only for now)
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services = [
    {
      id: "web",
      title: "Web Development",
      desc: "High-performance websites using Next.js and React. SEO-optimized and scalable.",
      icon: Globe,
      price: "Starts at ₹15,000"
    },
    {
      id: "app",
      title: "App Development",
      desc: "Cross-platform mobile apps for iOS and Android using modern frameworks.",
      icon: Smartphone,
      price: "Starts at ₹25,000"
    },
    {
      id: "backend",
      title: "Backend Systems",
      desc: "Custom API development, server management, and database architecture.",
      icon: Server,
      price: "Custom Quote"
    }
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
        
        {/* Left Column: The Pitch */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono mb-6 border border-blue-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Accepting New Clients
          </div>

          <h1 className="text-5xl font-bold text-white mb-6">
            Let’s Build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">Something Great.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            We are a full-stack engineering team ready to transform your idea into a deployed reality. 
            From simple landing pages to complex backend infrastructures.
          </p>

          <div className="space-y-6">
            <h3 className="text-white font-bold text-xl">Select a Service:</h3>
            <div className="grid gap-4">
              {services.map((service) => (
                <div 
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                    selectedService === service.id 
                      ? "bg-blue-500/10 border-blue-500/50" 
                      : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${selectedService === service.id ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-gray-400"}`}>
                    <service.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${selectedService === service.id ? "text-white" : "text-gray-300"}`}>{service.title}</h4>
                    <p className="text-xs text-gray-500">{service.desc}</p>
                  </div>
                  <div className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded">
                    {service.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex items-center gap-4 text-sm text-gray-500">
            <Mail className="w-4 h-4" /> 
            <span>Direct Email: <a href="mailto:contact@codelithlabs.in" className="text-white hover:underline">contact@codelithlabs.in</a></span>
          </div>
        </motion.div>


        {/* Right Column: The Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/10 rounded-3xl p-8"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">First Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Last Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="john@company.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Project Type</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none">
                <option className="bg-black">Web Development</option>
                <option className="bg-black">Mobile App</option>
                <option className="bg-black">Custom Backend</option>
                <option className="bg-black">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Project Details</label>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors h-32" placeholder="Tell us about your idea..." />
            </div>

            <button type="button" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
              Send Proposal <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              By clicking send, you agree to our <a href="#" className="underline">Terms of Service</a>. 
              We typically respond within 24 hours.
            </p>
          </form>
        </motion.div>

      </div>
    </main>
  );
}