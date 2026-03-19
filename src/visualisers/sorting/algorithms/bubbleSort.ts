export type Step = {
  array: number[]
  comparing: [number, number] | null
  swapping: [number, number] | null
}

export function bubbleSort(input: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...input] // copy so we don't mutate the original

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      // record the comparison
      steps.push({ array: [...arr], comparing: [j, j + 1], swapping: null })

      if (arr[j] > arr[j + 1]) {
        // swap
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        // record the swap
        steps.push({ array: [...arr], comparing: null, swapping: [j, j + 1] })
      }
    }
  }

  // final state
  steps.push({ array: [...arr], comparing: null, swapping: null })

  return steps
}

