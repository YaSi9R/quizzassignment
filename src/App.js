"use client"
import "./Global.css"
import { useState } from "react"
import { QuizApp } from "./components/QuizApp"
import { Button, Card, CardContent } from "./components/Ui-components"

function App() {
  const [showQuiz, setShowQuiz] = useState(false)

  if (showQuiz) {
    return <QuizApp onBack={() => setShowQuiz(false)} />
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-400 via-slate-50 to-slate-300">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-primary/30 blur-3xl animate-float"></div>
      <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-accent/30 blur-3xl animate-float"></div>

      <Card className="max-w-3xl w-full animate-slide-in border bg-gradient-to-br from-inherit via-slate-300 to-orange-300 backdrop-blur-md shadow-xl border border-white/20">
        <CardContent className="text-center space-y-8">
          {/* Floating Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-gradient-to-br  from-primary to-accent p-6 shadow-lg animate-float">
              <svg className="h-16 w-16 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-card-foreground md:text-5xl animate-fade-in-up">
            Challenge Your Knowledge,{" "}
            <span className="bg-gradient-to-br from-inherit via-slate-800 to-slate-200  bg-clip-text text-transparent">
              One Quiz at a Time!
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground md:text-lg animate-fade-in-up">
            Test your knowledge across multiple categories with our engaging quiz platform. Track your progress, compete with friends, and discover new facts!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up">
            <Button  onClick={() => setShowQuiz(true)} className="flex-1">
              Start Quiz Now
            </Button>
            <Button variant="outline" className="flex-1">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
