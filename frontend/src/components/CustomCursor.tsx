import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(true);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        // Only initialize on devices with a mouse/fine pointer
        if (window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        const onMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsHidden(false);

            const target = e.target as HTMLElement;
            setIsPointer(
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') !== null ||
                target.closest('button') !== null
            );
        };

        const onMouseDown = () => setIsClicking(true);
        const onMouseUp = () => setIsClicking(false);
        const onMouseLeave = () => setIsHidden(true);
        const onMouseEnter = () => setIsHidden(false);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        document.documentElement.addEventListener('mouseleave', onMouseLeave);
        document.documentElement.addEventListener('mouseenter', onMouseEnter);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            document.documentElement.removeEventListener('mouseleave', onMouseLeave);
            document.documentElement.removeEventListener('mouseenter', onMouseEnter);
        };
    }, []);

    if (isHidden) return null;

    return (
        <>
            {/* Main Dot */}
            <div
                className={`fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] transition-transform duration-100 ease-out mix-blend-difference ${isClicking ? 'scale-75' : 'scale-100'
                    }`}
                style={{
                    transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
                }}
            />

            {/* Outer Ring / Glow */}
            <div
                className={`fixed top-0 left-0 w-8 h-8 border-2 rounded-full pointer-events-none z-[9998] transition-all duration-300 ease-out ${isPointer
                    ? 'border-neon-pink w-12 h-12 bg-neon-pink/10 opacity-100'
                    : 'border-white/30 opacity-50'
                    } ${isClicking ? 'scale-90' : 'scale-100'}`}
                style={{
                    transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
                }}
            />

            {/* Trail / Inner Glow */}
            <div
                className="fixed top-0 left-0 w-20 h-20 bg-neon-purple/5 blur-2xl rounded-full pointer-events-none z-[9997]"
                style={{
                    transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
                }}
            />
        </>
    );
};

export default CustomCursor;
