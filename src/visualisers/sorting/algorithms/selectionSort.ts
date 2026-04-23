export type Step = {
  array: number[]
  comparing: [number, number] | null
  swapping: [number, number] | null
  pivot: number | null
  pseudoLine: number
}

export function selectionSort(input: number[]): Step[] {
  const steps: Step[] = []
  const arr = [...input]

  for (let i = 0; i < arr.length; i++) {
    let min_idx = i

    steps.push({ array: [...arr], comparing: [i, i], swapping: null, pivot: null, pseudoLine: 1 })

    for (let j = i + 1; j < arr.length; j++) {
      steps.push({ array: [...arr], comparing: [j, min_idx], swapping: null, pivot: null, pseudoLine: 3 })

      if (arr[j] < arr[min_idx]) {
        min_idx = j
        steps.push({ array: [...arr], comparing: [j, min_idx], swapping: null, pivot: null, pseudoLine: 4 })
      }
    }

    const temp = arr[i]
    arr[i] = arr[min_idx]
    arr[min_idx] = temp
    steps.push({ array: [...arr], comparing: null, swapping: [i, min_idx], pivot: null, pseudoLine: 5 })
  }

  steps.push({ array: [...arr], comparing: null, swapping: null, pivot: null, pseudoLine: 0 })

  return steps
}