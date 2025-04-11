const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#5E4AE3',         // Vibrant Purple: Main actions, buttons, active states, highlights
        secondary: '#F7B801',       // Yellow/Orange: Accents, gamification elements, secondary actions
        accent: '#11CEC5',          // Teal: Tertiary highlights, informational icons/badges
        neutral: '#333333',         // Dark Gray: Primary text content
        'neutral-focus': '#111111', // Darker Gray: Hover states for neutral elements
        'base-100': '#FFFFFF',      // White: Main page background, card backgrounds
        'base-200': '#F4F4F4',      // Light Gray: Subtle background differentiation, input backgrounds
        'base-300': '#E0E0E0',      // Gray: Borders, dividers, disabled states
        info: '#2094f3',            // Blue: Informational messages, alerts
        success: '#009485',         // Green: Success messages, confirmation
        warning: '#ff9900',         // Orange: Warning messages, alerts
        error: '#ff5724',           // Red: Error messages, destructive actions
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};