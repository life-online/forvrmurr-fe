import { apiRequest } from "./api";

export interface QuizOption {
  value: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  type: "single" | "multiple";
  required: boolean;
  maxSelections?: number;
  options: QuizOption[];
}

export interface QuizStructure {
  questions: QuizQuestion[];
}

export interface QuizAnswers {
  [questionId: string]: string | string[];
}

export interface QuizSubmissionRequest {
  userId: string;
  scentVibes: string[];
  moodIntentions: string[];
  genderPreference: string;
  dislikedNotes: string[];
  fragranceContexts: string[];
  familiarScents: string[];
  riskLevel: string;
  budgetLevel: string;
}

export interface QuizVerdict {
  scentEnergy: string;
  recommendedTier: string;
  summary: string;
}

export interface QuizAnswerItem {
  id: string;
  name: string;
  iconUrl: string;
}

export interface QuizResult {
  id: string;
  userId: string;
  answers: {
    scentVibes: QuizAnswerItem[];
    moodIntentions: QuizAnswerItem[];
    genderPreference: string;
    dislikedNotes: QuizAnswerItem[];
    fragranceContexts: QuizAnswerItem[];
    familiarScents: string[]; // Array of IDs for brands
    riskLevel: string;
    budgetLevel: string;
  };
  verdict: QuizVerdict;
  emailNotificationSent: boolean;
  createdAt: string;
  updatedAt: string;
}

const quizService = {
  /**
   * Get quiz structure/questions from backend
   */
  async getQuizStructure(): Promise<QuizStructure> {
    return apiRequest<QuizStructure>("/quizzes/structure", {
      requiresAuth: true,
    });
  },

  /**
   * Submit quiz answers and get results
   */
  async submitQuiz(answers: QuizAnswers): Promise<QuizResult> {
    // Import authService to get current user
    const { authService } = await import("./auth");
    const user = authService.getUser();

    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    // Transform answers object to match API structure
    const submissionData: QuizSubmissionRequest = {
      userId: user.id,
      scentVibes: Array.isArray(answers.scentVibes) ? answers.scentVibes : [answers.scentVibes].filter(Boolean),
      moodIntentions: Array.isArray(answers.moodIntentions) ? answers.moodIntentions : [answers.moodIntentions].filter(Boolean),
      genderPreference: answers.genderPreference as string || "",
      dislikedNotes: Array.isArray(answers.dislikedNotes) ? answers.dislikedNotes : [answers.dislikedNotes].filter(Boolean),
      fragranceContexts: Array.isArray(answers.fragranceContexts) ? answers.fragranceContexts : [answers.fragranceContexts].filter(Boolean),
      familiarScents: Array.isArray(answers.familiarScents) ? answers.familiarScents : [answers.familiarScents].filter(Boolean),
      riskLevel: answers.riskLevel as string || "",
      budgetLevel: answers.budgetLevel as string || "",
    };

    return apiRequest<QuizResult>("/quizzes", {
      method: "POST",
      body: JSON.stringify(submissionData),
      requiresAuth: true,
    });
  },

  /**
   * Get user's quiz results (if they've taken it before)
   */
  async getUserQuizResults(): Promise<QuizResult | null> {
    try {
      return await apiRequest<QuizResult>("/quizzes/my-results", {
        requiresAuth: true,
      });
    } catch (error) {
      // Return null if no results found
      return null;
    }
  },

  /**
   * Get user's latest quiz results
   */
  async getLatestQuizResults(): Promise<QuizResult | null> {
    try {
      return await apiRequest<QuizResult>("/quizzes/me/latest", {
        requiresAuth: true,
      });
    } catch (error) {
      console.error("Failed to fetch latest quiz results:", error);
      return null;
    }
  },
};

export default quizService;