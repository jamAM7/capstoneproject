import styles from './ArrayVisualiser.module.css'

function ArrayVisualiser({ data }: {
  data: string[]
  currentStep: number
  onStepsGenerated: (total: number) => void
  onPseudoLineChange: (line: number) => void
  barMode: boolean
}) {
  return (
    <div className={styles.arrayContainer}>
      {data.map((item, index) => (
        <div key={index} className={styles.arrayItem}>{item}</div>
      ))}
    </div>
  )
}

export default ArrayVisualiser









// import styles from './ArrayVisualiser.module.css'

// // function ArrayVisualiser({ data }: { data: string[] }) {
// function ArrayVisualiser({ data }: { data: string[], currentStep: number, onStepsGenerated: (total: number) => void }) {
//   return (
//     <div className={styles.arrayContainer}>
//       {data.map((item, index) => (
//         <div key={index} className={styles.arrayItem}>{item}</div>
//       ))}
//     </div>
//   )
// }

// export default ArrayVisualiser