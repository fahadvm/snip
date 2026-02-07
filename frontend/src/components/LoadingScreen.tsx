import React from 'react';

const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-deep-space overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-pink/10 rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] animate-pulse-slow"></div>

            <div className="relative flex flex-col items-center">
                {/* Logo or Brand Mark */}
                <div className="mb-8 relative">
                    <div className="w-20 h-20 border-t-2 border-r-2 border-neon-pink rounded-xl animate-spin shadow-[0_0_15px_rgba(255,0,110,0.5)]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-black text-white italic tracking-tighter">S</span>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="flex flex-col items-center gap-3">
                    <h2 className="text-2xl font-black text-white tracking-[0.2em] animate-pulse">
                        INITIALIZING
                    </h2>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-neon-pink rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce"></span>
                    </div>
                </div>

                {/* Cyber Decorative Elements */}
                <div className="mt-12 flex items-center gap-6 opacity-20">
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-white"></div>
                    <span className="text-[10px] font-mono text-white uppercase tracking-[0.5em]">System_Online</span>
                    <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-white"></div>
                </div>
            </div>

            {/* Scanning Line Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
                <div className="w-full h-[2px] bg-white animate-[scan_3s_linear_infinite]"></div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { transform: translateY(-100vh); }
                    100% { transform: translateY(100vh); }
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
