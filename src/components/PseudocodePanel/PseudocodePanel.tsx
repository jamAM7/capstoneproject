import styles from './PseudocodePanel.module.css'

type Props = {
  lines: string[]
  activeLine: number | null
}

function getLineClass(line: string): string {
  const trimmed = line.trim()
  if (trimmed.startsWith('class ')) return styles.tokenClass
  if (trimmed.startsWith('def ')) return styles.tokenDef
  if (trimmed.startsWith('if ') || trimmed.startsWith('else:') || trimmed.startsWith('elif ')) return styles.tokenControl
  if (trimmed.startsWith('return ')) return styles.tokenReturn
  if (trimmed.startsWith('self.') || trimmed.startsWith('node.')) return styles.tokenSelf
  if (trimmed === '') return styles.emptyLine
  return ''
}

function highlightLine(line: string): React.ReactNode {
  const lineClass = getLineClass(line)
  return <span className={lineClass}>{line}</span>
}

function PseudocodePanel({ lines, activeLine }: Props) {
  return (
    <div className={styles.container}>
      {lines.map((line, index) => (
        <div
          key={index}
          className={`${styles.line} ${activeLine === index ? styles.activeLine : ''}`}
        >
          <span className={styles.lineNumber}>{line.trim() === '' ? '' : index + 1}</span>
          <span className={styles.lineText}>{highlightLine(line)}</span>
        </div>
      ))}
    </div>
  )
}

export default PseudocodePanel