import { useState, useEffect } from 'react'
import { bubbleSort, type Step } from './algorithms/bubbleSort'
import styles from './SortingVisualiser.module.css'

function SortingVisualiser({ data, currentStep, onStepsGenerated }: {
  data: string[]
  currentStep: number
  onStepsGenerated: (total: number) => void
}) {
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    const generated = bubbleSort(data.map(Number))
    setSteps(generated)
    onStepsGenerated(generated.length)
  }, [data])

  const step = steps[currentStep]
  if (!step) return <div>Enter an array above</div>

  return (
    <div className={styles.arrayContainer}>
      {step.array.map((item, index) => {
        const isComparing = step.comparing?.includes(index)
        const isSwapping = step.swapping?.includes(index)
        return (
          <div
            key={index}
            className={`${styles.arrayItem} ${isComparing ? styles.comparing : ''} ${isSwapping ? styles.swapping : ''}`}
          >
            {item}
          </div>
        )
      })}
    </div>
  )
}

export default SortingVisualiser









// import { useState, useEffect } from 'react'
// import { bubbleSort, type Step } from './algorithms/bubbleSort'
// import styles from './SortingVisualiser.module.css'

// function SortingVisualiser({ data }: { data: string[] }) {
//   const numericData = data.map(Number)
//   const [steps, setSteps] = useState<Step[]>([])
//   const [currentStep, setCurrentStep] = useState(0)

//   useEffect(() => {
//     const generated = bubbleSort(numericData)
//     setSteps(generated)
//     setCurrentStep(0)
//   }, [data])

//   const step = steps[currentStep]

//   if (!step) return <div>Enter an array above</div>

//   return (
//     <div className={styles.arrayContainer}>
//       {step.array.map((item, index) => {
//         const isComparing = step.comparing?.includes(index)
//         const isSwapping = step.swapping?.includes(index)

//         return (
//           <div
//             key={index}
//             className={`${styles.arrayItem} ${isComparing ? styles.comparing : ''} ${isSwapping ? styles.swapping : ''}`}
//           >
//             {item}
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// export default SortingVisualiser