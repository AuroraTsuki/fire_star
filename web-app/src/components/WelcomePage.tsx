import { useState, useEffect } from 'react';
import { Heart, ChefHat, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
    onEnter: () => void;
};

export default function WelcomePage({ onEnter }: Props) {
    const [showContent, setShowContent] = useState(true);

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* 动态背景气泡 */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-10 left-10 w-96 h-96 bg-rose-300/30 rounded-full blur-3xl"
                ></motion.div>
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-1/3 right-20 w-80 h-80 bg-pink-300/30 rounded-full blur-3xl"
                ></motion.div>
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.25, 0.45, 0.25],
                    }}
                    transition={{
                        duration: 9,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-20 left-1/3 w-72 h-72 bg-orange-300/30 rounded-full blur-3xl"
                ></motion.div>
            </div>

            {/* 漂浮的爱心装饰 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            y: "100vh",
                            x: `${Math.random() * 100}%`,
                            opacity: 0
                        }}
                        animate={{
                            y: "-20vh",
                            opacity: [0, 0.6, 0],
                        }}
                        transition={{
                            duration: 8 + Math.random() * 4,
                            repeat: Infinity,
                            delay: i * 1.5,
                            ease: "linear"
                        }}
                        className="absolute"
                    >
                        <Heart
                            className="text-rose-300/40"
                            size={16 + Math.random() * 16}
                            fill="currentColor"
                        />
                    </motion.div>
                ))}
            </div>

            {/* 主内容区 */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
                <AnimatePresence>
                    {showContent && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center max-w-lg"
                        >
                            {/* Logo区域 */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 15,
                                    delay: 0.2
                                }}
                                className="mb-8 relative"
                            >
                                <div className="relative inline-block">
                                    <motion.div
                                        animate={{
                                            rotate: [0, 5, -5, 0],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <div className="w-32 h-32 mx-auto backdrop-blur-xl bg-white/60 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50">
                                            <ChefHat className="w-16 h-16 text-rose-500" strokeWidth={1.5} />
                                        </div>
                                    </motion.div>

                                    {/* 装饰性爱心 */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 10, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute -top-2 -right-2"
                                    >
                                        <Heart
                                            className="w-10 h-10 text-rose-500"
                                            fill="currentColor"
                                        />
                                    </motion.div>

                                    <motion.div
                                        animate={{
                                            scale: [1, 1.15, 1],
                                        }}
                                        transition={{
                                            duration: 2.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 0.5
                                        }}
                                        className="absolute -bottom-1 -left-3"
                                    >
                                        <Sparkles
                                            className="w-8 h-8 text-orange-400"
                                            fill="currentColor"
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* 标题 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mb-4"
                            >
                                <h1 className="text-4xl mb-3">
                                    <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                                        爱的食光
                                    </span>
                                </h1>
                                <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
                                    <span>一起</span>
                                    <Heart className="w-5 h-5 text-rose-400 fill-current" />
                                    <span>烹饪幸福</span>
                                </div>
                            </motion.div>

                            {/* 描述文字 */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="text-gray-500 mb-12 leading-relaxed backdrop-blur-md bg-white/40 rounded-3xl p-6 border border-white/50"
                            >
                                记录每一道为爱烹制的美食
                                <br />
                                分享属于我们的独家味道
                                <br />
                                让爱在厨房里升温 💕
                            </motion.p>

                            {/* 进入按钮 */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                onClick={onEnter}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-12 py-4 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 text-white rounded-full shadow-2xl overflow-hidden"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-rose-400"
                                    initial={{ x: "100%" }}
                                    whileHover={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <span className="relative z-10 flex items-center gap-2 text-lg">
                                    开始我们的美食之旅
                                    <Heart className="w-5 h-5 group-hover:fill-current transition-all" />
                                </span>
                            </motion.button>

                            {/* 装饰性文字 */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="mt-8 text-xs text-gray-400"
                            >
                                <motion.span
                                    animate={{
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    用心烹饪 · 以爱调味 · 共享美好
                                </motion.span>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 底部装饰波浪 */}
            <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, -50, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-0 left-0 right-0"
                >
                    <svg
                        viewBox="0 0 1440 120"
                        className="w-full h-32"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill="rgba(255, 255, 255, 0.3)"
                            d="M0,64 C240,96 480,96 720,64 C960,32 1200,32 1440,64 L1440,120 L0,120 Z"
                        />
                        <path
                            fill="rgba(255, 255, 255, 0.5)"
                            d="M0,80 C240,48 480,48 720,80 C960,112 1200,112 1440,80 L1440,120 L0,120 Z"
                        />
                    </svg>
                </motion.div>
            </div>
        </div>
    );
}
