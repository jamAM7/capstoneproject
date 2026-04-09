import { useState, useEffect } from 'react'
import { bubbleSort, type Step } from './algorithms/bubbleSort'
import styles from './SortingVisualiser.module.css'

function SortingVisualiser({ data, currentStep, onStepsGenerated, onPseudoLineChange, barMode }: {
  data: string[]
  currentStep: number
  onStepsGenerated: (total: number) => void
  onPseudoLineChange: (line: number) => void
  barMode: boolean
}) {
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    const generated = bubbleSort(data.map(Number))
    setSteps(generated)
    onStepsGenerated(generated.length)
  }, [data])

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
        return (
          <div
            key={index}
            style={barMode ? { height: `${item * 10}px`, width: '50px' } : {}}
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

// // this funciton receives three props.
// // data is the array of strings from input field
// // currentStep is controlled by TopicViewer's buttons (this function doesnt manage it)
// // onStepsGenerated is a callback function that this function calls once to tell TopicViewer how many steps exist.
// // (total: number) => void means its a function that takes a number and returns nothing
// function SortingVisualiser({ data, currentStep, onStepsGenerated, barMode }: {
//   data: string[]
//   currentStep: number
//   onStepsGenerated: (total: number) => void
//   barMode: boolean
// }) {
//   // steps holds the full pre computed list of animation steps. The Step type is imported from bubbleSort.ts defining (array state, comparing indices, swapping indices)
//   const [steps, setSteps] = useState<Step[]>([])

//   // runs whenever data changes
//   useEffect(() => {
//     const generated = bubbleSort(data.map(Number)) // converts string array to numbers. And bubbleSort returns the full list of steps
//     setSteps(generated)
//     onStepsGenerated(generated.length) // this is so TopicViewer knows the bounds of steps for controller
//   }, [data])

//   // puts in the correct index of the current step position
//   const step = steps[currentStep]
//   if (!step) return <div>Enter an array above</div>

//   return (
//     <div className={styles.arrayContainer}>
//       {step.array.map((item, index) => {
//         const isComparing = step.comparing?.includes(index)
//         const isSwapping = step.swapping?.includes(index)
//         return (
//           // <div
//           //   key={index}
//           //   className={`${styles.arrayItem} ${isComparing ? styles.comparing : ''} ${isSwapping ? styles.swapping : ''}`}
//           // >
//           //   {item}
//           // </div>
//           <div
//             key={index}
//             style={barMode ? { height: `${item * 10}px`, width: '50px' } : {}}
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