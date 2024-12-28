import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Entrepreneur",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    content:
      "The professional AI companion has been invaluable for my business planning. It's like having a consultant available 24/7.",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "Creative Writer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    content:
      "The casual companion helps me brainstorm story ideas and overcome writer's block. It's become an essential part of my creative process.",
    rating: 5,
  },
  {
    name: "Emily Parker",
    role: "Game Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    content:
      "The fantasy companion is perfect for world-building and character development. It's like having a creative partner who never runs out of ideas.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how AI Companions are transforming the way people work and
            create
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-700">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
