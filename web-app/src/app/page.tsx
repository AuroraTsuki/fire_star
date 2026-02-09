
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";
import { Search, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
};

interface Recipe {
    id: string;
    title: string;
    image_url: string;
    cooking_time: string;
    difficulty: string;
    author: {
        username: string;
        avatar_url: string;
    };
    views: number;
}

const CATEGORIES = ["全部", "早餐", "午餐", "晚餐", "甜点", "饮品", "小吃"];

export default function Home() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("全部");
    const [search, setSearch] = useState("");

    const fetchRecipes = async () => {
        setLoading(true);
        let query = supabase.from("recipes").select(`
      *,
      author:user_id (
        username,
        avatar_url
      )
    `);

        if (category !== "全部") {
            query = query.eq("category", category);
        }

        if (search) {
            query = query.ilike("title", `%${search}%`);
        }

        const { data, error } = await query;
        if (!error && data) {
            // Mock data mapping if necessary or type assertion
            setRecipes(data as any); // Type simplified for demo
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRecipes();
    }, [category]); // Search usually triggers on enter or debounce, simple effect here

    return (
        <div className="min-h-screen bg-bg-main pb-24">
            {/* Header */}
            <div className="bg-bg-main sticky top-0 z-40 p-4">
                <h1 className="text-lg font-bold mb-4">菜谱广场</h1>

                {/* Search */}
                <div className="relative mb-4">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="搜索美味食谱..."
                        className="w-full h-10 bg-white rounded-full pl-10 pr-4 text-sm shadow-sm border-none focus:ring-2 focus:ring-primary/50 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchRecipes()}
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${category === cat
                                ? "bg-primary text-white shadow-md shadow-primary/30"
                                : "bg-white text-text-soft hover:bg-white/80"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recipe List */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="px-4 grid grid-cols-2 gap-3"
            >
                {loading ? (
                    <div className="col-span-2 text-center py-20 text-text-light">加载中...</div>
                ) : recipes.length === 0 ? (
                    <div className="col-span-2 text-center py-20 text-text-light">暂无相关菜谱</div>
                ) : (
                    recipes.map((recipe) => (
                        <motion.div key={recipe.id} variants={itemVariants}>
                            <Link href={`/recipe/${recipe.id}`} className="block group">
                                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        <img
                                            src={recipe.image_url || 'https://images.unsplash.com/photo-1495521821378-860fa017191d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzc2VydHxlbnwwfHwwfHx8MA%3D%3D'}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1 text-white text-[10px]">
                                            <TrendingUp size={10} />
                                            <span>{recipe.views || 0}</span>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-bold text-sm mb-2 truncate">{recipe.title}</h3>
                                        <div className="flex justify-between items-center text-xs text-text-light">
                                            <div className="flex items-center gap-1">
                                                <Clock size={12} />
                                                <span>{recipe.cooking_time || '15m'}</span>
                                            </div>
                                            <span className={`${recipe.difficulty === 'Easy' ? 'text-success' : 'text-primary'}`}>
                                                {recipe.difficulty || '初级'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                )}
            </motion.div>

            <BottomNav />
        </div>
    );
}
