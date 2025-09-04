import { useState, useEffect } from "react"
import { LoaderIcon, RotateIcon, ClockIcon, StarIcon, SettingsIcon } from "./Icons"
import { Card, CardHeader, CardContent, CardTitle, Button, Progress, Badge, Select, SelectItem } from "./Ui-components"
import { FaTrophy } from "react-icons/fa6";


async function fetchTriviaQuestions(amount = 8, difficulty) {
    try {
        let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple&encode=url3986`
        if (difficulty && difficulty !== "mixed") {
            url += `&difficulty=${difficulty}`
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (!data.results || data.results.length === 0) {
            throw new Error("No questions received from API")
        }

        return data.results.map((item, index) => {
            try {
                // Decode URL-encoded strings with better error handling
                const question = decodeURIComponent(item.question)
                const correctAnswer = decodeURIComponent(item.correct_answer)
                const incorrectAnswers = item.incorrect_answers.map((ans) => decodeURIComponent(ans))

                // Randomize answer positions
                const allAnswers = [...incorrectAnswers, correctAnswer]
                const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5)
                const correctIndex = shuffledAnswers.indexOf(correctAnswer)

                return {
                    id: `trivia-${Date.now()}-${index}`,
                    question,
                    options: shuffledAnswers,
                    correctAnswer: correctIndex,
                    difficulty: item.difficulty,
                    category: decodeURIComponent(item.category),
                }
            } catch (decodeError) {
                console.error("Error decoding question:", decodeError)
                throw new Error("Failed to process question data")
            }
        })
    } catch (error) {
        console.error("Error fetching trivia questions:", error)
        throw error
    }
}

const getHighScores = () => {
    if (typeof window === "undefined") return []
    const scores = localStorage.getItem("quiz-high-scores")
    return scores ? JSON.parse(scores) : []
}

const saveHighScore = (score) => {
    if (typeof window === "undefined") return
    const scores = getHighScores()
    scores.push(score)
    scores.sort((a, b) => b.percentage - a.percentage)
    const topScores = scores.slice(0, 10) // Keep top 10 scores
    localStorage.setItem("quiz-high-scores", JSON.stringify(topScores))
}

export function QuizApp({ onBack }) {

    const [quizState, setQuizState] = useState({
        questions: [],
        currentQuestionIndex: 0,
        selectedAnswers: [],
        isComplete: false,
        score: 0,
        isLoading: true,
        error: null,
        timeLeft: 30,
        timerEnabled: false,
        difficulty: "mixed",
    })

    const [showSettings, setShowSettings] = useState(false)
    const [highScores, setHighScores] = useState([])


    // for timer in each question
    useEffect(() => {
        let interval

        // 
        if (quizState.timerEnabled && quizState.timeLeft > 0 && !quizState.isComplete && !quizState.isLoading) {
            interval = setInterval(() => {
                setQuizState((prev) => {
                    // if question times is up
                    if (prev.timeLeft <= 1) {
                        // maybe it was not the last question
                        if (prev.currentQuestionIndex < prev.questions.length - 1) {
                            return {
                                ...prev,
                                currentQuestionIndex: prev.currentQuestionIndex + 1,
                                timeLeft: 30,
                            }
                        } else {
                            // Finish quiz bcoz it is a last question
                            const score = prev.selectedAnswers.reduce((total, answer, index) => {
                                if (answer === prev.questions[index]?.correctAnswer) {
                                    return total + 1
                                }
                                return total
                            }, 0)

                            return {
                                ...prev,
                                isComplete: true,
                                score,
                                timeLeft: 0,
                            }
                        }
                    }
                    return { ...prev, timeLeft: prev.timeLeft - 1 }
                })
            }, 1000)
        }

        return () => clearInterval(interval)
    }, [
        quizState.timerEnabled,
        quizState.timeLeft,
        quizState.isComplete,
        quizState.isLoading,
        quizState.currentQuestionIndex,
    ])

    useEffect(() => {
        setHighScores(getHighScores())
    }, [])

    // Load questions on component mount
    useEffect(() => {
        if (!showSettings) {
            loadQuestions()
        }
    }, [showSettings, quizState.difficulty])

    const loadQuestions = async () => {
        setQuizState((prev) => ({ ...prev, isLoading: true, error: null }))

        try {
            // Always try API first with enhanced error handling
            const questions = await fetchTriviaQuestions(
                8, // Load 8 questions as requested (5-10 range)
                quizState.difficulty === "mixed" ? undefined : quizState.difficulty,
            )

            if (questions.length === 0) {
                throw new Error("No questions received")
            }

            setQuizState((prev) => ({
                ...prev,
                questions,
                selectedAnswers: new Array(questions.length).fill(null),
                isLoading: false,
                currentQuestionIndex: 0,
                timeLeft: 30,
                isComplete: false,
                score: 0,
            }))
        } catch (error) {
            console.error("Failed to load questions from API:", error)

            // Enhanced fallback with user notification

        }
    }

    const selectAnswer = (answerIndex) => {
        if (quizState.isComplete) return

        const newSelectedAnswers = [...quizState.selectedAnswers]
        newSelectedAnswers[quizState.currentQuestionIndex] = answerIndex

        setQuizState((prev) => ({
            ...prev,
            selectedAnswers: newSelectedAnswers,
        }))
    }

    const nextQuestion = () => {
        if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
            setQuizState((prev) => ({
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex + 1,
                timeLeft: 30,
            }))
        } else {
            finishQuiz()
        }
    }

    const previousQuestion = () => {
        if (quizState.currentQuestionIndex > 0) {
            setQuizState((prev) => ({
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex - 1,
                timeLeft: 30,
            }))
        }
    }

    const finishQuiz = () => {
        const score = quizState.selectedAnswers.reduce((total, answer, index) => {
            if (answer === quizState.questions[index]?.correctAnswer) {
                return total + 1
            }
            return total
        }, 0)

        const percentage = Math.round((score / quizState.questions.length) * 100)
        const newHighScore = {
            score,
            total: quizState.questions.length,
            percentage,
            difficulty: quizState.difficulty,
            date: new Date().toLocaleDateString(),
        }

        saveHighScore(newHighScore)
        setHighScores(getHighScores())

        setQuizState((prev) => ({
            ...prev,
            isComplete: true,
            score,
        }))
    }

    const restartQuiz = () => {
        setQuizState((prev) => ({
            ...prev,
            questions: [],
            currentQuestionIndex: 0,
            selectedAnswers: [],
            isComplete: false,
            score: 0,
            isLoading: true,
            error: null,
            timeLeft: 30,
        }))
        loadQuestions()
    }

    // After clicking on setting it will show

    if (showSettings) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
                <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-md border border-white/20 shadow-lg rounded-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                            <SettingsIcon className="w-6 h-6 text-indigo-500 animate-spin-slow" />
                            Quiz Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-6">
                            {/* Difficulty Level */}
                            <div>
                                <label className="text-sm font-semibold mb-2 block text-gray-700">Difficulty Level</label>
                                <Select
                                    value={quizState.difficulty}
                                    onValueChange={(value) => setQuizState((prev) => ({ ...prev, difficulty: value }))}
                                    className="bg-white border border-gray-300 rounded-md shadow-sm hover:border-indigo-400 focus:ring-indigo-300"
                                >
                                    <SelectItem value="mixed">Mixed Difficulty</SelectItem>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </Select>
                            </div>

                            {/* Timer */}
                            <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-lg border border-indigo-100 shadow-sm">
                                <div>
                                    <label className="text-sm font-medium text-gray-800">Timer (30 seconds per question)</label>
                                    <p className="text-xs text-gray-600">Auto-advance when time runs out</p>
                                </div>
                                <Button
                                    variant={quizState.timerEnabled ? "default" : "outline"}
                                    size="sm"
                                    className={quizState.timerEnabled ? "bg-indigo-500 text-white hover:bg-indigo-600" : "border-indigo-400 text-indigo-600 hover:bg-indigo-50"}
                                    onClick={() => setQuizState((prev) => ({ ...prev, timerEnabled: !prev.timerEnabled }))}
                                >
                                    {quizState.timerEnabled ? "Enabled" : "Disabled"}
                                </Button>
                            </div>
                        </div>

                        {/* High Scores */}
                        {highScores.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                    <StarIcon className="text-yellow-400 w-5 h-5 animate-pulse" />
                                    High Scores
                                </h3>
                                <div className="space-y-2 max-h-[280px] overflow-y-auto">
                                    {highScores.map((score, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-gray-200 rounded shadow-sm hover:scale-[1.02] transition-transform duration-200"
                                        >
                                            <div>
                                                <span className="font-medium text-gray-800">
                                                    {score.score}/{score.total}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-2">
                                                    ({score.percentage}%) - {score.difficulty}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400">{score.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-4">
                            <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg shadow-md" onClick={() => setShowSettings(false)}>
                                Start Quiz
                            </Button>
                            <Button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium px-6 py-2 rounded-lg shadow-sm" variant="outline" onClick={() => setShowSettings(false)}>
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }



    // During loading
    if (quizState.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <Card className="w-full max-w-md animate-slide-in">
                    <CardContent className="flex flex-col items-center justify-center p-8">
                        <LoaderIcon className="w-18 h-18 text-primary animate-spin-slow" />
                        <p className="text-gray-700 text-center mt-4 font-medium">
                            Loading quiz questions from API...
                        </p>
                        <Badge variant="secondary" className="mt-3">
                            Difficulty: {quizState.difficulty === "mixed" ? "Mixed" : quizState.difficulty}
                        </Badge>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Error view
    if (quizState.error) {
        const isOfflineMode = quizState.error.includes("offline questions")

        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-yellow-50 to-red-50 p-4">
                <Card className="w-full max-w-md animate-slide-in">
                    <CardContent className="flex flex-col items-center justify-center p-8">
                        <div
                            className={`p-6 rounded-xl mb-6 text-center border-2 w-full ${isOfflineMode
                                    ? "bg-yellow-100 border-yellow-300"
                                    : "bg-red-100 border-red-300"
                                } shadow-md`}
                        >
                            <p
                                className={`font-bold mb-3 text-lg ${isOfflineMode ? "text-yellow-700" : "text-red-700"
                                    }`}
                            >
                                {isOfflineMode ? "⚠️ Offline Mode" : "❌ Connection Error"}
                            </p>
                            <p className={`${isOfflineMode ? "text-yellow-800" : "text-red-800"} text-sm`}>
                                {quizState.error}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={loadQuestions} variant="default" className="flex-1">
                                {isOfflineMode ? "🔄 Retry Online" : "🔄 Try Again"}
                            </Button>
                            <Button onClick={() => setShowSettings(true)} variant="outline" className="flex-1">
                                ⚙️ Settings
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }


    // Results view
    if (quizState.isComplete) {
        const percentage = Math.round((quizState.score / quizState.questions.length) * 100)

        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-400 via-indigo-500 to-blue-500">
                <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <FaTrophy className="w-14 h-16 text-yellow-400 animate-bounce" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-gray-800">Quiz Complete!</CardTitle>
                        <Badge variant="secondary" className="mx-auto bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full">
                            {quizState.difficulty} difficulty
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                            <div className="text-5xl font-extrabold text-indigo-600 mb-2 animate-pulse">
                                {quizState.score}/{quizState.questions.length}
                            </div>
                            <p className="text-gray-700 text-lg">You scored {percentage}% on this quiz</p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-xl text-gray-800">Review Your Answers:</h3>
                            {quizState.questions.map((question, index) => {
                                const userAnswer = quizState.selectedAnswers[index]
                                const isCorrect = userAnswer === question.correctAnswer

                                return (
                                    <div
                                        key={question.id}
                                        className={`border-2 p-4 rounded-lg transition-all duration-200 ${isCorrect ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-medium flex-1 text-gray-800">
                                                {index + 1}. {question.question}
                                            </p>
                                            {question.difficulty && (
                                                <Badge variant="outline" className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                    {question.difficulty}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <p className={isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                                Your answer: {userAnswer !== null ? question.options[userAnswer] : "No answer"} {isCorrect ? " ✓" : " ✗"}
                                            </p>
                                            {!isCorrect && (
                                                <p className="text-green-700 font-medium">
                                                    Correct answer: {question.options[question.correctAnswer]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                       <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
  <Button
    onClick={restartQuiz}
    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base whitespace-nowrap"
  >
    <RotateIcon /> Take Quiz Again
  </Button>
  <Button
    onClick={() => setShowSettings(true)}
    variant="outline"
    className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-sm sm:text-base whitespace-nowrap"
  >
    Settings
  </Button>
</div>

                    </CardContent>
                </Card>
            </div>
        )
    }

    // Quiz view
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex]
    const selectedAnswer = quizState.selectedAnswers[quizState.currentQuestionIndex]
    const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-400 via-slate-50 to-slate-300">
            <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-md shadow-xl border border-white/20">
                <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                        <CardTitle className="text-xl font-bold text-gray-800">Quiz App</CardTitle>
                        <div className="flex items-center gap-3">
                            {quizState.timerEnabled && (
                                <div className={`flex items-center gap-1 text-sm font-semibold ${quizState.timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-gray-700"}`}>
                                    <ClockIcon /> {quizState.timeLeft}s
                                </div>
                            )}
                            <span className="text-sm text-gray-700">Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}</span>
                            <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}><SettingsIcon /></Button>
                        </div>
                    </div>
                    <Progress value={progress} className="w-full bg-gray-200 rounded-full h-2" />
                </CardHeader>

                <CardContent className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800">{currentQuestion?.question}</h2>
                    <div className="grid gap-3">
                        {currentQuestion?.options.map((option, index) => (
                            <Button
                                key={index}
                                variant={selectedAnswer === index ? "default" : "outline"}
                                className={`text-left h-auto p-4 rounded-lg transition-all duration-200 ${selectedAnswer === index ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "bg-white hover:bg-indigo-50 border border-gray-300"}`}
                                onClick={() => selectAnswer(index)}
                            >
                                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                                {option}
                            </Button>
                        ))}
                    </div>

                    <div className="flex justify-between">
                        <Button variant="outline" onClick={previousQuestion} disabled={quizState.currentQuestionIndex === 0}>Previous</Button>
                        <Button onClick={nextQuestion} className="bg-indigo-500 hover:bg-indigo-600 text-white" disabled={selectedAnswer === null}>{quizState.currentQuestionIndex === quizState.questions.length - 1 ? "Finish" : "Next"}</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
