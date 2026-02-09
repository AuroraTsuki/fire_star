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
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Always show welcome page on every visit
    }, []);

    const handleEnterApp = () => {
        setShowWelcome(false);
        // Removed localStorage persistence - show welcome every time
    };

    if (!isClient) return null; // Prevent hydration mismatch

    return (
        <>
            <AnimatePresence mode="wait">
                {showWelcome && (
                    <motion.div
                        key="welcome"
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white" // ensure it covers everything
                    >
                        <WelcomePage onEnter={handleEnterApp} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 
               We render children always, but maybe hide them visually 
               or just let the welcome page cover them.
               If we conditionally render children, we might lose state or cause re-mounts.
               Covering is better for "app feeling".
            */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showWelcome ? 0 : 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {children}
            </motion.div>
        </>
    );
}
