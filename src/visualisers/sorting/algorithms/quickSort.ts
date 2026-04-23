export type Step = {
  array: number[]
  comparing: [number, number] | null
  swapping: [number, number] | null
  pivot: number | null
  pseudoLine: number
}



export function quickSort(input: number[]): Step[] {
    const steps: Step[] = []
    const arr = [...input]

    function helper(low: number, high: number) {
        if (low < high) {
        const pi = partition(low, high)
        helper(low, pi - 1)
        helper(pi + 1, high)
        }
    }

    function partition(low: number, high: number): number {
        const pivot = arr[high]
        steps.push({ array: [...arr], comparing: null, swapping: null, pivot: high, pseudoLine: 0 })

        let i = low - 1
        for (let j = low; j <= high - 1; j++) {
            steps.push({ array: [...arr], comparing: [j, high], swapping: null, pivot: high, pseudoLine: 0 })
            if (arr[j] < pivot) {
                i++
                ;[arr[i], arr[j]] = [arr[j], arr[i]]
                steps.push({ array: [...arr], comparing: null, swapping: [j, high], pivot: high, pseudoLine: 0 })
            }
        }
        ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
        return i + 1
    }

    helper(0, arr.length - 1)
    steps.push({ array: [...arr], comparing: null, swapping: null, pivot: null, pseudoLine: 0 })

    return steps
}