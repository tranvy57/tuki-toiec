"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

interface CustomCardProps {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  icon?: React.ElementType;
  href?: string;
}

export function CustomCard({
  slug,
  name,
  description,
  imageUrl,
  icon: Icon,
  href,
}: CustomCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      // transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative rounded-2xl shadow-sm hover:shadow-lg bg-white border border-gray-100 overflow-hidden"
    >
      <Link href={href || `/practice`}>
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={
              imageUrl ||
              "https://media.istockphoto.com/id/1310251720/vi/vec-to/ti%E1%BA%BFng-anh.jpg?s=612x612&w=0&k=20&c=GMzb5QBeg3JRW_AkNpwjysezvISmt1oS7LtPIeGOTyc="
            }
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t opacity-60" />

          <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-white/80 text-sm font-semibold text-gray-800">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>5–20 phút</span>
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {Icon && <Icon className="w-5 h-5 text-[oklch(0.22_0.15_283)]" />}
              <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
