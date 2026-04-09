function LinkedListVisualiser({ data }: {
  data: string[]
  currentStep: number
  onStepsGenerated: (total: number) => void
  onPseudoLineChange: (line: number) => void
  barMode: boolean
}) {
  return (
    <div>
      {data.map((item, index) => (
        <span key={index}>{item} → </span>
      ))}
    </div>
  )
}

export default LinkedListVisualiser


















// function LinkedListVisualiser() {
//   return <div>Linked List Visualiser</div>

  
// }

// export default LinkedListVisualiser