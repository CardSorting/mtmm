import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  Users,
  Lock,
  Sparkles,
  Code,
  Globe,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Advanced AI",
    description:
      "Powered by cutting-edge language models for natural conversations",
    color: "blue",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Personalized Experience",
    description:
      "AI companions that adapt to your unique preferences and needs",
    color: "purple",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Multiple Languages",
    description:
      "Communicate seamlessly in various languages with our AI companions",
    color: "green",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Developer Friendly",
    description: "Easy integration with your existing applications via our API",
    color: "pink",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Responses",
    description: "Get immediate, thoughtful replies tailored to your needs",
    color: "yellow",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Personality Variety",
    description: "Choose from diverse AI personalities for different purposes",
    color: "orange",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Enterprise Ready",
    description:
      "Robust solutions for businesses with advanced security features",
    color: "indigo",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Secure & Private",
    description: "Your conversations are encrypted and completely private",
    color: "red",
  },
];

const colorStyles = {
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  green: "bg-green-100 text-green-600",
  pink: "bg-pink-100 text-pink-600",
  yellow: "bg-yellow-100 text-yellow-600",
  orange: "bg-orange-100 text-orange-600",
  indigo: "bg-indigo-100 text-indigo-600",
  red: "bg-red-100 text-red-600",
};

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Why Choose AI Companions?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the next generation of AI interaction with our
              innovative features
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-lg ${colorStyles[feature.color]} flex items-center justify-center mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
