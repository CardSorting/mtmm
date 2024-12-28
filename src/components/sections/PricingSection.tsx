import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out our AI companions",
    features: [
      "Access to 3 AI companions",
      "100 messages per month",
      "Basic customization",
      "Community support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    description: "Ideal for individuals and creators",
    features: [
      "Access to all AI companions",
      "Unlimited messages",
      "Advanced customization",
      "Priority support",
      "API access",
      "Custom AI training",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with specific needs",
    features: [
      "Custom AI companions",
      "Dedicated support team",
      "SLA guarantees",
      "Advanced security features",
      "Custom integrations",
      "Team management",
    ],
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your AI companion needs
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-2xl ${plan.highlighted ? "bg-gradient-to-b from-blue-600 to-blue-700 text-white" : "bg-white"} ${plan.highlighted ? "shadow-xl scale-105" : "border border-gray-200"}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-400 to-rose-400 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center">
                <h3
                  className={`text-xl font-bold mb-2 ${!plan.highlighted && "text-gray-900"}`}
                >
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-sm">/month</span>
                  )}
                </div>
                <p className={`mb-6 ${!plan.highlighted && "text-gray-600"}`}>
                  {plan.description}
                </p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check
                      className={`w-5 h-5 mr-3 ${plan.highlighted ? "text-blue-200" : "text-blue-500"}`}
                    />
                    <span className={!plan.highlighted ? "text-gray-600" : ""}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${plan.highlighted ? "bg-white text-blue-600 hover:bg-blue-50" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                variant={plan.highlighted ? "outline" : "default"}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
