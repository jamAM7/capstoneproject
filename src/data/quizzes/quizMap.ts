import { bubbleSortQuiz } from './bubbleSortQuiz'
import { selectionSortQuiz } from './selectionSortQuiz'
import { type Question } from './bubbleSortQuiz'

export const quizMap: Record<string, Question[]> = {
  'Bubble Sort': bubbleSortQuiz,
  'Selection Sort': selectionSortQuiz,
}

export type { Question }