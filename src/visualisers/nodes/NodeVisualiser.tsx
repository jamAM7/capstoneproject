import { useState, useEffect, useRef } from 'react'
import styles from './NodeVisualiser.module.css'

const ROWS = 4
const COLS = 6
const NODE_RADIUS = 24
const H_SPACING = 110
const V_SPACING = 90
const OFFSET_X = 70
const OFFSET_Y = 50

type NodeId = string // "row-col"
type Edge = { a: NodeId; b: NodeId }

type AlgoStep = {
  visited: NodeId[]
  path: NodeId[] | null
}

function nodePos(id: NodeId): { x: number; y: number } {
  const [r, c] = id.split('-').map(Number)
  return { x: OFFSET_X + c * H_SPACING, y: OFFSET_Y + r * V_SPACING }
}

function getNeighbours(id: NodeId, edges: Edge[]): NodeId[] {
  return edges
    .filter(e => e.a === id || e.b === id)
    .map(e => e.a === id ? e.b : e.a)
}

function bfs(start: NodeId, end: NodeId, activeNodes: Set<NodeId>, edges: Edge[]): AlgoStep[] {
  const steps: AlgoStep[] = []
  const visited: NodeId[] = []
  const queue: NodeId[] = [start]
  const seen = new Set<NodeId>([start])
  const parent = new Map<NodeId, NodeId | null>([[start, null]])

  while (queue.length > 0) {
    const cur = queue.shift()!
    visited.push(cur)
    steps.push({ visited: [...visited], path: null })

    if (cur === end) {
      const path: NodeId[] = []
      let c: NodeId | null = end
      while (c) { path.unshift(c); c = parent.get(c) ?? null }
      steps.push({ visited: [...visited], path })
      return steps
    }

    for (const n of getNeighbours(cur, edges)) {
      if (!seen.has(n) && activeNodes.has(n)) {
        seen.add(n)
        parent.set(n, cur)
        queue.push(n)
      }
    }
  }
  return steps
}

function dfs(start: NodeId, end: NodeId, activeNodes: Set<NodeId>, edges: Edge[]): AlgoStep[] {
  const steps: AlgoStep[] = []
  const visited: NodeId[] = []
  const stack: NodeId[] = [start]
  const seen = new Set<NodeId>([start])
  const parent = new Map<NodeId, NodeId | null>([[start, null]])

  while (stack.length > 0) {
    const cur = stack.pop()!
    visited.push(cur)
    steps.push({ visited: [...visited], path: null })

    if (cur === end) {
      const path: NodeId[] = []
      let c: NodeId | null = end
      while (c) { path.unshift(c); c = parent.get(c) ?? null }
      steps.push({ visited: [...visited], path })
      return steps
    }

    for (const n of getNeighbours(cur, edges)) {
      if (!seen.has(n) && activeNodes.has(n)) {
        seen.add(n)
        parent.set(n, cur)
        stack.push(n)
      }
    }
  }
  return steps
}

function dijkstra(start: NodeId, end: NodeId, activeNodes: Set<NodeId>, edges: Edge[]): AlgoStep[] {
  const steps: AlgoStep[] = []
  const visited: NodeId[] = []
  const dist = new Map<NodeId, number>()
  const parent = new Map<NodeId, NodeId | null>()
  const pq: { id: NodeId; dist: number }[] = []

  for (const n of activeNodes) dist.set(n, Infinity)
  dist.set(start, 0)
  parent.set(start, null)
  pq.push({ id: start, dist: 0 })

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist)
    const { id } = pq.shift()!
    if (visited.includes(id)) continue
    visited.push(id)
    steps.push({ visited: [...visited], path: null })

    if (id === end) {
      const path: NodeId[] = []
      let c: NodeId | null = end
      while (c) { path.unshift(c); c = parent.get(c) ?? null }
      steps.push({ visited: [...visited], path })
      return steps
    }

    for (const n of getNeighbours(id, edges)) {
      if (!activeNodes.has(n)) continue
      const newDist = (dist.get(id) ?? Infinity) + 1
      if (newDist < (dist.get(n) ?? Infinity)) {
        dist.set(n, newDist)
        parent.set(n, id)
        pq.push({ id: n, dist: newDist })
      }
    }
  }
  return steps
}

function aStar(start: NodeId, end: NodeId, activeNodes: Set<NodeId>, edges: Edge[]): AlgoStep[] {
  const steps: AlgoStep[] = []
  const visited: NodeId[] = []
  const g = new Map<NodeId, number>()
  const f = new Map<NodeId, number>()
  const parent = new Map<NodeId, NodeId | null>()
  const open: NodeId[] = [start]

  const endPos = nodePos(end)
  const h = (id: NodeId) => {
    const p = nodePos(id)
    return Math.abs(p.x - endPos.x) + Math.abs(p.y - endPos.y)
  }

  g.set(start, 0)
  f.set(start, h(start))
  parent.set(start, null)

  while (open.length > 0) {
    open.sort((a, b) => (f.get(a) ?? Infinity) - (f.get(b) ?? Infinity))
    const cur = open.shift()!
    visited.push(cur)
    steps.push({ visited: [...visited], path: null })

    if (cur === end) {
      const path: NodeId[] = []
      let c: NodeId | null = end
      while (c) { path.unshift(c); c = parent.get(c) ?? null }
      steps.push({ visited: [...visited], path })
      return steps
    }

    for (const n of getNeighbours(cur, edges)) {
      if (!activeNodes.has(n)) continue
      const newG = (g.get(cur) ?? Infinity) + 1
      if (newG < (g.get(n) ?? Infinity)) {
        g.set(n, newG)
        f.set(n, newG + h(n))
        parent.set(n, cur)
        if (!open.includes(n)) open.push(n)
      }
    }
  }
  return steps
}

// Default preset graph
const DEFAULT_ACTIVE = new Set<NodeId>([
  '0-0','0-1','0-2','0-3','0-4','0-5',
  '1-0','1-2','1-4',
  '2-0','2-1','2-2','2-3','2-4','2-5',
  '3-0','3-5',
])

const DEFAULT_EDGES: Edge[] = [
  { a: '0-0', b: '0-1' }, { a: '0-1', b: '0-2' }, { a: '0-2', b: '0-3' },
  { a: '0-3', b: '0-4' }, { a: '0-4', b: '0-5' },
  { a: '0-0', b: '1-0' }, { a: '0-2', b: '1-2' }, { a: '0-4', b: '1-4' },
  { a: '1-0', b: '2-0' }, { a: '1-2', b: '2-2' }, { a: '1-4', b: '2-4' },
  { a: '2-0', b: '2-1' }, { a: '2-1', b: '2-2' }, { a: '2-2', b: '2-3' },
  { a: '2-3', b: '2-4' }, { a: '2-4', b: '2-5' },
  { a: '2-0', b: '3-0' }, { a: '2-5', b: '3-5' },
]

type Props = {
  currentStep: number
  onStepsGenerated: (total: number) => void
  activeTopic: string
  onNodeReady: (resetFn: () => void, runFn: () => void) => void
}

type Mode = 'select' | 'toggleNode' | 'toggleEdge' | 'delete'

function NodeVisualiser({ currentStep, onStepsGenerated, activeTopic, onNodeReady }: Props) {
  const [activeNodes, setActiveNodes] = useState<Set<NodeId>>(new Set(DEFAULT_ACTIVE))
  const [edges, setEdges] = useState<Edge[]>(DEFAULT_EDGES)
  const [startNode, setStartNode] = useState<NodeId>('0-0')
  const [endNode, setEndNode] = useState<NodeId>('3-5')
  const [steps, setSteps] = useState<AlgoStep[]>([])
  const [mode, setMode] = useState<Mode>('select')
  const [edgeFrom, setEdgeFrom] = useState<NodeId | null>(null)

  const svgWidth = OFFSET_X * 2 + (COLS - 1) * H_SPACING
  const svgHeight = OFFSET_Y * 2 + (ROWS - 1) * V_SPACING

  function runAlgorithm() {
    let generated: AlgoStep[] = []
    if (activeTopic === 'BFS') generated = bfs(startNode, endNode, activeNodes, edges)
    else if (activeTopic === 'DFS') generated = dfs(startNode, endNode, activeNodes, edges)
    else if (activeTopic === 'Dijkstra') generated = dijkstra(startNode, endNode, activeNodes, edges)
    else if (activeTopic === 'A*') generated = aStar(startNode, endNode, activeNodes, edges)
    setSteps(generated)
    onStepsGenerated(generated.length)
  }

  function resetAlgo() {
    setSteps([])
    onStepsGenerated(0)
  }

  useEffect(() => {
    onNodeReady(resetAlgo, runAlgorithm)
  }, [activeNodes, edges, startNode, endNode, activeTopic])

  const step = steps[currentStep]

  function getNodeFill(id: NodeId): string {
    if (id === startNode) return '#22c55e'
    if (id === endNode) return '#ef4444'
    if (step?.path?.includes(id)) return '#fbbf24'
    if (step?.visited.includes(id)) return '#bfdbfe'
    return '#ffffff'
  }

  function handleNodeClick(id: NodeId) {
    if (mode === 'toggleNode') {
        if (id === startNode || id === endNode) return
        setActiveNodes(prev => {
        const n = new Set(prev)
        if (n.has(id)) {
            n.delete(id)
            setEdges(p => p.filter(e => e.a !== id && e.b !== id))
        } else {
            n.add(id)
        }
        return n
        })
        return
    }
    if (mode === 'select') {
        setStartNode(id)
    } else if (mode === 'delete') {
        if (id === startNode || id === endNode) return
        setActiveNodes(prev => { const n = new Set(prev); n.delete(id); return n })
        setEdges(prev => prev.filter(e => e.a !== id && e.b !== id))
    } else if (mode === 'toggleEdge') {
        if (!edgeFrom) {
        setEdgeFrom(id)
        } else if (edgeFrom !== id) {
        const exists = edges.some(e =>
            (e.a === edgeFrom && e.b === id) || (e.a === id && e.b === edgeFrom)
        )
        if (exists) {
            setEdges(prev => prev.filter(e =>
            !((e.a === edgeFrom && e.b === id) || (e.a === id && e.b === edgeFrom))
            ))
        } else {
            setEdges(prev => [...prev, { a: edgeFrom, b: id }])
        }
        setEdgeFrom(null)
        }
    }
    }
//   function handleNodeClick(id: NodeId) {
//     if (mode === 'select') {
//       setStartNode(id)
//     } else if (mode === 'delete') {
//       if (id === startNode || id === endNode) return
//       setActiveNodes(prev => { const n = new Set(prev); n.delete(id); return n })
//       setEdges(prev => prev.filter(e => e.a !== id && e.b !== id))
//     } else if (mode === 'toggleEdge') {
//       if (!edgeFrom) {
//         setEdgeFrom(id)
//       } else if (edgeFrom !== id) {
//         const exists = edges.some(e =>
//           (e.a === edgeFrom && e.b === id) || (e.a === id && e.b === edgeFrom)
//         )
//         if (exists) {
//           setEdges(prev => prev.filter(e =>
//             !((e.a === edgeFrom && e.b === id) || (e.a === id && e.b === edgeFrom))
//           ))
//         } else {
//           setEdges(prev => [...prev, { a: edgeFrom, b: id }])
//         }
//         setEdgeFrom(null)
//       }
//     }
//   }

  function handleNodeRightClick(e: React.MouseEvent, id: NodeId) {
    e.preventDefault()
    if (id === startNode || id === endNode) return
    setEndNode(id)
  }

  function handleGridClick(id: NodeId) {
    if (mode === 'toggleNode') {
      if (id === startNode || id === endNode) return
      setActiveNodes(prev => {
        const n = new Set(prev)
        if (n.has(id)) { n.delete(id); setEdges(p => p.filter(e => e.a !== id && e.b !== id)) }
        else n.add(id)
        return n
      })
    }
  }

  const allPositions: NodeId[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      allPositions.push(`${r}-${c}`)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button className={`${styles.toolBtn} ${mode === 'select' ? styles.toolActive : ''}`} onClick={() => { setMode('select'); setEdgeFrom(null) }}>
          Select Start
        </button>
        <button className={`${styles.toolBtn} ${mode === 'toggleNode' ? styles.toolActive : ''}`} onClick={() => { setMode('toggleNode'); setEdgeFrom(null) }}>
          Toggle Node
        </button>
        <button className={`${styles.toolBtn} ${mode === 'toggleEdge' ? styles.toolActive : ''}`} onClick={() => { setMode('toggleEdge'); setEdgeFrom(null) }}>
          {edgeFrom ? `From ${edgeFrom}...` : 'Toggle Edge'}
        </button>
        <span className={styles.hint}>
          {mode === 'select' ? 'Click = set start | Right click = set end' :
           mode === 'toggleNode' ? 'Click to add/remove nodes' :
           'Click two nodes to add/remove edge'}
        </span>
      </div>

      <svg width={svgWidth} height={svgHeight} className={styles.svg}>
        {/* Ghost positions */}
        {allPositions.map(id => {
          const { x, y } = nodePos(id)
          return (
            <circle
              key={`ghost-${id}`}
              cx={x} cy={y} r={NODE_RADIUS}
              fill='#f5f5f5'
              stroke='#e0e0e0'
              strokeWidth={1}
              strokeDasharray='4 2'
              style={{ cursor: mode === 'toggleNode' ? 'pointer' : 'default' }}
              onClick={() => handleGridClick(id)}
            />
          )
        })}

        {/* Edges */}
        {edges.map((edge, i) => {
          const a = nodePos(edge.a)
          const b = nodePos(edge.b)
          const isPath = step?.path && (
            (step.path.includes(edge.a) && step.path.includes(edge.b) &&
             Math.abs(step.path.indexOf(edge.a) - step.path.indexOf(edge.b)) === 1)
          )
          return (
            <line
              key={`edge-${i}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={isPath ? '#fbbf24' : '#ccc'}
              strokeWidth={isPath ? 3 : 2}
            />
          )
        })}

        {/* Active nodes */}
        {allPositions.filter(id => activeNodes.has(id)).map(id => {
          const { x, y } = nodePos(id)
          const label = String.fromCharCode(65 + allPositions.indexOf(id))
          return (
            <g key={id} style={{ cursor: 'pointer' }}
              onClick={() => handleNodeClick(id)}
              onContextMenu={(e) => handleNodeRightClick(e, id)}
            >
              <circle
                cx={x} cy={y} r={NODE_RADIUS}
                fill={getNodeFill(id)}
                stroke={edgeFrom === id ? '#6366f1' : '#333'}
                strokeWidth={edgeFrom === id ? 3 : 2}
              />
              <text
                x={x} y={y}
                textAnchor='middle' dominantBaseline='central'
                fontSize={13} fontWeight={600}
                fontFamily='DM Sans, sans-serif'
                fill='#1a1a1a'
                style={{ pointerEvents: 'none' }}
              >
                {label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default NodeVisualiser




























// import { useEffect, useRef, useState } from 'react'
// import * as d3 from 'd3'
// import styles from './NodeVisualiser.module.css'

// type NodeDatum = d3.SimulationNodeDatum & {
//   id: string
//   x: number
//   y: number
// }

// type EdgeDatum = {
//   source: string
//   target: string
// }

// type NodeState = 'default' | 'start' | 'end' | 'visited' | 'path'

// type AlgoStep = {
//   visited: string[]
//   path: string[] | null
// }

// const PRESET_NODES: NodeDatum[] = [
//   { id: 'A', x: 300, y: 150 },
//   { id: 'B', x: 150, y: 280 },
//   { id: 'C', x: 450, y: 280 },
//   { id: 'D', x: 80,  y: 400 },
//   { id: 'E', x: 220, y: 400 },
//   { id: 'F', x: 380, y: 400 },
//   { id: 'G', x: 520, y: 400 },
// ]

// const PRESET_EDGES: EdgeDatum[] = [
//   { source: 'A', target: 'B' },
//   { source: 'A', target: 'C' },
//   { source: 'B', target: 'D' },
//   { source: 'B', target: 'E' },
//   { source: 'C', target: 'F' },
//   { source: 'C', target: 'G' },
//   { source: 'E', target: 'F' },
// ]

// function getNeighbours(id: string, edges: EdgeDatum[]): string[] {
//   return edges
//     .filter(e => e.source === id || e.target === id)
//     .map(e => e.source === id ? e.target : e.source)
// }

// function bfs(startId: string, endId: string, nodes: NodeDatum[], edges: EdgeDatum[]): AlgoStep[] {
//   const steps: AlgoStep[] = []
//   const visited: string[] = []
//   const queue: string[] = [startId]
//   const seen = new Set<string>([startId])
//   const parent = new Map<string, string | null>([[startId, null]])

//   while (queue.length > 0) {
//     const current = queue.shift()!
//     visited.push(current)
//     steps.push({ visited: [...visited], path: null })

//     if (current === endId) {
//       const path: string[] = []
//       let cur: string | null = endId
//       while (cur) { path.unshift(cur); cur = parent.get(cur) ?? null }
//       steps.push({ visited: [...visited], path })
//       return steps
//     }

//     for (const neighbour of getNeighbours(current, edges)) {
//       if (!seen.has(neighbour)) {
//         seen.add(neighbour)
//         parent.set(neighbour, current)
//         queue.push(neighbour)
//       }
//     }
//   }
//   return steps
// }

// function dfs(startId: string, endId: string, nodes: NodeDatum[], edges: EdgeDatum[]): AlgoStep[] {
//   const steps: AlgoStep[] = []
//   const visited: string[] = []
//   const stack: string[] = [startId]
//   const seen = new Set<string>([startId])
//   const parent = new Map<string, string | null>([[startId, null]])

//   while (stack.length > 0) {
//     const current = stack.pop()!
//     visited.push(current)
//     steps.push({ visited: [...visited], path: null })

//     if (current === endId) {
//       const path: string[] = []
//       let cur: string | null = endId
//       while (cur) { path.unshift(cur); cur = parent.get(cur) ?? null }
//       steps.push({ visited: [...visited], path })
//       return steps
//     }

//     for (const neighbour of getNeighbours(current, edges)) {
//       if (!seen.has(neighbour)) {
//         seen.add(neighbour)
//         parent.set(neighbour, current)
//         stack.push(neighbour)
//       }
//     }
//   }
//   return steps
// }

// function dijkstra(startId: string, endId: string, nodes: NodeDatum[], edges: EdgeDatum[]): AlgoStep[] {
//   const steps: AlgoStep[] = []
//   const visited: string[] = []
//   const dist = new Map<string, number>()
//   const parent = new Map<string, string | null>()
//   const pq: { id: string; dist: number }[] = []

//   for (const node of nodes) dist.set(node.id, Infinity)
//   dist.set(startId, 0)
//   parent.set(startId, null)
//   pq.push({ id: startId, dist: 0 })

//   while (pq.length > 0) {
//     pq.sort((a, b) => a.dist - b.dist)
//     const { id } = pq.shift()!
//     if (visited.includes(id)) continue
//     visited.push(id)
//     steps.push({ visited: [...visited], path: null })

//     if (id === endId) {
//       const path: string[] = []
//       let cur: string | null = endId
//       while (cur) { path.unshift(cur); cur = parent.get(cur) ?? null }
//       steps.push({ visited: [...visited], path })
//       return steps
//     }

//     for (const neighbour of getNeighbours(id, edges)) {
//       const newDist = (dist.get(id) ?? Infinity) + 1
//       if (newDist < (dist.get(neighbour) ?? Infinity)) {
//         dist.set(neighbour, newDist)
//         parent.set(neighbour, id)
//         pq.push({ id: neighbour, dist: newDist })
//       }
//     }
//   }
//   return steps
// }

// function aStar(startId: string, endId: string, nodes: NodeDatum[], edges: EdgeDatum[]): AlgoStep[] {
//   const steps: AlgoStep[] = []
//   const visited: string[] = []
//   const g = new Map<string, number>()
//   const f = new Map<string, number>()
//   const parent = new Map<string, string | null>()
//   const open: string[] = [startId]

//   const getPos = (id: string) => nodes.find(n => n.id === id) ?? { x: 0, y: 0 }
//   const endPos = getPos(endId)
//   const h = (id: string) => {
//     const pos = getPos(id)
//     return Math.sqrt(Math.pow((pos.x ?? 0) - (endPos.x ?? 0), 2) + Math.pow((pos.y ?? 0) - (endPos.y ?? 0), 2))
//   }

//   g.set(startId, 0)
//   f.set(startId, h(startId))
//   parent.set(startId, null)

//   while (open.length > 0) {
//     open.sort((a, b) => (f.get(a) ?? Infinity) - (f.get(b) ?? Infinity))
//     const current = open.shift()!
//     visited.push(current)
//     steps.push({ visited: [...visited], path: null })

//     if (current === endId) {
//       const path: string[] = []
//       let cur: string | null = endId
//       while (cur) { path.unshift(cur); cur = parent.get(cur) ?? null }
//       steps.push({ visited: [...visited], path })
//       return steps
//     }

//     for (const neighbour of getNeighbours(current, edges)) {
//       const newG = (g.get(current) ?? Infinity) + 1
//       if (newG < (g.get(neighbour) ?? Infinity)) {
//         g.set(neighbour, newG)
//         f.set(neighbour, newG + h(neighbour))
//         parent.set(neighbour, current)
//         if (!open.includes(neighbour)) open.push(neighbour)
//       }
//     }
//   }
//   return steps
// }

// type Props = {
//   currentStep: number
//   onStepsGenerated: (total: number) => void
//   activeTopic: string
//   onNodeReady: (resetFn: () => void, runFn: () => void) => void
// }

// type InteractionMode = 'select' | 'addNode' | 'addEdge' | 'delete'

// function NodeVisualiser({ currentStep, onStepsGenerated, activeTopic, onNodeReady }: Props) {
//   const svgRef = useRef<SVGSVGElement>(null)
//   const [nodes, setNodes] = useState<NodeDatum[]>(PRESET_NODES.map(n => ({ ...n })))
//   const [edges, setEdges] = useState<EdgeDatum[]>([...PRESET_EDGES])
//   const [startNode, setStartNode] = useState<string>('A')
//   const [endNode, setEndNode] = useState<string>('G')
//   const [steps, setSteps] = useState<AlgoStep[]>([])
//   const [mode, setMode] = useState<InteractionMode>('select')
//   const [edgeStart, setEdgeStart] = useState<string | null>(null)
//   const simulationRef = useRef<d3.Simulation<NodeDatum, undefined> | null>(null)
//   const [, forceUpdate] = useState(0)

//   function runAlgorithm() {
//     let generated: AlgoStep[] = []
//     if (activeTopic === 'BFS') generated = bfs(startNode, endNode, nodes, edges)
//     else if (activeTopic === 'DFS') generated = dfs(startNode, endNode, nodes, edges)
//     else if (activeTopic === 'Dijkstra') generated = dijkstra(startNode, endNode, nodes, edges)
//     else if (activeTopic === "A*") generated = aStar(startNode, endNode, nodes, edges)
//     setSteps(generated)
//     onStepsGenerated(generated.length)
//   }

//   function resetNodes() {
//     setSteps([])
//     onStepsGenerated(0)
//   }

//   useEffect(() => {
//     onNodeReady(resetNodes, runAlgorithm)
//   }, [nodes, edges, startNode, endNode, activeTopic])

//   useEffect(() => {
//     if (!svgRef.current) return

//     const svg = d3.select(svgRef.current)
//     svg.selectAll('*').remove()

//     const width = svgRef.current.clientWidth || 600
//     const height = svgRef.current.clientHeight || 400

//     const sim = d3.forceSimulation<NodeDatum>(nodes)
//       .force('charge', d3.forceManyBody().strength(-300))
//       .force('center', d3.forceCenter(width / 2, height / 2))
//       .force('link', d3.forceLink(
//         edges.map(e => ({ source: e.source, target: e.target }))
//       ).id((d: any) => d.id).distance(120))
//       .force('collision', d3.forceCollide(50))

//     simulationRef.current = sim

//     const edgeGroup = svg.append('g')
//     const nodeGroup = svg.append('g')

//     const step = steps[currentStep]

//     function getNodeState(id: string): NodeState {
//       if (id === startNode) return 'start'
//       if (id === endNode) return 'end'
//       if (step?.path?.includes(id)) return 'path'
//       if (step?.visited.includes(id)) return 'visited'
//       return 'default'
//     }

//     const nodeColor: Record<NodeState, string> = {
//       default: '#ffffff',
//       start: '#22c55e',
//       end: '#ef4444',
//       visited: '#bfdbfe',
//       path: '#fbbf24',
//     }

//     const edgeLines = edgeGroup.selectAll('line')
//       .data(edges)
//       .enter()
//       .append('line')
//       .attr('stroke', '#ccc')
//       .attr('stroke-width', 2)

//     const nodeCircles = nodeGroup.selectAll('g')
//       .data(nodes)
//       .enter()
//       .append('g')
//       .call(
//         d3.drag<SVGGElement, NodeDatum>()
//           .on('start', (event, d) => {
//             if (!event.active) sim.alphaTarget(0.3).restart()
//             d.fx = d.x
//             d.fy = d.y
//           })
//           .on('drag', (event, d) => {
//             d.fx = event.x
//             d.fy = event.y
//           })
//           .on('end', (event, d) => {
//             if (!event.active) sim.alphaTarget(0)
//             d.fx = null
//             d.fy = null
//           })
//       )
//       .on('click', (event, d) => {
//         event.stopPropagation()
//         if (mode === 'select') {
//           if (event.shiftKey) {
//             setEndNode(d.id)
//           } else {
//             setStartNode(d.id)
//           }
//         } else if (mode === 'addEdge') {
//           if (!edgeStart) {
//             setEdgeStart(d.id)
//           } else if (edgeStart !== d.id) {
//             const exists = edges.some(e =>
//               (e.source === edgeStart && e.target === d.id) ||
//               (e.source === d.id && e.target === edgeStart)
//             )
//             if (!exists) {
//               setEdges(prev => [...prev, { source: edgeStart, target: d.id }])
//             }
//             setEdgeStart(null)
//           }
//         } else if (mode === 'delete') {
//           setNodes(prev => prev.filter(n => n.id !== d.id))
//           setEdges(prev => prev.filter(e => e.source !== d.id && e.target !== d.id))
//         }
//       })

//     nodeCircles.append('circle')
//       .attr('r', 22)
//       .attr('fill', d => nodeColor[getNodeState(d.id)])
//       .attr('stroke', '#333')
//       .attr('stroke-width', 2)

//     nodeCircles.append('text')
//       .text(d => d.id)
//       .attr('text-anchor', 'middle')
//       .attr('dy', '0.35em')
//       .attr('font-size', '13px')
//       .attr('font-family', 'DM Sans, sans-serif')
//       .attr('font-weight', '600')
//       .attr('fill', '#1a1a1a')
//       .attr('pointer-events', 'none')

//     svg.on('click', (event) => {
//       if (mode === 'addNode') {
//         const [x, y] = d3.pointer(event)
//         const newId = String.fromCharCode(65 + nodes.length)
//         setNodes(prev => [...prev, { id: newId, x, y }])
//       }
//     })

//     sim.on('tick', () => {
//       edgeLines
//         .attr('x1', d => {
//           const n = nodes.find(n => n.id === d.source)
//           return n?.x ?? 0
//         })
//         .attr('y1', d => {
//           const n = nodes.find(n => n.id === d.source)
//           return n?.y ?? 0
//         })
//         .attr('x2', d => {
//           const n = nodes.find(n => n.id === d.target)
//           return n?.x ?? 0
//         })
//         .attr('y2', d => {
//           const n = nodes.find(n => n.id === d.target)
//           return n?.y ?? 0
//         })

//       nodeCircles
//         .attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`)
//     })

//     return () => { sim.stop() }
//   }, [nodes, edges, startNode, endNode, steps, currentStep, mode, edgeStart])

//   return (
//     <div className={styles.container}>
//       <div className={styles.toolbar}>
//         <button
//           className={`${styles.toolBtn} ${mode === 'select' ? styles.toolActive : ''}`}
//           onClick={() => setMode('select')}
//         >Select</button>
//         <button
//           className={`${styles.toolBtn} ${mode === 'addNode' ? styles.toolActive : ''}`}
//           onClick={() => setMode('addNode')}
//         >Add Node</button>
//         <button
//           className={`${styles.toolBtn} ${mode === 'addEdge' ? styles.toolActive : ''}`}
//           onClick={() => { setMode('addEdge'); setEdgeStart(null) }}
//         >{edgeStart ? `From ${edgeStart}...` : 'Add Edge'}</button>
//         <button
//           className={`${styles.toolBtn} ${mode === 'delete' ? styles.toolActive : ''}`}
//           onClick={() => setMode('delete')}
//         >Delete</button>
//         <span className={styles.hint}>
//           {mode === 'select' ? 'Click node = set start | Shift+click = set end' :
//            mode === 'addNode' ? 'Click canvas to add node' :
//            mode === 'addEdge' ? 'Click two nodes to connect' :
//            'Click node to delete'}
//         </span>
//       </div>
//       <svg ref={svgRef} className={styles.svg} />
//     </div>
//   )
// }

// export default NodeVisualiser