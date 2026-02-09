
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ChevronLeft, Share2, Clock, Zap, ClipboardList, Heart } from "lucide-react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

interface RecipeDetailProps {
    params: { id: string };
}

export default function RecipeDetail({ params }: RecipeDetailProps) {
    const router = useRouter();
    const [recipe, setRecipe] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        async function fetchRecipe() {
            const { data, error } = await supabase
                .from("recipes")
                .select(`
            *,
            author:user_id ( username, avatar_url )
        `)
                .eq("id", params.id)
                .single();

            if (data) {
                setRecipe(data);
                // Fetch ingredients and steps would go here or be continuous if structured that way
                // For now assuming joined or simple structure for demo
            }
            setLoading(false);
        }
        fetchRecipe();
    }, [params.id]);

    const addToShoppingList = async () => {
        // Add ingredients to shopping list
        // Mock logic
        alert("已加入备菜清单");
    };

    if (loading) return <div className="min-h-screen bg-bg-main p-10 text-center">加载中...</div>;
    if (!recipe) return <div className="min-h-screen bg-bg-main p-10 text-center">菜谱不存在</div>;

    return (
        <div className="min-h-screen bg-bg-main pb-24">
            {/* Nav */}
            <div className="fixed top-0 left-0 right-0 z-40 p-safe flex justify-between items-center px-4 py-2 bg-gradient-to-b from-black/50 to-transparent">
                <button onClick={() => router.back()} className="bg-white/90 backdrop-blur rounded-full p-2 shadow-sm"><ChevronLeft size={20} /></button>
                <div className="flex gap-3">
                    <button className="bg-white/90 backdrop-blur rounded-full p-2 shadow-sm"><Share2 size={20} /></button>
                </div>
            </div>

            {/* Hero Image */}
            <div className="relative aspect-[4/3] w-full">
                <img src={recipe.image_url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
                    <p className="text-sm opacity-90 line-clamp-2">{recipe.description}</p>
                </div>
            </div>

            <div className="bg-bg-main relative -mt-4 rounded-t-3xl p-6">
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3">
                        <Clock className="text-primary" size={24} />
                        <div>
                            <div className="text-xs text-text-light">烹饪时间</div>
                            <div className="font-bold">{recipe.cooking_time || '15m'}</div>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3">
                        <Zap className="text-primary" size={24} />
                        <div>
                            <div className="text-xs text-text-light">难度等级</div>
                            <div className="font-bold">{recipe.difficulty || 'Easy'}</div>
                        </div>
                    </div>
                </div>

                {/* Ingredients */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">食材清单</h3>
                        <span className="text-sm text-primary font-medium">2 人份</span>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                        {/* Mock Ingredients */}
                        <div className="flex justify-between py-3 border-b border-border-light">
                            <span>西红柿</span>
                            <span className="font-bold">2个</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-border-light last:border-none">
                            <span>鸡蛋</span>
                            <span className="font-bold">3个</span>
                        </div>
                    </div>
                    <button onClick={addToShoppingList} className="w-full bg-secondary text-white py-3 rounded-xl font-bold shadow-md shadow-secondary/20 flex items-center justify-center gap-2 active:scale-[0.98]">
                        <ClipboardList size={20} />
                        加入备菜清单
                    </button>
                </div>

                {/* Steps */}
                <div>
                    <h3 className="font-bold text-lg mb-4">烹饪步骤</h3>
                    <div className="space-y-6">
                        {/* Mock Steps */}
                        <div className="relative pl-8 border-l-2 border-border-light ml-3">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm"></div>
                            <h4 className="font-bold mb-2">步骤 1</h4>
                            <p className="text-text-soft text-sm leading-relaxed">准备好所有食材，洗净备用。</p>
                        </div>
                        <div className="relative pl-8 border-l-2 border-border-light ml-3">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-300 border-4 border-white shadow-sm"></div>
                            <h4 className="font-bold mb-2">步骤 2</h4>
                            <p className="text-text-soft text-sm leading-relaxed">起锅烧油...</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Action */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 pb-8 border-t border-border-light flex items-center gap-4 z-40">
                <button onClick={() => setIsFavorite(!isFavorite)} className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-bg-secondary border-transparent text-text-soft'}`}>
                    <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                </button>
                <button className="flex-1 bg-primary text-white h-12 rounded-xl font-bold shadow-lg shadow-primary/30">
                    开始烹饪
                </button>
            </div>
        </div>
    );
}
