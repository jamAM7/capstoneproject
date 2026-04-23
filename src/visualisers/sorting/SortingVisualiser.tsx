import { useState, useEffect } from 'react'
import { bubbleSort } from './algorithms/bubbleSort'
import { selectionSort } from './algorithms/selectionSort'
import { quickSort } from './algorithms/quickSort'
import type { Step } from './algorithms/bubbleSort'
import styles from './SortingVisualiser.module.css'

function SortingVisualiser({ data, currentStep, onStepsGenerated, onPseudoLineChange, barMode, activeTopic }: {
  data: string[]
  currentStep: number
  onStepsGenerated: (total: number) => void
  onPseudoLineChange: (line: number) => void
  barMode: boolean
  activeTopic: string
}) {
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    let generated: Step[] = []
    if (activeTopic === 'Bubble Sort') generated = bubbleSort(data.map(Number))
    else if (activeTopic === 'Selection Sort') generated = selectionSort(data.map(Number))
    else if (activeTopic === 'Quick Sort') generated = quickSort(data.map(Number))
    setSteps(generated)
    onStepsGenerated(generated.length)
  }, [data, activeTopic])

  useEffect(() => {
    if (steps[currentStep] !== undefined) {
      onPseudoLineChange(steps[currentStep].pseudoLine)
    }
  }, [currentStep, steps])

  const step = steps[currentStep]
  if (!step) return <div>Enter an array above</div>

  return (
    <div className={styles.arrayContainer}>
      {step.array.map((item, index) => {
        const isComparing = step.comparing?.includes(index)
        const isSwapping = step.swapping?.includes(index)
        const isPivot = step.pivot === index
        return (
          <div
            key={index}
            style={barMode ? { height: `${item * 10}px`, width: '50px' } : {}}
            // className={`${styles.arrayItem} ${isComparing ? styles.comparing : ''} ${isSwapping ? styles.swapping : ''} ${isPivot ? styles.pivot : ''}`}
            className={`${styles.arrayItem} ${isPivot ? styles.pivot : ''} ${isComparing ? styles.comparing : ''} ${isSwapping ? styles.swapping : ''}`}
          >
            {item}
          </div>
        )
      })}
    </div>
  )
}

export default SortingVisualiser