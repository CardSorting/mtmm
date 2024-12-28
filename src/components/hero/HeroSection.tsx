import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const HeroSection = ({
  title = "Meet Your Perfect AI Companion",
  subtitle = "Discover a new way to interact, learn, and grow with personalized AI characters tailored to your needs",
  ctaText = "Create Your Companion",
  onCtaClick = () => console.log("CTA clicked"),
}: HeroSectionProps) => {
  return (
    <section className="relative w-full h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 500,
            }}
            animate={{
              y: [Math.random() * 500, Math.random() * 500],
              x: [Math.random() * 100, Math.random() * 100],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Sparkles className="w-12 h-12 text-blue-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex gap-4"
        >
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-full group transition-all duration-300 transform hover:scale-105"
            onClick={onCtaClick}
          >
            {ctaText}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg rounded-full border-slate-300 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300"
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-3 gap-8 md:gap-16"
        >
          {[
            { value: "10K+", label: "Active Users" },
            { value: "50+", label: "AI Characters" },
            { value: "24/7", label: "Support" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Decorative gradient circles */}
        <div className="absolute left-1/4 top-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-[100px] opacity-20" />
        <div className="absolute right-1/4 bottom-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-[100px] opacity-20" />
      </div>
    </section>
  );
};

export default HeroSection;
