import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { topicsByCategory } from '../../data/topics'
import styles from './TopicViewer.module.css'

import ArrayVisualiser from '../../visualisers/arrays/ArrayVisualiser'
import LinkedListVisualiser from '../../visualisers/linkedlist/LinkedListVisualiser'
import SortingVisualiser from '../../visualisers/sorting/SortingVisualiser'

type VisualiserProps = {
  data: string[]
  currentStep: number
  onStepsGenerated: (total: number) => void
}

const visualiserMap: Record<string, React.ComponentType<VisualiserProps>> = {
  'Arrays': ArrayVisualiser,
  'Linked Lists': LinkedListVisualiser,
  'Bubble Sort': SortingVisualiser,
}

function TopicViewer() {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()

  const categoryData = topicsByCategory[category as keyof typeof topicsByCategory]
  const [activeSubTab, setActiveSubTab] = useState<'structures' | 'algorithms'>('structures')

  const topics = categoryData ? categoryData[activeSubTab] : []
  const [activeTopic, setActiveTopic] = useState(topics[0] ?? '')

  const [userInput, setUserInput] = useState('1,2,3,4,5')
  const inputArray = userInput.split(',').map(s => s.trim()).filter(s => s !== '')

  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)

  const Visualiser = visualiserMap[activeTopic]

  useEffect(() => {
    setCurrentStep(0)
  }, [activeTopic, userInput])

  function handleSubTabChange(subTab: 'structures' | 'algorithms') {
    setActiveSubTab(subTab)
    const newTopics = categoryData ? categoryData[subTab] : []
    setActiveTopic(newTopics[0] ?? '')
  }

  return (
    <div className={styles.page}>

      {/* Sub-tab bar */}
      <div className={styles.subTabs}>
        <button
          className={`${styles.subTab} ${activeSubTab === 'structures' ? styles.subTabActive : ''}`}
          onClick={() => handleSubTabChange('structures')}
        >
          Data Structures
        </button>
        <button
          className={`${styles.subTab} ${activeSubTab === 'algorithms' ? styles.subTabActive : ''}`}
          onClick={() => handleSubTabChange('algorithms')}
        >
          Algorithms
        </button>
      </div>

      {/* Topic tab bar */}
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

      {/* User input */}
      <div className={styles.inputRow}>
        <label className={styles.inputLabel}>Input array:</label>
        <input
          className={styles.inputField}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="e.g. 1,2,3,4,5"
        />
      </div>

      {/* Main content area */}
      <div className={styles.content}>

        {/* Visual panel */}
        <div className={styles.visualPanel}>
          <div className={styles.panelHeader}>Visual Representation</div>
          <div className={styles.visualArea}>
            {Visualiser
              ? <Visualiser data={inputArray} currentStep={currentStep} onStepsGenerated={setTotalSteps} />
              : <span className={styles.placeholder}>Animation for {activeTopic}</span>
            }
          </div>

          {/* Playback controls */}
          <div className={styles.controls}>
            <button className={styles.controlBtn} onClick={() => setCurrentStep(0)}>Reset</button>
            <button className={styles.controlBtn} onClick={() => setCurrentStep(s => Math.max(0, s - 1))}>Back</button>
            <button className={styles.controlBtn} onClick={() => setCurrentStep(s => Math.min(totalSteps - 1, s + 1))}>Forward</button>
          </div>
        </div>

        {/* Pseudocode panel */}
        <div className={styles.pseudocodePanel}>
          <div className={styles.panelHeader}>Pseudocode</div>
          <div className={styles.pseudocodeArea}>
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