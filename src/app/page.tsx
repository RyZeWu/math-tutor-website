import { ChatInterface } from '@/components/chat/ChatInterface';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MathTutor AI
              </h1>
              <span className="ml-3 text-sm text-gray-500">Culturally Tailored Math Education</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Learn Math Your Way
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered tutor adapts to your cultural background and language, 
            making math concepts easier to understand through familiar examples and analogies.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Multi-language support with automatic translation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Cultural analogies for better understanding</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Personalized learning paths</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Progress tracking and achievements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Safe and inclusive environment</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <ol className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
                  <span>Ask questions in your preferred language</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
                  <span>Our AI translates and understands your needs</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">3</span>
                  <span>Receive explanations with cultural examples</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">4</span>
                  <span>Practice and track your progress</span>
                </li>
              </ol>
            </div>
          </div>

          <div>
            <ChatInterface studentId="demo-user" />
          </div>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-semibold mb-6 text-center">Supported Languages & Cultures</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">🇪🇸</div>
              <p className="font-medium">Spanish</p>
              <p className="text-sm text-gray-600">Latino cultures</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">🇨🇳</div>
              <p className="font-medium">Mandarin</p>
              <p className="text-sm text-gray-600">Chinese culture</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl mb-2">🇮🇳</div>
              <p className="font-medium">Hindi</p>
              <p className="text-sm text-gray-600">Indian culture</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl mb-2">🇸🇦</div>
              <p className="font-medium">Arabic</p>
              <p className="text-sm text-gray-600">Middle Eastern</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl mb-2">🇯🇵</div>
              <p className="font-medium">Japanese</p>
              <p className="text-sm text-gray-600">Japanese culture</p>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-3xl mb-2">🇰🇷</div>
              <p className="font-medium">Korean</p>
              <p className="text-sm text-gray-600">Korean culture</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <div className="text-3xl mb-2">🇵🇭</div>
              <p className="font-medium">Tagalog</p>
              <p className="text-sm text-gray-600">Filipino culture</p>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-3xl mb-2">🌍</div>
              <p className="font-medium">More...</p>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm">© 2024 MathTutor AI. Making math accessible for everyone.</p>
            <p className="text-xs mt-2 text-gray-400">Inclusive education for all backgrounds and cultures</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
