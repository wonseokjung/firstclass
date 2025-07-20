export interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
  description: string;
  hasQuiz?: boolean;
  quiz?: LessonQuiz;
}

export interface Question {
  id: number;
  type: 'multiple' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}

export interface LessonQuiz {
  id: number;
  lessonId: number;
  questions: Question[];
  requiredScore: number;
  timeLimit?: number; // 분 단위
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  instructor: string;
  rating: number;
  studentCount: number;
  totalDuration: string;
  price: number;
  isPaid: boolean;
  lessons: Lesson[];
  createdAt: Date;
  updatedAt: Date;
} 