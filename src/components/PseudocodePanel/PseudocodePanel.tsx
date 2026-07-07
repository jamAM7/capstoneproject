import styles from './PseudocodePanel.module.css'

type Props = {
  lines: string[]
  activeLine: number | null
}

// function getLineClass(line: string): string {
//   const trimmed = line.trim()
//   if (trimmed.startsWith('class ')) return styles.tokenClass
//   if (trimmed.startsWith('def ')) return styles.tokenDef
//   if (trimmed.startsWith('if ') || trimmed.startsWith('else:') || trimmed.startsWith('elif ')) return styles.tokenControl
//   if (trimmed.startsWith('return ')) return styles.tokenReturn
//   if (trimmed.startsWith('self.') || trimmed.startsWith('node.')) return styles.tokenSelf
//   if (trimmed === '') return styles.emptyLine
//   return ''
// }
// function getLineClass(line: string): string {
//   const trimmed = line.trim()
//   if (trimmed.startsWith('class ')) return styles.tokenClass
//   if (trimmed.startsWith('function ')) return styles.tokenDef
//   if (trimmed.startsWith('if ') || trimmed.startsWith('else:') || trimmed.startsWith('else ') || trimmed.startsWith('elif ')) return styles.tokenControl
//   if (trimmed.startsWith('while ')) return styles.tokenControl
//   if (trimmed.startsWith('for ')) return styles.tokenControl
//   if (trimmed.startsWith('return ')) return styles.tokenReturn
//   if (trimmed.startsWith('node.')) return styles.tokenSelf
//   if (trimmed === '') return styles.emptyLine
//   return styles.tokenDefault
// }

function getLineClass(line: string): string {
  const trimmed = line.trim()
  if (trimmed === '') return styles.emptyLine

  // Definitions — functions, classes
  if (trimmed.startsWith('function ') || trimmed.startsWith('def ')) return styles.tokenDef
  if (trimmed.startsWith('class ')) return styles.tokenClass

  // Control flow — conditionals & loops
  if (
    trimmed.startsWith('if ') || trimmed.startsWith('else') ||
    trimmed.startsWith('elif ') || trimmed.startsWith('while ') ||
    trimmed.startsWith('for ') || trimmed.startsWith('repeat') ||
    trimmed.startsWith('break') || trimmed.startsWith('continue')
  ) return styles.tokenControl

  // Return / output
  if (trimmed.startsWith('return ')) return styles.tokenReturn

  // Data-structure operations — the verbs your pseudocode leans on
  if (
    trimmed.startsWith('create ') || trimmed.startsWith('add ') ||
    trimmed.startsWith('push ') || trimmed.startsWith('append ') ||
    trimmed.startsWith('remove ') || trimmed.startsWith('mark ') ||
    trimmed.startsWith('process') || trimmed.startsWith('set ')
  ) return styles.tokenOp

  return styles.tokenDefault
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