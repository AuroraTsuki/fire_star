
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        let error;

        if (isSignUp) {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });
            error = signUpError;
            if (!error) {
                alert("注册成功！请检查邮箱完成验证（如果是开发环境可能已自动确认）");
            }
        } else {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            error = signInError;
        }

        if (error) {
            setErrorMsg(error.message);
        } else {
            router.push("/profile");
            router.refresh();
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bg-main flex flex-col justify-center px-6 pb-20">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold mb-2 text-primary">
                    {isSignUp ? "创建账号" : "欢迎回来"}
                </h1>
                <p className="text-text-soft">
                    {isSignUp ? "开启您的美食之旅" : "登录以管理您的菜谱和清单"}
                </p>
            </div>

            <form onSubmit={handleAuth} className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-text-light">邮箱</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={20} />
                        <input
                            type="email"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-bg-secondary rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 ml-1 text-text-light">密码</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={20} />
                        <input
                            type="password"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-bg-secondary rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {errorMsg && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                        {errorMsg}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-orange-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                            {isSignUp ? "注册" : "登录"}
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-text-soft text-sm font-medium hover:text-primary transition-colors"
                >
                    {isSignUp ? "已有账号？去登录" : "没有账号？去注册"}
                </button>
            </div>

            <div className="mt-8 text-center">
                <Link href="/" className="text-text-light text-xs hover:underline">暂不登录，随便看看</Link>
            </div>
        </div>
    );
}
