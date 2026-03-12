// import { Link } from 'react-router-dom'

// function HomePage() {
//   return (
//     <div>
//       <Link to="/topic/graphs">
//         <button>Graphs</button>
//       </Link>
//       <Link to="/topic/lists">
//         <button>Lists</button>
//       </Link>
//     </div>
//   )
// }

// export default HomePage


import { Link } from 'react-router-dom'
import styles from './Home.module.css'

function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>What do you want to learn?</h1>
        <p className={styles.subtitle}>
          Pick a category to explore algorithms and data structures with interactive visualisations.
        </p>
      </div>

      <div className={styles.cards}>
        <Link to="/topic/lists" className={styles.card}>
          <span className={styles.cardLabel}>Lists</span>
          <p className={styles.cardDescription}>
            Arrays, Linked Lists, Stacks, Queues, Sorting, Searching
          </p>
          <span className={styles.cardArrow}>→</span>
        </Link>

        <Link to="/topic/graphs" className={styles.card}>
          <span className={styles.cardLabel}>Graphs</span>
          <p className={styles.cardDescription}>
            BFS, DFS, Dijkstra, MST, Topological Sort
          </p>
          <span className={styles.cardArrow}>→</span>
        </Link>
      </div>
    </div>
  )
}

export default HomePage
