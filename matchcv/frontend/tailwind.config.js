/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Réduire toutes les tailles de 20% (équivalent zoom 80%)
      fontSize: {
        'xs': '0.6rem',     // 12px * 0.8 = 9.6px
        'sm': '0.7rem',     // 14px * 0.8 = 11.2px
        'base': '0.8rem',   // 16px * 0.8 = 12.8px
        'lg': '0.9rem',     // 18px * 0.8 = 14.4px
        'xl': '1rem',       // 20px * 0.8 = 16px
        '2xl': '1.2rem',    // 24px * 0.8 = 19.2px
        '3xl': '1.5rem',    // 30px * 0.8 = 24px
        '4xl': '1.8rem',    // 36px * 0.8 = 28.8px
        '5xl': '2.4rem',    // 48px * 0.8 = 38.4px
        '6xl': '3.2rem',    // 64px * 0.8 = 51.2px
      },
      spacing: {
        '0.5': '0.1rem',    // 2px * 0.8 = 1.6px
        '1': '0.2rem',      // 4px * 0.8 = 3.2px
        '1.5': '0.3rem',    // 6px * 0.8 = 4.8px
        '2': '0.4rem',      // 8px * 0.8 = 6.4px
        '2.5': '0.5rem',    // 10px * 0.8 = 8px
        '3': '0.6rem',      // 12px * 0.8 = 9.6px
        '3.5': '0.7rem',    // 14px * 0.8 = 11.2px
        '4': '0.8rem',      // 16px * 0.8 = 12.8px
        '5': '1rem',        // 20px * 0.8 = 16px
        '6': '1.2rem',      // 24px * 0.8 = 19.2px
        '7': '1.4rem',      // 28px * 0.8 = 22.4px
        '8': '1.6rem',      // 32px * 0.8 = 25.6px
        '9': '1.8rem',      // 36px * 0.8 = 28.8px
        '10': '2rem',       // 40px * 0.8 = 32px
        '11': '2.2rem',     // 44px * 0.8 = 35.2px
        '12': '2.4rem',     // 48px * 0.8 = 38.4px
        '14': '2.8rem',     // 56px * 0.8 = 44.8px
        '16': '3.2rem',     // 64px * 0.8 = 51.2px
        '20': '4rem',       // 80px * 0.8 = 64px
        '24': '4.8rem',     // 96px * 0.8 = 76.8px
        '28': '5.6rem',     // 112px * 0.8 = 89.6px
        '32': '6.4rem',     // 128px * 0.8 = 102.4px
        '36': '7.2rem',     // 144px * 0.8 = 115.2px
        '40': '8rem',       // 160px * 0.8 = 128px
        '44': '8.8rem',     // 176px * 0.8 = 140.8px
        '48': '9.6rem',     // 192px * 0.8 = 153.6px
        '52': '10.4rem',    // 208px * 0.8 = 166.4px
        '56': '11.2rem',    // 224px * 0.8 = 179.2px
        '60': '12rem',      // 240px * 0.8 = 192px
        '64': '12.8rem',    // 256px * 0.8 = 204.8px
        '72': '14.4rem',    // 288px * 0.8 = 230.4px
        '80': '16rem',      // 320px * 0.8 = 256px
        '96': '19.2rem',    // 384px * 0.8 = 307.2px
      },
      borderRadius: {
        'sm': '0.1rem',     // 2px * 0.8 = 1.6px
        'DEFAULT': '0.2rem', // 4px * 0.8 = 3.2px
        'md': '0.3rem',     // 6px * 0.8 = 4.8px
        'lg': '0.4rem',     // 8px * 0.8 = 6.4px
        'xl': '0.6rem',     // 12px * 0.8 = 9.6px
        '2xl': '0.8rem',    // 16px * 0.8 = 12.8px
        '3xl': '1.2rem',    // 24px * 0.8 = 19.2px
      },
      lineHeight: {
        'tight': '1.1',
        'snug': '1.2',
        'normal': '1.3',
        'relaxed': '1.4',
        'loose': '1.5',
      }
    },
  },
  plugins: [],
}