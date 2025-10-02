import { BookText, Brain, Repeat, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
const vocabFeatures = [
  {
    title: "Kho 1000+ từ cốt lõi",
    description:
      "Bộ từ vựng trích lọc từ ETS & đề thật, nền tảng để đạt từ 450+ trở lên.",
    icon: BookText,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    stats: "1,000+",
  },
  {
    title: "Ưu tiên từ bạn hay sai",
    description:
      "Mỗi khi làm sai, hệ thống tự động ghi nhớ và đẩy từ đó vào danh sách ôn tập sớm.",
    icon: Target,
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
    stats: "Smart Track",
  },
  {
    title: "Flashcard & Mini Quiz cá nhân",
    description:
      "Không còn học lan man: quiz & flashcard chỉ xoay quanh những từ bạn yếu.",
    icon: Repeat,
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-50 to-amber-50",
    iconBg: "bg-gradient-to-br from-orange-500 to-amber-500",
    stats: "5 phút/ngày",
  },
  {
    title: "Ôn tập thông minh theo mục tiêu",
    description:
      "Mục tiêu 450, 550 hay 650? Lộ trình ôn tập từ vựng sẽ thay đổi phù hợp.",
    icon: Brain,
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-500",
    stats: "AI-Powered",
  },
];



const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof vocabFeatures)[0];
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <motion.div
      variants={itemVariants as any}
      whileHover={{ scale: 1.03, y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden bg-white border border-gray-200 shadow-xl group rounded-3xl"
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0`}
        animate={{ opacity: isHovered ? 0.6 : 0 }}
        transition={{ duration: 0.5 }}
      />

      <div className="absolute top-4 right-4">
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.8 }}
          className="text-xs font-bold text-gray-400"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      </div>

      <div className="relative p-8 md:p-10">
        <div className="flex items-start gap-6">
          <motion.div
            animate={{
              rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
            className={`flex-shrink-0 ${feature.iconBg} p-4 rounded-2xl shadow-lg relative`}
          >
            <motion.div
              animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Icon className="w-8 h-8 text-white" strokeWidth={2} />
            </motion.div>

            <motion.div
              className="absolute inset-0 rounded-2xl bg-white"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isHovered ? [0, 1.5, 0] : 0,
                opacity: isHovered ? [0, 0.3, 0] : 0,
              }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>

          <div className="flex-1">
            <motion.div
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {feature.title}
                </h3>
              </div>

              <motion.p
                className="leading-relaxed text-gray-600"
                animate={{ opacity: isHovered ? 1 : 0.8 }}
              >
                {feature.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
                className="inline-block px-3 py-1 mt-4 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {feature.stats}
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : 0 }}
          transition={{ duration: 0.5 }}
        />

        {isHovered && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: "100%",
                  opacity: 0,
                }}
                animate={{
                  y: ["-10%", "-100%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  repeat: Infinity,
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default function VocabularySection() {
  return (
    <section className="relative px-4 py-24 overflow-hidden ">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-wide text-blue-600 uppercase transition-all bg-blue-100 rounded-full hover:bg-blue-200"
          >
            Học từ vựng hiệu quả
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl"
          >
            Cá nhân hóa theo bạn
            <motion.span
              className="block mt-2 text-transparent bg-gradient-to-r from-fuchsia-200 via-fuchsia-400 to-primary bg-clip-text"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Học 1000+ từ cốt lõi, ưu tiên <b>từ bạn hay sai</b> và
              <b> lộ trình riêng</b> cho mục tiêu TOEIC.
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-2xl mx-auto text-lg leading-relaxed text-gray-600 md:text-xl"
          >
            Kết hợp kho từ ETS chính thống và lộ trình học thông minh giúp bạn
            ghi nhớ hiệu quả
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:gap-8"
        >
          {vocabFeatures.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            className="relative px-8 py-4 text-lg font-semibold text-white overflow-hidden bg-gradient-to-r from-fuchsia-100 to-primary rounded-full shadow-xl"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative flex items-center gap-2">
              Bắt đầu học ngay
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </section>
  );
}
