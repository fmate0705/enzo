import type { Config } from 'tailwindcss';

/**
 * Every color is wired through its channel token so opacity modifiers work:
 * `bg-primary/10`, `border-border/60`, `ring-focus/25`. Tailwind can only compute those when
 * it can reach the sRGB channels — an opaque `var()` holding a hex value makes it silently emit
 * no rule at all.
 */
const withAlpha = (token: string) => `rgb(var(--cef-${token}-rgb) / <alpha-value>)`;

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: withAlpha('background'),
        surface: withAlpha('surface'),
        'surface-raised': withAlpha('surface-raised'),
        foreground: withAlpha('foreground'),
        muted: withAlpha('muted'),
        border: withAlpha('border'),
        primary: withAlpha('primary'),
        'primary-foreground': withAlpha('primary-foreground'),
        accent: withAlpha('accent'),
        'accent-foreground': withAlpha('accent-foreground'),
        success: withAlpha('success'),
        warning: withAlpha('warning'),
        danger: withAlpha('danger'),
        info: withAlpha('info'),
        focus: withAlpha('focus'),
      },
      fontFamily: {
        sans: ['var(--cef-font-sans)'],
        serif: ['var(--cef-font-serif)'],
        mono: ['var(--cef-font-mono)'],
      },
      fontSize: {
        xs: ['var(--cef-text-xs)', { lineHeight: 'var(--cef-leading-xs)' }],
        sm: ['var(--cef-text-sm)', { lineHeight: 'var(--cef-leading-sm)' }],
        base: ['var(--cef-text-base)', { lineHeight: 'var(--cef-leading-base)' }],
        lg: ['var(--cef-text-lg)', { lineHeight: 'var(--cef-leading-lg)' }],
        xl: ['var(--cef-text-xl)', { lineHeight: 'var(--cef-leading-xl)' }],
        '2xl': ['var(--cef-text-2xl)', { lineHeight: 'var(--cef-leading-2xl)' }],
        '3xl': ['var(--cef-text-3xl)', { lineHeight: 'var(--cef-leading-3xl)' }],
        '4xl': ['var(--cef-text-4xl)', { lineHeight: 'var(--cef-leading-4xl)' }],
        '5xl': ['var(--cef-text-5xl)', { lineHeight: 'var(--cef-leading-5xl)' }],
        '6xl': ['var(--cef-text-6xl)', { lineHeight: 'var(--cef-leading-6xl)' }],
        '7xl': ['var(--cef-text-7xl)', { lineHeight: 'var(--cef-leading-7xl)' }],
      },
      borderRadius: {
        sm: 'var(--cef-radius-sm)',
        DEFAULT: 'var(--cef-radius-md)',
        md: 'var(--cef-radius-md)',
        lg: 'var(--cef-radius-lg)',
        xl: 'var(--cef-radius-xl)',
        '2xl': 'var(--cef-radius-2xl)',
      },
      boxShadow: {
        sm: 'var(--cef-shadow-sm)',
        DEFAULT: 'var(--cef-shadow-md)',
        md: 'var(--cef-shadow-md)',
        lg: 'var(--cef-shadow-lg)',
        xl: 'var(--cef-shadow-xl)',
        '2xl': 'var(--cef-shadow-2xl)',
      },
      transitionDuration: {
        fast: 'var(--cef-duration-fast)',
        DEFAULT: 'var(--cef-duration-normal)',
        normal: 'var(--cef-duration-normal)',
        slow: 'var(--cef-duration-slow)',
      },
      transitionTimingFunction: {
        DEFAULT: 'var(--cef-ease-standard)',
        standard: 'var(--cef-ease-standard)',
        decelerate: 'var(--cef-ease-decelerate)',
        accelerate: 'var(--cef-ease-accelerate)',
        emphasized: 'var(--cef-ease-emphasized)',
      },
      maxWidth: {
        container: 'var(--cef-container-xl)',
      },
    },
  },
  plugins: [],
};

export default config;
