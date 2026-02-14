"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Shield, Server } from "lucide-react";

// Team Data - Core Leadership
const team = [
  {
    name: "Mr. Prasanta Ray",
    role: "CEO & Founder",
    id: "ray",
    specialty: "System Architecture & Strategic Planning",
    icon: Shield,
    color: "text-blue-500",
    status: "Strategic Planning"
  },
  {
    name: "Mr. Donbil Mwshahary",
    role: "Co-Founder & CTO",
    id: "donbil",
    specialty: "Operations & Cloud Infrastructure",
    icon: Server,
    color: "text-indigo-500",
    status: "Infrastructure Deployment"
  }
];

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">Leadership</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Driving innovation and excellence through strategic vision and technical expertise.
          </p>
        </div>

        {/* Team Grid - Centered 2-column layout for leadership */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
            >
              {/* Decorative Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

              <div className="relative flex items-start justify-between mb-8">
                <div className={`p-3 rounded-xl bg-white/5 ${member.color}`}>
                  <member.icon className="w-6 h-6" />
                </div>
                
                {/* Status Indicator */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider font-medium text-gray-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${member.color.replace('text', 'bg')}`}></span>
                    <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${member.color.replace('text', 'bg')}`}></span>
                  </span>
                  {member.status}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
              <p className={`text-sm font-medium mb-4 ${member.color}`}>{member.role}</p>
              
              <div className="h-px w-full bg-white/5 my-4" />

              <p className="text-sm text-gray-500 mb-6">
                Focus Area: <span className="text-gray-300">{member.specialty}</span>
              </p>

              {/* Social Actions */}
              <div className="flex gap-4">
                <button className="text-gray-600 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </button>
                <button className="text-gray-600 hover:text-blue-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="text-gray-600 hover:text-green-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}