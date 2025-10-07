"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiCheck } from "react-icons/fi";
import quizService, { QuizQuestion, QuizAnswers, QuizResult } from "@/services/quiz";
import { toastService } from "@/services/toast";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";
import QuizResults from "./QuizResults";

interface QuizWizardProps {
  onComplete?: (results: any) => void;
}

export default function QuizWizard({ onComplete }: QuizWizardProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const router = useRouter();

  // Fetch quiz questions on mount
  useEffect(() => {
    fetchQuizQuestions();
  }, []);

  const fetchQuizQuestions = async () => {
    try {
      setLoading(true);

      // Check if user is registered
      const isRegisteredUser = authService.isAuthenticated() && authService.isRegistered();

      if (!isRegisteredUser) {
        toastService.error("Let's get you an account so you can discover your perfect scent profile");
        setTimeout(() => {
          router.push('/auth/register');
        }, 2000);
        return;
      }

      const quizStructure = await quizService.getQuizStructure();
      setQuestions(quizStructure.questions);
    } catch (error: any) {
      console.error("Failed to fetch quiz questions:", error);

      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        toastService.error("Please log in to take the quiz");
        setTimeout(() => {
          router.push('/auth/register');
        }, 2000);
      } else {
        toastService.error("Failed to load quiz questions. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  // Get max selections for specific questions
  const getMaxSelections = (questionId: string, defaultMax?: number) => {
    switch (questionId) {
      case 'dislikedNotes': // Question 4
        return 3;
      case 'fragranceContexts': // Question 5
        return 3;
      case 'familiarScents': // Question 6
        return 5;
      default:
        return defaultMax;
    }
  };

  // Check if current question is answered sufficiently
  const isCurrentQuestionValid = () => {
    if (!currentQuestion) return false;

    const answer = answers[currentQuestion.id];

    // All questions are required now
    if (!answer) return false;
    if (Array.isArray(answer) && answer.length === 0) return false;

    // Check max selections for multiple choice with custom limits
    if (currentQuestion.type === "multiple" && Array.isArray(answer)) {
      const maxSelections = getMaxSelections(currentQuestion.id, currentQuestion.maxSelections);
      if (maxSelections && answer.length > maxSelections) {
        return false;
      }
    }

    return true;
  };

  // Handle option selection
  const handleOptionSelect = (optionValue: string) => {
    if (!currentQuestion) return;

    const questionId = currentQuestion.id;

    if (currentQuestion.type === "single") {
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionValue
      }));

      // Auto-advance for single selection after short delay
      setTimeout(() => {
        if (!isLastQuestion) {
          handleNext();
        }
      }, 300);
    } else {
      // Multiple selection
      setAnswers(prev => {
        const currentAnswers = (prev[questionId] as string[]) || [];
        const isSelected = currentAnswers.includes(optionValue);
        const maxSelections = getMaxSelections(currentQuestion.id, currentQuestion.maxSelections);

        let newAnswers: string[];
        if (isSelected) {
          // Remove if already selected
          newAnswers = currentAnswers.filter(answer => answer !== optionValue);
        } else {
          // Add if not selected (check max selections with custom limits)
          if (maxSelections && currentAnswers.length >= maxSelections) {
            // Replace the first selection with new one to maintain limit
            newAnswers = [...currentAnswers.slice(1), optionValue];
          } else {
            newAnswers = [...currentAnswers, optionValue];
          }
        }

        return {
          ...prev,
          [questionId]: newAnswers
        };
      });
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (!isCurrentQuestionValid()) return;

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Submit quiz
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const results = await quizService.submitQuiz(answers);

      // Check if user is registered
      const isRegisteredUser = authService.isAuthenticated() && authService.isRegistered();

      if (isRegisteredUser) {
        // Registered users: show results briefly then redirect to profile page
        setQuizResult(results);
        toastService.success("Quiz completed! Redirecting to your profile...");

        setTimeout(() => {
          router.push('/profile/quiz-results');
        }, 3000); // Show results for 3 seconds then redirect
      } else {
        // Unregistered users: show results with registration nudge
        setQuizResult(results);
        toastService.success("Quiz completed! Register to save your results to your profile.");
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      toastService.error("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Check if option is selected
  const isOptionSelected = (optionValue: string) => {
    if (!currentQuestion) return false;

    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === "single") {
      return answer === optionValue;
    } else {
      return Array.isArray(answer) && answer.includes(optionValue);
    }
  };

  // Start quiz handler
  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  // Handle closing quiz results
  const handleCloseResults = () => {
    setQuizResult(null);
    // Reset quiz to allow retaking
    setCurrentQuestionIndex(0);
    setAnswers({});
    // Don't call onComplete which might hide the quiz - just close the results modal
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#a0001e] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-serif text-gray-900 mb-4">Preparing Your Scent Discovery Journey</h2>
          <p className="text-gray-600">Loading personalized questions...</p>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#a0001e] to-[#8b0000] flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🌸</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
              Ready to Discover Your Perfect Scent?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              This personalized quiz will analyze your preferences and create a unique scent profile just for you.
              It takes about 3-5 minutes to complete.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="text-center p-6 bg-[#f7ede1] rounded-lg">
              <div className="w-12 h-12 rounded-full bg-[#a0001e] flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">8</span>
              </div>
              <h3 className="font-serif text-lg text-gray-900 mb-2">8 Questions</h3>
              <p className="text-sm text-gray-600">Carefully crafted to understand your preferences</p>
            </div>

            <div className="text-center p-6 bg-[#f7ede1] rounded-lg">
              <div className="w-12 h-12 rounded-full bg-[#a0001e] flex items-center justify-center mx-auto mb-4">
                <span className="text-white">⚡</span>
              </div>
              <h3 className="font-serif text-lg text-gray-900 mb-2">3-5 Minutes</h3>
              <p className="text-sm text-gray-600">Quick and easy - no long forms</p>
            </div>

            <div className="text-center p-6 bg-[#f7ede1] rounded-lg">
              <div className="w-12 h-12 rounded-full bg-[#a0001e] flex items-center justify-center mx-auto mb-4">
                <span className="text-white">🎯</span>
              </div>
              <h3 className="font-serif text-lg text-gray-900 mb-2">Personalized</h3>
              <p className="text-sm text-gray-600">Results tailored specifically to you</p>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="bg-[#a0001e] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#8b0000] transition-colors"
          >
            Start My Scent Discovery
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-gray-600">No questions available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-serif font-medium text-gray-900">
            Scent Profile Quiz
          </h2>
          <span className="text-sm text-gray-600">
            {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-[#a0001e] to-[#8b0000] h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% complete</span>
            <span>Almost there!</span>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="min-h-[500px] flex flex-col"
        >
          {/* Question */}
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-6">
              {currentQuestion.question}
            </h3>

            {/* Custom description with selection limits */}
            {currentQuestion.type === "multiple" && (
              <p className="text-lg text-gray-600 mb-2">
                {(() => {
                  const maxSelections = getMaxSelections(currentQuestion.id, currentQuestion.maxSelections);
                  const currentSelections = Array.isArray(answers[currentQuestion.id])
                    ? (answers[currentQuestion.id] as string[]).length
                    : 0;

                  if (currentQuestion.id === 'dislikedNotes') {
                    return `Select up to 3 fragrance notes you dislike. (${currentSelections}/3 selected)`;
                  } else if (currentQuestion.id === 'fragranceContexts') {
                    return `Select up to 3 contexts where you'll wear this fragrance. (${currentSelections}/3 selected)`;
                  } else if (currentQuestion.id === 'familiarScents') {
                    return `Select up to 5 brands/houses you're familiar with. (${currentSelections}/5 selected)`;
                  } else if (maxSelections) {
                    return `Select up to ${maxSelections} options. (${currentSelections}/${maxSelections} selected)`;
                  } else {
                    return currentQuestion.description || "Select all that apply.";
                  }
                })()}
              </p>
            )}
            {currentQuestion.description && currentQuestion.type === "single" && (
              <p className="text-lg text-gray-600">
                {currentQuestion.description}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="flex-1 space-y-4 mb-12">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleOptionSelect(option.value)}
                className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-300 hover:shadow-lg group ${
                  isOptionSelected(option.value)
                    ? "border-[#a0001e] bg-gradient-to-r from-[#a0001e]/5 to-[#8b0000]/5 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium text-lg group-hover:text-gray-800">
                    {option.label}
                  </span>
                  <div className={`w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                    isOptionSelected(option.value)
                      ? "border-[#a0001e] bg-[#a0001e]"
                      : "border-gray-300 group-hover:border-gray-400"
                  }`}>
                    {isOptionSelected(option.value) && (
                      <FiCheck className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-8 border-t border-gray-200">
        <button
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isFirstQuestion
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FiChevronLeft size={20} />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!isCurrentQuestionValid() || submitting}
          className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-colors ${
            isCurrentQuestionValid() && !submitting
              ? "bg-[#a0001e] text-white hover:bg-[#8b0000] shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : isLastQuestion ? (
            "Complete Quiz"
          ) : (
            <>
              Next
              <FiChevronRight size={20} />
            </>
          )}
        </button>
      </div>

      {/* Quiz Results Modal */}
      {quizResult && (
        <QuizResults
          result={quizResult}
          onClose={handleCloseResults}
        />
      )}
    </div>
  );
}