import React from 'react';

export default function Logo({ className = "h-8", light = false }) {
    return (
        <div className={`flex items-center space-x-2.5 group ${className}`}>
            <div className="relative flex-shrink-0">
                {/* Shield Background */}
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:rotate-12 transition-transform duration-500">
                    <path d="M50 5L10 25V55C10 75 50 95 50 95C50 95 90 75 90 55V25L50 5Z" 
                          fill="url(#shield_grad)" 
                          stroke={light ? "#ffffff" : "#2563eb"} 
                          strokeWidth="4" 
                    />
                    <path d="M35 35H65L45 65H35V35Z" fill="white" fillOpacity="0.2" />
                    <defs>
                        <linearGradient id="shield_grad" x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2563eb" />
                            <stop offset="1" stopColor="#3b82f6" />
                        </linearGradient>
                    </defs>
                </svg>
                {/* Negative L */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-black text-xl mb-0.5 ml-0.5">L</span>
                </div>
            </div>
            
            <div className="flex flex-col leading-none">
                <span className={`text-xl font-black tracking-tighter ${light ? 'text-white' : 'text-gray-900'}`}>
                    LENDÁRIOS
                </span>
                <span className={`text-[10px] font-bold tracking-[0.4em] ${light ? 'text-blue-400' : 'text-blue-600'}`}>
                    TEAM
                </span>
            </div>
        </div>
    );
}
