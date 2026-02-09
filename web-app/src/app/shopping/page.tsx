
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";
import { Plus, Trash2, Check, Share2, MoreVertical, ClipboardList } from "lucide-react";

interface ShoppingItem {
    id: string;
    name: string;
    amount: string;
    is_completed: boolean;
    source_recipe_id?: string;
    recipe?: {
        id: string;
        title: string;
        image_url?: string;
    };
}

interface GroupedItems {
    recipeId: string | null;
    recipeName: string;
    recipeImage?: string;
    items: ShoppingItem[];
}

export default function ShoppingList() {
    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [groupedItems, setGroupedItems] = useState<GroupedItems[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
    const [viewMode, setViewMode] = useState<'grouped' | 'merged'>('grouped');
    const [showModal, setShowModal] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemAmount, setNewItemAmount] = useState("");

    const groupByRecipe = (items: ShoppingItem[]): GroupedItems[] => {
        const groups = new Map<string | null, GroupedItems>();

        items.forEach(item => {
            const key = item.source_recipe_id || null;
            if (!groups.has(key)) {
                groups.set(key, {
                    recipeId: item.source_recipe_id || null,
                    recipeName: item.recipe?.title || '手动添加',
                    recipeImage: item.recipe?.image_url,
                    items: []
                });
            }
            groups.get(key)!.items.push(item);
        });

        return Array.from(groups.values());
    };

    const fetchItems = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("shopping_list")
            .select(`
                *,
                recipe:source_recipe_id (
                    id,
                    title,
                    image_url
                )
            `)
            .order("created_at", { ascending: false });

        if (data) {
            setItems(data as any);
            setGroupedItems(groupByRecipe(data as any));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const toggleItem = async (id: string, currentStatus: boolean) => {
        // Optimistic Update
        const updatedItems = items.map(i => i.id === id ? { ...i, is_completed: !currentStatus } : i);
        setItems(updatedItems);
        setGroupedItems(groupByRecipe(updatedItems));

        await supabase.from("shopping_list").update({ is_completed: !currentStatus }).eq("id", id);
    };

    const addItem = async () => {
        if (!newItemName.trim()) return;

        const newItem = {
            name: newItemName,
            amount: newItemAmount || "1份",
            is_completed: false,
            user_id: (await supabase.auth.getUser()).data.user?.id
        };

        const { data, error } = await supabase.from("shopping_list").insert(newItem).select().single();

        if (data) {
            const updatedItems = [data as any, ...items];
            setItems(updatedItems);
            setGroupedItems(groupByRecipe(updatedItems));
        } else {
            console.error(error);
        }

        setShowModal(false);
        setNewItemName("");
        setNewItemAmount("");
    };

    const clearCompleted = async () => {
        const toDelete = items.filter(i => i.is_completed).map(i => i.id);
        await supabase.from("shopping_list").delete().in("id", toDelete);
        const updatedItems = items.filter(i => !i.is_completed);
        setItems(updatedItems);
        setGroupedItems(groupByRecipe(updatedItems));
    };

    const filteredItems = items.filter(i => activeTab === 'pending' ? !i.is_completed : i.is_completed);

    return (
        <div className="min-h-screen bg-bg-main pb-20">
            <div className="bg-white sticky top-0 z-30 shadow-sm">
                <div className="flex justify-between items-center p-4">
                    <div className="w-10"></div>
                    <h1 className="text-lg font-bold">备菜清单</h1>
                    <button className="w-10 flex justify-end">
                        <MoreVertical size={20} />
                    </button>
                </div>

                <div className="flex px-6 border-b border-border-light">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`pb-3 mr-8 text-sm font-bold border-b-2 transition-colors ${activeTab === 'pending' ? 'border-success text-text-main' : 'border-transparent text-text-light'}`}
                    >
                        待备清单
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'completed' ? 'border-success text-text-main' : 'border-transparent text-text-light'}`}
                    >
                        已备记录
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4 pb-32">
                {viewMode === 'grouped' ? (
                    // Grouped by Recipe View
                    groupedItems
                        .filter(group => group.items.some(i => activeTab === 'pending' ? !i.is_completed : i.is_completed))
                        .map(group => {
                            const filteredGroupItems = group.items.filter(i => activeTab === 'pending' ? !i.is_completed : i.is_completed);
                            if (filteredGroupItems.length === 0) return null;

                            return (
                                <div key={group.recipeId || 'manual'} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    {/* Card Header */}
                                    <div className="p-4 flex items-center bg-success/10">
                                        {group.recipeImage ? (
                                            <img src={group.recipeImage} alt={group.recipeName} className="w-10 h-10 rounded-lg object-cover mr-3" />
                                        ) : (
                                            <div className="bg-white rounded-full p-1 mr-3">
                                                <ClipboardList className="text-success" size={16} />
                                            </div>
                                        )}
                                        <span className="font-bold flex-1">{group.recipeName}</span>
                                        <span className="text-xs text-text-light">{filteredGroupItems.length} 项</span>
                                    </div>

                                    {/* Ingredients List */}
                                    <div>
                                        {filteredGroupItems.map(item => (
                                            <div key={item.id} onClick={() => toggleItem(item.id, item.is_completed)} className="flex items-center p-4 border-b border-border-light last:border-none active:bg-gray-50 transition-colors cursor-pointer">
                                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${item.is_completed ? 'bg-success border-success' : 'border-gray-300'}`}>
                                                    {item.is_completed && <Check size={14} className="text-white" />}
                                                </div>
                                                <span className={`flex-1 text-base ${item.is_completed ? 'text-text-light line-through' : 'text-text-main'}`}>{item.name}</span>
                                                <span className="text-sm text-text-light">{item.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                ) : (
                    // Merged View
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-4 flex items-center bg-success/10">
                            <div className="bg-white rounded-full p-1 mr-3">
                                <ClipboardList className="text-success" size={16} />
                            </div>
                            <span className="font-bold flex-1">合计清单</span>
                        </div>

                        <div>
                            {items
                                .filter(i => activeTab === 'pending' ? !i.is_completed : i.is_completed)
                                .map(item => (
                                    <div key={item.id} onClick={() => toggleItem(item.id, item.is_completed)} className="flex items-center p-4 border-b border-border-light last:border-none active:bg-gray-50 transition-colors cursor-pointer">
                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${item.is_completed ? 'bg-success border-success' : 'border-gray-300'}`}>
                                            {item.is_completed && <Check size={14} className="text-white" />}
                                        </div>
                                        <span className={`flex-1 text-base ${item.is_completed ? 'text-text-light line-through' : 'text-text-main'}`}>{item.name}</span>
                                        <span className="text-sm text-text-light">{item.amount}</span>
                                    </div>
                                ))}
                            {items.filter(i => activeTab === 'pending' ? !i.is_completed : i.is_completed).length === 0 && (
                                <div className="p-8 text-center text-text-light text-sm">
                                    {activeTab === 'pending' ? '没有待备食材' : '没有已备记录'}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <button onClick={() => setShowModal(true)} className="w-full bg-white p-4 rounded-xl flex items-center justify-center gap-2 text-text-soft font-bold shadow-sm active:scale-[0.98] transition-transform">
                    <div className="w-6 h-6 rounded-full border-2 border-border-light flex items-center justify-center">
                        <Plus size={14} />
                    </div>
                    手动添加食材
                </button>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-24 left-4 right-4 space-y-2">
                {/* Row 1: Clear + Share */}
                <div className="flex gap-3">
                    <button onClick={clearCompleted} className="flex-1 flex items-center justify-center bg-gradient-to-r from-orange-400 to-pink-500 text-white h-12 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-transform">
                        <Trash2 size={18} className="mr-1" />
                        清除已备
                    </button>
                    <button className="flex-1 flex items-center justify-center bg-gradient-to-r from-orange-400 to-pink-500 text-white h-12 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-transform">
                        <Share2 size={18} className="mr-1" />
                        分享清单
                    </button>
                </div>

                {/* Row 2: Merge Toggle */}
                <button
                    onClick={() => setViewMode(viewMode === 'grouped' ? 'merged' : 'grouped')}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-orange-400 to-pink-500 text-white h-12 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-transform"
                >
                    <ClipboardList size={18} className="mr-1" />
                    {viewMode === 'grouped' ? '合计清单' : '按菜谱分组'}
                </button>
            </div>

            {/* Add Item Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold text-center mb-6">添加新食材</h3>

                        <div className="mb-4">
                            <label className="block text-sm text-text-light mb-1">食材名称</label>
                            <input
                                autoFocus
                                className="w-full p-3 bg-bg-secondary rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="请输入食材名称"
                                value={newItemName}
                                onChange={e => setNewItemName(e.target.value)}
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm text-text-light mb-1">数量 / 规格</label>
                            <input
                                className="w-full p-3 bg-bg-secondary rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="例如: 2个, 500g"
                                value={newItemAmount}
                                onChange={e => setNewItemAmount(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-bg-secondary text-text-soft font-bold">取消</button>
                            <button onClick={addItem} className="flex-1 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30">确认添加</button>
                        </div>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
