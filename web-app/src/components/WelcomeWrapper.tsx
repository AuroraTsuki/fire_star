"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WelcomePage from './WelcomePage';

export default function WelcomeWrapper({ children }: { children: React.ReactNode }) {
    // Default to false to avoid flash on server render mismatch, 
    // we'll set it to true in useEffect if needed.
    // actually, for a "welcome screen", we might want it visible initially locally 
    // but blocking interactions? 
    // Better strategy: start true, but only if we know we are on client?
    // standard next.js way: use a loading state or just useEffect.
    const [showWelcome, setShowWelcome] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // Register Service Worker for PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => console.log('SW registered: ', registration))
                .catch((registrationError) => console.log('SW registration failed: ', registrationError));
        }
    }, []);

    const handleEnterApp = () => {
        setShowWelcome(false);
    };

    return (
        <>
            <AnimatePresence mode="wait">
                {showWelcome && (
                    <motion.div
                        key="welcome"
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white"
                    >
                        <WelcomePage onEnter={handleEnterApp} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                className={`transition-opacity duration-500 delay-200 ${(!isMounted || showWelcome) ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
            >
                {children}
            </div>
        </>
    );
}
