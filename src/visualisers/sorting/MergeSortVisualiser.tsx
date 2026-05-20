import styles from './MergeSortVisualiser.module.css'

function MergeSortVisualiser(_props: {
  data: string[]
  currentStep: number
  onStepsGenerated: (total: number) => void
  onPseudoLineChange: (line: number) => void
  barMode: boolean
  activeTopic: string
}) {
  return (
    <div className={styles.container}>
      <video
        className={styles.video}
        controls
        src="/videos/mergeSort.mp4"
      />
    </div>
  )
}

export default MergeSortVisualiser