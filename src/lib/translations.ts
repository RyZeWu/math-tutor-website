export interface Translations {
  title: string;
  subtitle: string;
  inputPlaceholder: string;
  practiceAddition: string;
  learnGeometry: string;
  timesTables: string;
  culturalExamples: string;
  bottomText: string;
}

export const translations: Record<string, Translations> = {
  en: {
    title: "MathTutor AI",
    subtitle: "What do you want to learn today?",
    inputPlaceholder: "Ask me anything about math...",
    practiceAddition: "📊 Practice Addition",
    learnGeometry: "📐 Learn Geometry", 
    timesTables: "🧮 Times Tables",
    culturalExamples: "🌍 Cultural Examples",
    bottomText: "AI-powered math education that adapts to your culture and language"
  },
  zh: {
    title: "数学导师 AI",
    subtitle: "今天你想学什么?",
    inputPlaceholder: "问我任何数学问题...",
    practiceAddition: "📊 练习加法",
    learnGeometry: "📐 学习几何",
    timesTables: "🧮 乘法表",
    culturalExamples: "🌍 文化示例",
    bottomText: "适应您的文化和语言的AI驱动数学教育"
  }
};