import { useState, useEffect, useCallback } from 'react'
import styles from './GridVisualiser.module.css'

const ROWS = 15
const COLS = 25
const START_ROW = 2
const START_COL = 2
const END_ROW = 12
const END_COL = 22

type CellState = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path'

type Cell = {
  row: number
  col: number
  state: CellState
}

type GridState = Cell[][]

function createGrid(): GridState {
  return Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => ({
      row,
      col,
      state:
        row === START_ROW && col === START_COL ? 'start' :
        row === END_ROW && col === END_COL ? 'end' :
        'empty',
    }))
  )
}

type Props = {
    data: string[]
    currentStep: number
    onStepsGenerated: (total: number) => void
    onPseudoLineChange: (line: number) => void
    barMode: boolean
    activeTopic: string
//   onGridReady: (resetFn: () => void, clearFn: () => void) => void
    onGridReady: (resetFn: () => void, clearFn: () => void, runFn: () => void) => void
}

export type GridStep = {
  visited: [number, number][]
  path: [number, number][] | null
}

function getNeighbours(row: number, col: number, grid: GridState): [number, number][] {
  const neighbours: [number, number][] = []
  if (row > 0) neighbours.push([row - 1, col])
  if (row < ROWS - 1) neighbours.push([row + 1, col])
  if (col > 0) neighbours.push([row, col - 1])
  if (col < COLS - 1) neighbours.push([row, col + 1])
  return neighbours.filter(([r, c]) => grid[r][c].state !== 'wall')
}

function bfs(grid: GridState): GridStep[] {
  const steps: GridStep[] = []
  const visited: [number, number][] = []
  const queue: [number, number][] = [[START_ROW, START_COL]]
  const seen = new Set<string>()
  const parent = new Map<string, [number, number] | null>()
  seen.add(`${START_ROW},${START_COL}`)
  parent.set(`${START_ROW},${START_COL}`, null)

  while (queue.length > 0) {
    const [row, col] = queue.shift()!
    visited.push([row, col])
    steps.push({ visited: [...visited], path: null })

    if (row === END_ROW && col === END_COL) {
      const path: [number, number][] = []
      let cur: [number, number] | null = [END_ROW, END_COL]
      while (cur) {
        path.unshift(cur)
        cur = parent.get(`${cur[0]},${cur[1]}`) ?? null
      }
      steps.push({ visited: [...visited], path })
      return steps
    }

    for (const [nr, nc] of getNeighbours(row, col, grid)) {
      const key = `${nr},${nc}`
      if (!seen.has(key)) {
        seen.add(key)
        parent.set(key, [row, col])
        queue.push([nr, nc])
      }
    }
  }
  return steps
}

function dfs(grid: GridState): GridStep[] {
  const steps: GridStep[] = []
  const visited: [number, number][] = []
  const stack: [number, number][] = [[START_ROW, START_COL]]
  const seen = new Set<string>()
  const parent = new Map<string, [number, number] | null>()
  seen.add(`${START_ROW},${START_COL}`)
  parent.set(`${START_ROW},${START_COL}`, null)

  while (stack.length > 0) {
    const [row, col] = stack.pop()!
    visited.push([row, col])
    steps.push({ visited: [...visited], path: null })

    if (row === END_ROW && col === END_COL) {
      const path: [number, number][] = []
      let cur: [number, number] | null = [END_ROW, END_COL]
      while (cur) {
        path.unshift(cur)
        cur = parent.get(`${cur[0]},${cur[1]}`) ?? null
      }
      steps.push({ visited: [...visited], path })
      return steps
    }

    for (const [nr, nc] of getNeighbours(row, col, grid)) {
      const key = `${nr},${nc}`
      if (!seen.has(key)) {
        seen.add(key)
        parent.set(key, [row, col])
        stack.push([nr, nc])
      }
    }
  }
  return steps
}

function dijkstra(grid: GridState): GridStep[] {
  const steps: GridStep[] = []
  const visited: [number, number][] = []
  const dist = new Map<string, number>()
  const parent = new Map<string, [number, number] | null>()
  const pq: { row: number; col: number; dist: number }[] = []

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      dist.set(`${r},${c}`, Infinity)
    }
  }

  dist.set(`${START_ROW},${START_COL}`, 0)
  parent.set(`${START_ROW},${START_COL}`, null)
  pq.push({ row: START_ROW, col: START_COL, dist: 0 })

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist)
    const { row, col } = pq.shift()!
    const key = `${row},${col}`

    if (visited.find(([r, c]) => r === row && c === col)) continue
    visited.push([row, col])
    steps.push({ visited: [...visited], path: null })

    if (row === END_ROW && col === END_COL) {
      const path: [number, number][] = []
      let cur: [number, number] | null = [END_ROW, END_COL]
      while (cur) {
        path.unshift(cur)
        cur = parent.get(`${cur[0]},${cur[1]}`) ?? null
      }
      steps.push({ visited: [...visited], path })
      return steps
    }

    for (const [nr, nc] of getNeighbours(row, col, grid)) {
      const nkey = `${nr},${nc}`
      const newDist = (dist.get(key) ?? Infinity) + 1
      if (newDist < (dist.get(nkey) ?? Infinity)) {
        dist.set(nkey, newDist)
        parent.set(nkey, [row, col])
        pq.push({ row: nr, col: nc, dist: newDist })
      }
    }
  }
  return steps
}

function aStar(grid: GridState): GridStep[] {
  const steps: GridStep[] = []
  const visited: [number, number][] = []
  const parent = new Map<string, [number, number] | null>()
  const g = new Map<string, number>()
  const f = new Map<string, number>()
  const open: [number, number][] = [[START_ROW, START_COL]]

  const h = (r: number, c: number) => Math.abs(r - END_ROW) + Math.abs(c - END_COL)

  g.set(`${START_ROW},${START_COL}`, 0)
  f.set(`${START_ROW},${START_COL}`, h(START_ROW, START_COL))
  parent.set(`${START_ROW},${START_COL}`, null)

  while (open.length > 0) {
    open.sort((a, b) => (f.get(`${a[0]},${a[1]}`) ?? Infinity) - (f.get(`${b[0]},${b[1]}`) ?? Infinity))
    const [row, col] = open.shift()!
    const key = `${row},${col}`

    visited.push([row, col])
    steps.push({ visited: [...visited], path: null })

    if (row === END_ROW && col === END_COL) {
      const path: [number, number][] = []
      let cur: [number, number] | null = [END_ROW, END_COL]
      while (cur) {
        path.unshift(cur)
        cur = parent.get(`${cur[0]},${cur[1]}`) ?? null
      }
      steps.push({ visited: [...visited], path })
      return steps
    }

    for (const [nr, nc] of getNeighbours(row, col, grid)) {
      const nkey = `${nr},${nc}`
      const newG = (g.get(key) ?? Infinity) + 1
      if (newG < (g.get(nkey) ?? Infinity)) {
        g.set(nkey, newG)
        f.set(nkey, newG + h(nr, nc))
        parent.set(nkey, [row, col])
        if (!open.find(([r, c]) => r === nr && c === nc)) {
          open.push([nr, nc])
        }
      }
    }
  }
  return steps
}

function GridVisualiser({ currentStep, onStepsGenerated, activeTopic, onGridReady }: Props) {
    const [grid, setGrid] = useState<GridState>(createGrid())
    const [steps, setSteps] = useState<GridStep[]>([])
    const [isLeftDown, setIsLeftDown] = useState(false)
    const [isRightDown, setIsRightDown] = useState(false)

    const resetGrid = useCallback(() => {
      setGrid(prev => prev.map(row => row.map(cell => ({
        ...cell,
        state: (cell.state === 'visited' || cell.state === 'path') ? 'empty' : cell.state
      }))))
      setSteps([])
    }, [])

    const clearGrid = useCallback(() => {
        setGrid(createGrid())
        setSteps([])
    }, [])

//   useEffect(() => {
//     onGridReady(resetGrid, clearGrid)
//   }, [resetGrid, clearGrid])
    useEffect(() => {
    onGridReady(resetGrid, clearGrid, runAlgorithm)
    }, [resetGrid, clearGrid, activeTopic, grid])

  function runAlgorithm() {
    let generated: GridStep[] = []
    if (activeTopic === 'BFS') generated = bfs(grid)
    else if (activeTopic === 'DFS') generated = dfs(grid)
    else if (activeTopic === 'Dijkstra') generated = dijkstra(grid)
    else if (activeTopic === 'A*') generated = aStar(grid)
    setSteps(generated)
    onStepsGenerated(generated.length)
  }

  const step = steps[currentStep]

  function getCellStyle(cell: Cell): string {
    if (cell.state === 'start') return styles.start
    if (cell.state === 'end') return styles.end
    if (cell.state === 'wall') return styles.wall
    if (step) {
      const isPath = step.path?.some(([r, c]) => r === cell.row && c === cell.col)
      const isVisited = step.visited.some(([r, c]) => r === cell.row && c === cell.col)
      if (isPath) return styles.path
      if (isVisited) return styles.visited
    }
    return styles.empty
  }

  function toggleWall(row: number, col: number, forceState?: 'wall' | 'empty') {
    const cell = grid[row][col]
    if (cell.state === 'start' || cell.state === 'end') return
    setGrid(prev => prev.map(r => r.map(c =>
      c.row === row && c.col === col
        ? { ...c, state: forceState ?? (c.state === 'wall' ? 'empty' : 'wall') }
        : c
    )))
  }

  function handleMouseDown(e: React.MouseEvent, row: number, col: number) {
    if (e.button === 0) {
      setIsLeftDown(true)
      toggleWall(row, col, 'wall')
    } else if (e.button === 2) {
      setIsRightDown(true)
      toggleWall(row, col, 'empty')
    }
  }

  function handleMouseEnter(row: number, col: number) {
    if (isLeftDown) toggleWall(row, col, 'wall')
    if (isRightDown) toggleWall(row, col, 'empty')
  }

  return (
    <div
      className={styles.gridContainer}
      onMouseUp={() => { setIsLeftDown(false); setIsRightDown(false) }}
      onMouseLeave={() => { setIsLeftDown(false); setIsRightDown(false) }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {grid.map((row, ri) => (
        <div key={ri} className={styles.row}>
          {row.map((cell, ci) => (
            <div
              key={ci}
              className={`${styles.cell} ${getCellStyle(cell)}`}
              onMouseDown={(e) => handleMouseDown(e, cell.row, cell.col)}
              onMouseEnter={() => handleMouseEnter(cell.row, cell.col)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default GridVisualiser