import React from "react";

export const AuroraBackground = ({ className, children, showRadialGradient = true, ...props }) => {
    return (
        <div
            className={`relative flex flex-col h-[100vh] items-center justify-center bg-slate-950 text-slate-950 transition-bg ${className || ''}`}
            {...props}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className={`
            filter blur-[10px]
            after:content-[''] after:absolute after:inset-0 
            after:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:attachment-fixed after:mix-blend-difference
            
            before:content-[''] before:absolute before:inset-0
            before:[background-image:var(--dark-gradient),var(--aurora)]
            before:[background-size:200%,_100%]
            before:animate-aurora before:attachment-fixed before:mix-blend-difference
            before:[animation-direction:reverse] before:[animation-duration:40s] before:opacity-50
            
            pointer-events-none
            absolute -inset-[10px] opacity-5
            will-change-transform
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)]
            [--aurora:repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)]
          `}
                />
            </div>
            {children}
        </div>
    );
};
