import styles from './BSTVisualiser.module.css'

type TreeNode = {
  value: number
  left: TreeNode | null
  right: TreeNode | null
}

function buildBST(values: number[]): TreeNode | null {
  if (values.length === 0) return null
  let root: TreeNode | null = null

  function insert(node: TreeNode | null, val: number): TreeNode {
    if (!node) return { value: val, left: null, right: null }
    if (val < node.value) return { ...node, left: insert(node.left, val) }
    return { ...node, right: insert(node.right, val) }
  }

  for (const val of values) {
    root = insert(root, val)
  }
  return root
}

type RenderNode = {
  value: number
  x: number
  y: number
  parentX: number | null
  parentY: number | null
}

function flattenTree(
  node: TreeNode | null,
  x: number,
  y: number,
  spread: number,
  parentX: number | null,
  parentY: number | null,
  result: RenderNode[]
) {
  if (!node) return
  result.push({ value: node.value, x, y, parentX, parentY })
  flattenTree(node.left, x - spread, y + 100, spread / 2, x, y, result)
  flattenTree(node.right, x + spread, y + 100, spread / 2, x, y, result)
}

function BSTVisualiser({ data }: {
  data: string[]
  currentStep: number
  onStepsGenerated: (total: number) => void
  onPseudoLineChange: (line: number) => void
  barMode: boolean
}) {
  const values = data.map(Number).filter(n => !isNaN(n))
  const tree = buildBST(values)

  const nodes: RenderNode[] = []
  flattenTree(tree, 300, 40, 120, null, null, nodes)

  const svgWidth = 600
  const svgHeight = 320

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      className={styles.svg}
    >
        {/* Draw edges first so they appear behind nodes */}
        {nodes.map((node, i) =>
        node.parentX !== null && node.parentY !== null ? (
            <line
            key={`edge-${i}`}
            x1={node.parentX}
            y1={node.parentY}
            x2={node.x}
            y2={node.y}
            className={styles.edge}
            />
        ) : null
        )}

        {/* Draw nodes */}
        {nodes.map((node, i) => (
            <g key={`node-${i}`}>
            <rect
                x={node.x - 20}
                y={node.y - 20}
                width={40}
                height={40}
                className={styles.node}
            />
            <text
                x={node.x}
                y={node.y + 5}
                className={styles.nodeText}
                textAnchor="middle"
            >
                {node.value}
            </text>
            </g>
        ))}
    </svg>
  )
}

export default BSTVisualiser