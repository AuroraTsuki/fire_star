
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";
import { ChevronLeft, Image as ImageIcon, Plus, X, Upload } from "lucide-react";
import Link from "next/link";

export default function CreateRecipe() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
    const [steps, setSteps] = useState([{ title: "", description: "" }]);

    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }
            setUploading(true);
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('recipes')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('recipes').getPublicUrl(filePath);
            setImage(data.publicUrl);
        } catch (error: any) {
            let msg = error.message;
            if (msg.includes("The resource was not found")) {
                msg = "存储桶 'recipes' 不存在，请在 Supabase 后台创建并设为 Public。";
            }
            alert(`上传失败: ${msg}`);
        } finally {
            setUploading(false);
        }
    };

    const handleCreate = async () => {
        if (!title) {
            alert("请输入菜谱名称");
            return;
        }
        setLoading(true);

        const user = (await supabase.auth.getUser()).data.user;
        if (!user) {
            alert("请先登录");
            setLoading(false);
            return;
        }

        // 1. Create Recipe
        const { data: recipe, error } = await supabase.from("recipes").insert({
            title,
            user_id: user.id,
            image_url: image,
            difficulty: "Easy",
            time: "15m"
        }).select().single();

        if (error || !recipe) {
            console.error(error);
            alert("创建失败: " + (error?.message || "未知错误"));
            setLoading(false);
            return;
        }

        // 2. Add Ingredients (Mock implementation for now)
        if (ingredients.length > 0 && ingredients[0].name) {
            const { error: ingError } = await supabase.from("ingredients").insert(
                ingredients.map(ing => ({
                    recipe_id: recipe.id,
                    name: ing.name,
                    amount: ing.amount,
                }))
            );
            if (ingError) console.error("Error adding ingredients:", ingError);
        }

        // 3. Add Steps (Mock implementation for now)
        // ...

        setLoading(false);
        alert("菜谱发布成功！");
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-bg-main pb-40">
            <div className="bg-white p-4 flex items-center sticky top-0 z-30 shadow-sm">
                <Link href="/" className="p-2 -ml-2"><ChevronLeft /></Link>
                <h1 className="text-lg font-bold flex-1 text-center pr-8">创建新菜谱</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Cover Image Upload */}
                <div className="relative aspect-video bg-bg-secondary rounded-2xl flex flex-col items-center justify-center text-text-light border-2 border-dashed border-border-light overflow-hidden">
                    {image ? (
                        <img src={image} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <>
                            <ImageIcon size={48} className="mb-2 opacity-50" />
                            <span className="text-sm font-medium">{uploading ? "上传中..." : "点击上传封面图"}</span>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={handleImageUpload}
                        disabled={uploading}
                    />
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-bold mb-2">菜谱名称</label>
                    <input
                        className="w-full p-4  bg-white rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-primary/50 text-lg font-bold"
                        placeholder="给你的菜谱起个好听的名字"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>

                {/* Ingredients */}
                <div className="bg-white p-4 rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">食材清单</h3>
                        <span className="text-xs text-text-light">2 人份</span>
                    </div>
                    {ingredients.map((ing, idx) => (
                        <div key={idx} className="flex gap-3 mb-3 last:mb-0">
                            <input className="flex-[2] min-w-0 p-2 bg-bg-secondary rounded-lg text-sm" placeholder="食材名" value={ing.name} onChange={(e) => {
                                const newIngs = [...ingredients];
                                newIngs[idx].name = e.target.value;
                                setIngredients(newIngs);
                            }} />
                            <input className="flex-1 min-w-0 p-2 bg-bg-secondary rounded-lg text-sm" placeholder="用量" value={ing.amount} onChange={(e) => {
                                const newIngs = [...ingredients];
                                newIngs[idx].amount = e.target.value;
                                setIngredients(newIngs);
                            }} />
                        </div>
                    ))}
                    <button
                        onClick={() => setIngredients([...ingredients, { name: "", amount: "" }])}
                        className="mt-2 w-full py-2 text-primary text-sm font-bold flex items-center justify-center gap-1"
                    >
                        <Plus size={16} /> 添加食材
                    </button>
                </div>

                {/* Steps */}
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <h3 className="font-bold mb-4">烹饪步骤</h3>
                    {steps.map((step, idx) => (
                        <div key={idx} className="mb-6 last:mb-0 relative pl-6 border-l-2 border-primary/20">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm"></div>
                            <div className="mb-2 font-bold text-sm text-text-soft">步骤 {idx + 1}</div>
                            <textarea
                                className="w-full p-3 bg-bg-secondary rounded-xl text-sm min-h-[80px] outline-none mb-3"
                                placeholder="描述这一步的做法..."
                                value={step.description}
                                onChange={(e) => {
                                    const newSteps = [...steps];
                                    newSteps[idx].description = e.target.value;
                                    setSteps(newSteps);
                                }}
                            />
                            <div className="w-20 h-20 bg-bg-secondary rounded-lg flex items-center justify-center text-text-light cursor-pointer hover:bg-gray-200 transition-colors">
                                <Upload size={20} />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => setSteps([...steps, { title: "", description: "" }])}
                        className="w-full py-3 bg-bg-secondary rounded-xl text-text-soft font-bold flex items-center justify-center"
                    >
                        <Plus size={18} className="mr-2" />
                        添加步骤
                    </button>
                </div>
            </div>

            <div className="fixed bottom-24 left-6 right-6">
                <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="w-full h-12 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 flex items-center justify-center text-lg active:scale-[0.98] transition-transform"
                >
                    {loading ? "发布中..." : "发布菜谱"}
                </button>
            </div>

            <BottomNav />
        </div>
    );
}
