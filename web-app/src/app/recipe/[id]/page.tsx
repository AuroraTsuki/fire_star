
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
    const [user, setUser] = useState<any>(null);
    const [recipe, setRecipe] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        async function fetchRecipe() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

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

                // Check if favorite
                if (user) {
                    const { data: fav, error } = await supabase
                        .from('favorites')
                        .select('id')
                        .eq('user_id', user.id)
                        .eq('recipe_id', params.id)
                        .maybeSingle();

                    if (!error) {
                        setIsFavorite(!!fav);
                    }
                }
            }
            setLoading(false);
        }
        fetchRecipe();
    }, [params.id]);

    const addToShoppingList = async () => {
        alert("已加入备菜清单");
    };

    const handleFavoriteToggle = async () => {
        if (!user) {
            alert("请先登录");
            return;
        }

        if (isFavorite) {
            // Unfavorite
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('recipe_id', params.id);

            if (error) {
                console.error(error);
                alert("取消收藏失败");
            } else {
                setIsFavorite(false);
            }
        } else {
            // Favorite
            const { error } = await supabase
                .from('favorites')
                .insert({
                    user_id: user.id,
                    recipe_id: params.id
                });

            if (error) {
                console.error(error);
                alert("收藏失败");
            } else {
                setIsFavorite(true);
            }
        }
    };

    const handleDelete = async () => {
        if (!confirm("确定要删除这个菜谱吗？")) return;

        const { error } = await supabase
            .from("recipes")
            .delete()
            .eq("id", params.id);

        if (error) {
            alert("删除失败: " + error.message);
        } else {
            alert("菜谱已删除");
            router.replace("/profile");
        }
    };

    if (loading) return <div className="min-h-screen bg-bg-main p-10 text-center">加载中...</div>;
    if (!recipe) return <div className="min-h-screen bg-bg-main p-10 text-center">菜谱不存在</div>;

    const isAuthor = user && recipe.user_id === user.id;

    return (
        <div className="min-h-screen bg-bg-main pb-24">
            {/* Nav */}
            <div className="fixed top-0 left-0 right-0 z-40 p-safe flex justify-between items-center px-4 py-2 bg-gradient-to-b from-black/50 to-transparent">
                <button onClick={() => router.back()} className="bg-white/90 backdrop-blur rounded-full p-2 shadow-sm"><ChevronLeft size={20} /></button>
                <div className="flex gap-3">
                    {isAuthor && (
                        <button onClick={handleDelete} className="bg-white/90 backdrop-blur rounded-full p-2 shadow-sm text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                        </button>
                    )}
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
                        <span className="text-sm text-primary font-medium">{recipe.servings || '2'} 人份</span>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                        {recipe.ingredients && recipe.ingredients.length > 0 ? (
                            recipe.ingredients.map((ing: any, idx: number) => (
                                <div key={ing.id || idx} className="flex justify-between py-3 border-b border-border-light last:border-none">
                                    <span>{ing.name}</span>
                                    <span className="font-bold">{ing.amount}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-text-light py-4">暂无食材信息</div>
                        )}
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
                        {recipe.steps && recipe.steps.length > 0 ? (
                            recipe.steps.map((step: any, idx: number) => (
                                <div key={step.id || idx} className="relative pl-8 border-l-2 border-border-light ml-3">
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-4 border-white shadow-sm ${idx === 0 ? 'bg-primary' : 'bg-gray-300'}`}></div>
                                    <h4 className="font-bold mb-2">步骤 {step.step_number || idx + 1}</h4>
                                    <p className="text-text-soft text-sm leading-relaxed">{step.description}</p>
                                    {step.image_url && (
                                        <img src={step.image_url} alt={`Step ${idx + 1}`} className="mt-3 rounded-lg w-full object-cover max-h-48" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-text-soft text-sm">暂无步骤信息</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Action */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 pb-8 border-t border-border-light flex items-center gap-4 z-40">
                <button onClick={handleFavoriteToggle} className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-bg-secondary border-transparent text-text-soft'}`}>
                    <Heart size={24} fill={isFavorite ? "#ef4444" : "none"} />
                </button>
                <button className="flex-1 bg-primary text-white h-12 rounded-xl font-bold shadow-lg shadow-primary/30">
                    开始烹饪
                </button>
            </div>
        </div>
    );
}
