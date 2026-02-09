
"use client";


import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { Settings, LogOut, ChevronRight, Heart, BookOpen, Utensils, Camera, X, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Profile() {
    const router = useRouter();
    const [myRecipes, setMyRecipes] = useState<any[]>([]);

    useEffect(() => {
        async function getData() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            setUser(user);

            // Fetch Profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileData) {
                setProfile(profileData);
                setEditName(profileData.username || "");
            } else {
                const newProfile = {
                    username: user.email?.split('@')[0] || '美食家',
                    avatar_url: ''
                };
                setProfile(newProfile);
                setEditName(newProfile.username);
            }

            // Fetch My Recipes
            const { data: recipesData } = await supabase
                .from('recipes')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (recipesData) {
                setMyRecipes(recipesData);
            }

            setLoading(false);
        }
        getData();
    }, [router]);

    // ... (keep handleSignOut, handleUpdateProfile, handleAvatarUpload)

    // ... (keep render)

    // Replace "My Recipes Section"
    <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            我的作品
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-2">
            <Link href="/create" className="aspect-[4/3] bg-bg-secondary rounded-xl flex flex-col items-center justify-center text-text-light border-2 border-dashed border-border-light hover:bg-orange-50 hover:border-orange-200 hover:text-orange-500 transition-colors">
                <span className="text-2xl mb-1">+</span>
                <span className="text-xs font-bold">发布新菜谱</span>
            </Link>
            {myRecipes.map(recipe => (
                <Link href={`/recipe/${recipe.id}`} key={recipe.id} className="block group">
                    <div className="bg-white rounded-xl overflow-hidden border border-border-light shadow-sm hover:shadow-md transition-all">
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                            <img
                                src={recipe.image_url || '/placeholder-recipe.jpg'} // Fallback image
                                alt={recipe.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1495521821378-860fa017191d?w=300';
                                }}
                            />
                        </div>
                        <div className="p-2">
                            <h4 className="font-bold text-sm truncate">{recipe.title}</h4>
                            <div className="flex justify-between items-center text-xs text-text-light mt-1">
                                <span>{recipe.cooking_time || '15m'}</span>
                                <span>{recipe.views || 0} 阅读</span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </div>

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const handleUpdateProfile = async () => {
        try {
            setUploading(true);
            const updates = {
                id: user.id,
                username: editName,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;

            setProfile({ ...profile, username: editName });
            setIsEditing(false);
            alert("资料更新成功！");
        } catch (error: any) {
            alert("更新失败: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            setUploading(true);
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}-${Math.random()}.${fileExt}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                console.error("Storage upload error:", uploadError);
                throw new Error(`图片上传失败: ${uploadError.message}`);
            }

            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

            // 2. Update Profile in Database
            const updates = {
                id: user.id,
                avatar_url: publicUrl,
                updated_at: new Date().toISOString(),
            };

            const { error: updateError } = await supabase.from('profiles').upsert(updates);

            if (updateError) {
                console.error("Profile update error:", updateError);
                throw new Error(`资料更新失败: ${updateError.message}`);
            }

            setProfile({ ...profile, avatar_url: publicUrl });
            alert("头像上传成功！");

        } catch (error: any) {
            console.error("Error in handleAvatarUpload:", error);
            let msg = error.message;

            if (msg.includes("new row violates row-level security policy")) {
                msg = "权限不足：请检查 Supabase Storage 策略 (RLS) 是否允许上传。";
            } else if (msg.includes("The resource was not found")) {
                msg = "存储桶 'avatars' 不存在，请在 Supabase 后台创建。";
            }

            alert(msg);
        } finally {
            setUploading(false);
            if (event.target) event.target.value = '';
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-bg-main pb-24 relative">
            {/* Header / Banner */}
            <div className="bg-white p-6 pt-12 pb-8 rounded-b-3xl shadow-sm mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-primary">
                    <Utensils size={120} />
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white shadow-md overflow-hidden relative group">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100 text-3xl">
                                {profile?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                        {/* Edit Avatar Overlay */}
                        <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="text-white" size={24} />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarUpload}
                            className="hidden"
                            accept="image/*"
                            disabled={uploading}
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold mb-1">{profile?.username || '用户'}</h1>
                        <p className="text-xs text-text-light bg-bg-secondary px-2 py-1 rounded-lg inline-block">
                            {user.email}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-text-light hover:bg-gray-50 rounded-full active:bg-gray-100"
                    >
                        <Settings size={20} />
                    </button>
                </div>

                <div className="flex justify-around mt-8">
                    <div className="text-center">
                        <div className="font-bold text-lg">0</div>
                        <div className="text-xs text-text-light">关注</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-lg">0</div>
                        <div className="text-xs text-text-light">粉丝</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-lg">0</div>
                        <div className="text-xs text-text-light">获赞</div>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <div className="px-4 space-y-4">
                {/* My Recipes Section */}
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <BookOpen size={18} className="text-primary" />
                        我的作品
                    </h3>

                    <div className="grid grid-cols-2 gap-3 mb-2">
                        <Link href="/create" className="aspect-[4/3] bg-bg-secondary rounded-xl flex flex-col items-center justify-center text-text-light border-2 border-dashed border-border-light hover:bg-orange-50 hover:border-orange-200 hover:text-orange-500 transition-colors">
                            <span className="text-2xl mb-1">+</span>
                            <span className="text-xs font-bold">发布新菜谱</span>
                        </Link>
                    </div>
                </div>

                {/* Favorites Section */}
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <Heart size={18} className="text-red-500" />
                            收藏菜谱
                        </h3>
                        <span className="text-xs text-text-light flex items-center">
                            全部 <ChevronRight size={12} />
                        </span>
                    </div>
                    <div className="text-center py-8 text-text-light text-sm">
                        暂无收藏
                    </div>
                </div>

                {/* Sign Out Button */}
                <button
                    onClick={handleSignOut}
                    className="w-full bg-white p-4 rounded-xl text-red-500 font-bold shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                    <LogOut size={18} />
                    退出登录
                </button>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-text-light hover:text-text-main">
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-bold text-center mb-6">编辑资料</h3>

                        <div className="mb-6 flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-4xl text-text-light">
                                        {profile?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={32} />
                                </div>
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="text-white animate-spin" size={32} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm text-text-light mb-1">用户昵称</label>
                            <input
                                autoFocus
                                className="w-full p-3 bg-bg-secondary rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleUpdateProfile}
                            disabled={uploading}
                            className="w-full py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                        >
                            {uploading ? <Loader2 className="animate-spin" /> : "保存修改"}
                        </button>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}

