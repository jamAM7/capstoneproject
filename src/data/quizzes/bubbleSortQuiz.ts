export type Question = {
  question: string
  options: string[]
  correctIndex: number
}

export const bubbleSortQuiz: Question[] = [
  {
    question: 'What is the worst case time complexity of bubble sort?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctIndex: 2,
  },
  {
    question: 'In bubble sort, after the first full pass through the array, what is guaranteed?',
    options: [
      'The smallest element is in its correct position',
      'The largest element is in its correct position',
      'The array is fully sorted',
      'The middle element is in its correct position',
    ],
    correctIndex: 1,
  },
  {
    question: 'How many comparisons are made in the first pass of bubble sort on an array of n elements?',
    options: ['n', 'n - 1', 'n / 2', 'n²'],
    correctIndex: 1,
  },
  {
    question: 'Which of the following best describes what bubble sort does on each pass?',
    options: [
      'Finds the minimum and places it at the front',
      'Splits the array in half and sorts each half',
      'Compares adjacent elements and swaps them if out of order',
      'Inserts each element into its correct position',
    ],
    correctIndex: 2,
  },
  {
    question: 'Is bubble sort a stable sorting algorithm?',
    options: [
      'No, it swaps elements so order is not preserved',
      'Yes, equal elements maintain their relative order',
      'It depends on the input',
      'Only when sorting in descending order',
    ],
    correctIndex: 1,
  },
]