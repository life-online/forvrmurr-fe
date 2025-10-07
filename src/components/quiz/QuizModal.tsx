"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import quizService, { QuizQuestion, QuizAnswers } from "@/services/quiz";
import { toastService } from "@/services/toast";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (results: any) => void;
}

export default function QuizModal({ isOpen, onClose, onComplete }: QuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Check authentication and fetch quiz questions on mount
  useEffect(() => {
    if (isOpen) {
      // Check if user is registered
      const isRegisteredUser = authService.isAuthenticated() && authService.isRegistered();

      if (!isRegisteredUser) {
        toastService.error("Let's get you an account so you can discover your perfect scent profile");
        setTimeout(() => {
          router.push('/auth/register');
          onClose();
        }, 2000);
        return;
      }

      fetchQuizQuestions();
    }
  }, [isOpen, router, onClose]);

  const fetchQuizQuestions = async () => {
    try {
      setLoading(true);
      const quizStructure = await quizService.getQuizStructure();
      setQuestions(quizStructure.questions);
    } catch (error: any) {
      console.error("Failed to fetch quiz questions:", error);

      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        toastService.error("Please log in to take the quiz");
        setTimeout(() => {
          router.push('/auth/register');
          onClose();
        }, 2000);
      } else {
        toastService.error("Failed to load quiz questions. Please try again.");
        onClose();
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
      toastService.success("Quiz completed! Here are your results.");
      onComplete?.(results);
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header with progress and close */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif font-semibold text-gray-900">
              Scent Profile Quiz
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          {questions.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-[#a0001e] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-[#a0001e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading quiz questions...</p>
              </div>
            </div>
          ) : currentQuestion ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 h-full flex flex-col"
              >
                {/* Question */}
                <div className="mb-8">
                  <h3 className="text-2xl md:text-3xl font-serif font-medium text-gray-900 mb-4">
                    {currentQuestion.question}
                  </h3>
                  {/* Custom description with selection limits */}
                  {currentQuestion.type === "multiple" && (
                    <p className="text-gray-600 text-lg mb-2">
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
                    <p className="text-gray-600 text-lg">
                      {currentQuestion.description}
                    </p>
                  )}
                </div>

                {/* Options */}
                <div className="flex-1 space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleOptionSelect(option.value)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                        isOptionSelected(option.value)
                          ? "border-[#a0001e] bg-[#a0001e]/5 shadow-lg"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-medium">
                          {option.label}
                        </span>
                        <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                          isOptionSelected(option.value)
                            ? "border-[#a0001e] bg-[#a0001e]"
                            : "border-gray-300"
                        }`}>
                          {isOptionSelected(option.value) && (
                            <div className="w-full h-full rounded-full bg-white scale-50" />
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>

        {/* Navigation Footer */}
        {!loading && (
          <div className="p-6 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
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
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isCurrentQuestionValid() && !submitting
                  ? "bg-[#a0001e] text-white hover:bg-[#8b0000]"
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
        )}
      </motion.div>
    </div>
  );
}