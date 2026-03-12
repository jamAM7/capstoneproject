// function TopicViewerPage() {
//   return <div>TopicViewer</div>
// }

// export default TopicViewerPage


import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { topicsByCategory } from '../../data/topics'
import styles from './TopicViewer.module.css'

// import ArrayVisualiser from '../../visualisers/arrays/ArrayVisualiser'
// import LinkedListVisualiser from '../../visualisers/linkedlist/LinkedListVisualiser'

// const visualiserMap: Record<string, React.ComponentType> = {
//   'Arrays': ArrayVisualiser,
//   'Linked Lists': LinkedListVisualiser,
// }

function TopicViewer() {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()

  const topics = topicsByCategory[category ?? ''] ?? []
  const [activeTopic, setActiveTopic] = useState(topics[0] ?? '')

  return (
    <div className={styles.page}>

      {/* Tab bar */}
      <div className={styles.tabs}>
        {topics.map((topic) => (
          <button
            key={topic}
            className={`${styles.tab} ${activeTopic === topic ? styles.tabActive : ''}`}
            onClick={() => setActiveTopic(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Main content area */}
      <div className={styles.content}>

        {/* Visual panel */}
        <div className={styles.visualPanel}>
          <div className={styles.panelHeader}>Visual Representation</div>
          <div className={styles.visualArea}>
            {/* Animation will go here */}
            <span className={styles.placeholder}>Animation for {activeTopic}</span>
          </div>

          {/* const Visualiser = visualiserMap[activeTopic]

          {Visualiser ? <Visualiser /> : <span>Coming soon</span>} */}

          {/* Playback controls */}
          <div className={styles.controls}>
            <button className={styles.controlBtn}>⏮ Reset</button>
            <button className={styles.controlBtn}>⏪ Back</button>
            <button className={styles.controlBtn}>▶ Play</button>
            <button className={styles.controlBtn}>⏩ Forward</button>
            <button className={styles.controlBtn}>⏸ Pause</button>
          </div>
        </div>

        {/* Pseudocode panel */}
        <div className={styles.pseudocodePanel}>
          <div className={styles.panelHeader}>Pseudocode</div>
          <div className={styles.pseudocodeArea}>
            {/* Pseudocode with step highlighting will go here */}
            <span className={styles.placeholder}>Pseudocode for {activeTopic}</span>
          </div>
        </div>

      </div>

      {/* Quiz button */}
      <div className={styles.quizRow}>
        <button
          className={styles.quizBtn}
          onClick={() => navigate(`/quiz/${category}/${activeTopic}`)}
        >
          Take a quiz on {activeTopic} →
        </button>
      </div>

    </div>
  )
}

export default TopicViewer
