/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Unique vibrant color palette
                'neon-pink': '#FF006E',
                'neon-purple': '#8338EC',
                'neon-blue': '#3A86FF',
                'cyber-yellow': '#FFBE0B',
                'cyber-orange': '#FB5607',
                'deep-space': '#0B0D17',
                'space-gray': '#1A1D29',
                'cosmic-purple': '#2D1B69',
                'electric-cyan': '#00F5FF',
                'lime-green': '#CCFF00',
            },
            fontFamily: {
                'display': ['Space Grotesk', 'sans-serif'],
                'body': ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-cosmic': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'gradient-fire': 'linear-gradient(135deg, #FF006E 0%, #FB5607 100%)',
                'gradient-cyber': 'linear-gradient(135deg, #8338EC 0%, #3A86FF 100%)',
                'gradient-neon': 'linear-gradient(135deg, #CCFF00 0%, #00F5FF 100%)',
                'gradient-sunset': 'linear-gradient(135deg, #FFBE0B 0%, #FF006E 100%)',
                'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(340,100%,76%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(22,100%,77%,1) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(242,100%,70%,1) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(343,100%,76%,1) 0px, transparent 50%)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'scale-in': 'scaleIn 0.5s ease-out',
                'rotate-slow': 'rotate 20s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 3s infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px #FF006E, 0 0 10px #FF006E, 0 0 15px #FF006E' },
                    '100%': { boxShadow: '0 0 10px #8338EC, 0 0 20px #8338EC, 0 0 30px #8338EC' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-100px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
            },
            boxShadow: {
                'neon-pink': '0 0 20px rgba(255, 0, 110, 0.5)',
                'neon-blue': '0 0 20px rgba(58, 134, 255, 0.5)',
                'neon-purple': '0 0 20px rgba(131, 56, 236, 0.5)',
                'cyber': '0 0 30px rgba(204, 255, 0, 0.3)',
            },
        },
    },
    plugins: [],
}
