// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // ✅ src 안의 모든 컴포넌트 포함
  ],
  theme: {
    extend: {
      fontFamily: {
        dung: ['DungGeunMo', 'sans-serif'], // 👈 눈누 폰트 이름
      },
    },
  },
  plugins: [],
};