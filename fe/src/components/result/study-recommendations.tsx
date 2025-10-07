"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface Recommendation {
  icon: string;
  title: string;
  description: string;
}

interface StudyRecommendationsProps {
  recommendations: Recommendation[];
}

export function StudyRecommendations({
  recommendations,
}: StudyRecommendationsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        📚 Gợi ý Học tập
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-l-4 border-primary p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{rec.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">{rec.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
