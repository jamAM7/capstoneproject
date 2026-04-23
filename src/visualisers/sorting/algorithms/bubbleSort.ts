export type Step = {
  array: number[]
  comparing: [number, number] | null
  swapping: [number, number] | null
  pseudoLine: number
  pivot: number | null
}

export function bubbleSort(input: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...input]

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      // highlighting "if arr[j] > arr[j+1]" — line index 2
      steps.push({ array: [...arr], comparing: [j, j + 1], swapping: null, pivot: null, pseudoLine: 2 })

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        // highlighting "swap arr[j] and arr[j+1]" — line index 3
        steps.push({ array: [...arr], comparing: null, swapping: [j, j + 1], pivot: null, pseudoLine: 3 })
      }
    }
  }

  steps.push({ array: [...arr], comparing: null, swapping: null, pivot: null, pseudoLine: 0 })

  return steps
}

















// // defines shape of each step object
// export type Step = {
//   array: number[]
//   comparing: [number, number] | null
//   swapping: [number, number] | null
// }

// export function bubbleSort(input: number[]): Step[] {   // takes in array of numbers, and returns array of steps
//   const steps: Step[] = []  // list that is built up and then returned
//   const arr = [...input] // copy so we don't mutate the original

//   for (let i = 0; i < arr.length; i++) {
//     for (let j = 0; j < arr.length - i - 1; j++) {
//       // record the comparison
//       steps.push({ array: [...arr], comparing: [j, j + 1], swapping: null })

//       if (arr[j] > arr[j + 1]) {
//         // swap
//         ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
//         // record the swap
//         steps.push({ array: [...arr], comparing: null, swapping: [j, j + 1] })
//       }
//     }
//   }

//   // final state
//   steps.push({ array: [...arr], comparing: null, swapping: null })

//   return steps
// }

