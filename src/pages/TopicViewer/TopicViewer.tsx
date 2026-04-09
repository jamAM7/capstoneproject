import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { topicsByCategory } from '../../data/topics'
import styles from './TopicViewer.module.css'

import ArrayVisualiser from '../../visualisers/arrays/ArrayVisualiser'
import LinkedListVisualiser from '../../visualisers/linkedlist/LinkedListVisualiser'
import SortingVisualiser from '../../visualisers/sorting/SortingVisualiser'
import BSTVisualiser from '../../visualisers/bst/BSTVisualiser'

import PseudocodePanel from '../../components/PseudocodePanel/PseudocodePanel'
import { bubbleSortPseudo } from '../../visualisers/sorting/algorithms/bubbleSortPseudo'
import { arrayPseudo } from '../../visualisers/arrays/algorithms/arrayPseudo'
import { bstPseudo } from '../../visualisers/bst/algorithms/bstPseudo'

type VisualiserProps = {
  data: string[]
  currentStep: number
  onStepsGenerated: (total: number) => void
  onPseudoLineChange: (line: number) => void
  barMode: boolean
}

const visualiserMap: Record<string, React.ComponentType<VisualiserProps>> = {
  'Arrays': ArrayVisualiser,
  'Linked Lists': LinkedListVisualiser,
  'Bubble Sort': SortingVisualiser,
  'BST': BSTVisualiser,
}

const pseudoMap: Record<string, string[]> = {
  'Bubble Sort': bubbleSortPseudo,
  'Arrays': arrayPseudo,
  'BST': bstPseudo,
}

function TopicViewer() {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()

  const categoryData = topicsByCategory[category as keyof typeof topicsByCategory]
  const [activeSubTab, setActiveSubTab] = useState<'structures' | 'algorithms'>('structures')

  const topics = categoryData ? categoryData[activeSubTab] : []
  const [activeTopic, setActiveTopic] = useState(topics[0] ?? '')

  const [userInput, setUserInput] = useState('5,2,4,3,9,1')
  const inputArray = userInput.split(',').map(s => s.trim()).filter(s => s !== '')

  const [isArray, setIsArray] = useState(false)
  const [barMode, setBarMode] = useState(false)

  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const [activePseudoLine, setActivePseudoLine] = useState<number | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)

  const Visualiser = visualiserMap[activeTopic]
  const pseudoLines = pseudoMap[activeTopic] ?? []

  function handleBarButton() {
    if (activeTopic == 'Bubble Sort') {
      setIsArray(true)
    } else {
      setIsArray(false)
    }
  }

  useEffect(() => {
    setCurrentStep(0)
    setIsPlaying(false)
    handleBarButton()
  }, [activeTopic, userInput])

  useEffect(() => {
    setBarMode(false)
  }, [activeSubTab])

  useEffect(() => {
    if (!isPlaying) return
    if (currentStep >= totalSteps - 1) {
      setIsPlaying(false)
      return
    }
    const interval = setInterval(() => {
      setCurrentStep(s => {
        if (s >= totalSteps - 1) {
          setIsPlaying(false)
          return s
        }
        return s + 1
      })
    }, 600)
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, totalSteps])

  function handleSubTabChange(subTab: 'structures' | 'algorithms') {
    setActiveSubTab(subTab)
    const newTopics = categoryData ? categoryData[subTab] : []
    setActiveTopic(newTopics[0] ?? '')
  }

  return (
    <div className={styles.page}>

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

      <div className={styles.inputRow}>
        <label className={styles.inputLabel}>Input array:</label>
        <input
          className={styles.inputField}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="e.g. 5,2,4,3,9,1"
        />
      </div>

      <div className={styles.content}>

        <div className={styles.visualPanel}>
          <div className={styles.panelHeader}>Visual Representation</div>
          <div className={styles.visualArea}>
            {Visualiser
              ? <Visualiser
                  data={inputArray}
                  currentStep={currentStep}
                  onStepsGenerated={setTotalSteps}
                  onPseudoLineChange={setActivePseudoLine}
                  barMode={barMode}
                />
              : <span className={styles.placeholder}>Animation for {activeTopic}</span>
            }
            {isArray
              ? <button className={styles.sortingViewSwitch} onClick={() => setBarMode(b => !b)}>
                  {barMode ? 'Square Mode' : 'Bar Mode'}
                </button>
              : null
            }
          </div>

          <div className={styles.controls}>
            <button className={styles.controlBtn} onClick={() => setCurrentStep(0)}>Reset</button>
            <button className={styles.controlBtn} onClick={() => setCurrentStep(s => Math.max(0, s - 1))}>Back</button>
            <button className={styles.controlBtn} onClick={() => setIsPlaying(p => !p)}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button className={styles.controlBtn} onClick={() => setCurrentStep(s => Math.min(totalSteps - 1, s + 1))}>Forward</button>
          </div>
        </div>

        <div className={styles.pseudocodePanel}>
          <div className={styles.panelHeader}>Pseudocode</div>
          <div className={styles.pseudocodeArea}>
            {pseudoLines.length > 0
              ? <PseudocodePanel lines={pseudoLines} activeLine={activePseudoLine} />
              : <span className={styles.placeholder}>Pseudocode for {activeTopic}</span>
            }
          </div>
        </div>

      </div>

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
















// import { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { topicsByCategory } from '../../data/topics'
// import styles from './TopicViewer.module.css'

// import ArrayVisualiser from '../../visualisers/arrays/ArrayVisualiser'
// import LinkedListVisualiser from '../../visualisers/linkedlist/LinkedListVisualiser'
// import SortingVisualiser from '../../visualisers/sorting/SortingVisualiser'

// // Defines what props every visualiser component must accept
// type VisualiserProps = {
//   data: string[]
//   currentStep: number
//   onStepsGenerated: (total: number) => void
//   barMode: boolean
// }

// // Maps topic name string to its component
// const visualiserMap: Record<string, React.ComponentType<VisualiserProps>> = {
//   'Arrays': ArrayVisualiser,
//   'Linked Lists': LinkedListVisualiser,
//   'Bubble Sort': SortingVisualiser,
// }

// function TopicViewer() {
//   const { category } = useParams<{ category: string }>()  // reads category from url (useParams allows this) So if at /topics/lists, category equals "lists"
//   const navigate = useNavigate()

//   const categoryData = topicsByCategory[category as keyof typeof topicsByCategory] // calculated fresh every render
//   const [activeSubTab, setActiveSubTab] = useState<'structures' | 'algorithms'>('structures') // makes sure active subtab is 'structures'. The useState patter is [value, setvalue]

//   const topics = categoryData ? categoryData[activeSubTab] : [] // calculated fresh every render
//   const [activeTopic, setActiveTopic] = useState(topics[0] ?? '')

//   const [userInput, setUserInput] = useState('5,2,4,3,9,1')
//   const inputArray = userInput.split(',').map(s => s.trim()).filter(s => s !== '') // calculated fresh every render

//   const [isSorting, setIsSorting] = useState(false) // tells us if we are projecting arrays (used to know whether to project barmode button)
//   const [barMode, setBarMode] = useState(false) // sets bar mode to nothing initially

//   // These track where in the animation (and in future psuedocode step)
//   const [currentStep, setCurrentStep] = useState(0)
//   const [totalSteps, setTotalSteps] = useState(0)

//   const Visualiser = visualiserMap[activeTopic]

//   // checks if the topic is an array, if so works to display the barmode button
//   function handleBarButton() {
//     // if (activeTopic == 'Arrays' || activeTopic == 'Bubble Sort') {
//     if (activeTopic == 'Bubble Sort') {
//       setIsSorting(true);
//     }
//     else {
//       setIsSorting(false);
//     }
//   }

//   // Every time activeTopic or userInput changes, this runs setCurrentStep(0)
//   useEffect(() => {
//     setCurrentStep(0)
//     handleBarButton()
//   }, [activeTopic, userInput]) // this array at end is called dependecy array which controls when the effect runs

//   // Every Time activeSubTab changes
//   useEffect(() => {
//     setBarMode(false)
//   }, [activeSubTab])

//   // Clicking on DS or Algo updates the sub tab, and also resets active topic to first item in list
//   function handleSubTabChange(subTab: 'structures' | 'algorithms') {
//     setActiveSubTab(subTab)
//     const newTopics = categoryData ? categoryData[subTab] : []
//     setActiveTopic(newTopics[0] ?? '') // the ?? means if left side is null, use right side
//   }


//   return (
//     <div className={styles.page}>

//       {/* Sub-tab bar */}
//       <div className={styles.subTabs}>
//         <button
//           className={`${styles.subTab} ${activeSubTab === 'structures' ? styles.subTabActive : ''}`} // condition ? a : b means if condition true, use a, otherwise use b. Only the active class will be added
//           onClick={() => handleSubTabChange('structures')}
//         >
//           Data Structures
//         </button>
//         <button
//           className={`${styles.subTab} ${activeSubTab === 'algorithms' ? styles.subTabActive : ''}`} // condition ? a : b means if condition true, use a, otherwise use b. Only the active class will be added
//           onClick={() => handleSubTabChange('algorithms')}
//         >
//           Algorithms
//         </button>
//       </div>

//       {/* Topic tab bar */}
//       <div className={styles.tabs}>
//         {topics.map((topic) => ( // .map() transforms topics array into an array of JSX elements. React then renders arrays of elements automatically
//           <button
//             key={topic}
//             className={`${styles.tab} ${activeTopic === topic ? styles.tabActive : ''}`}
//             onClick={() => setActiveTopic(topic)}
//           >
//             {topic}
//           </button>
//         ))}
//       </div>

//       {/* User input */}
//       <div className={styles.inputRow}>
//         <label className={styles.inputLabel}>Input array:</label>
//         <input
//           className={styles.inputField}
//           type="text"
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           placeholder="e.g. 5,2,4,3,9,1"
//         />
//       </div>

//       {/* Main content area */}
//       <div className={styles.content}>

//         {/* Visual panel */}
//         <div className={styles.visualPanel}>
//           <div className={styles.panelHeader}>Visual Representation</div>
//           <div className={styles.visualArea}>
//             {/* if Visualiser exists in the map for the active topci, render it with its props, 
//             otherwise show the placeholder text */}
//             {Visualiser
//               ? <Visualiser data={inputArray} currentStep={currentStep} onStepsGenerated={setTotalSteps} barMode={barMode} />
//               : <span className={styles.placeholder}>Animation for {activeTopic}</span>
//             }
//             {isSorting
//               ? <button className={styles.sortingViewSwitch} onClick={() => setBarMode(b => !b)}>
//                   {barMode ? 'Square Mode' : 'Bar Mode'}
//                 </button>
//               : <span className={styles.placeholder}>Button</span>
//             }
//              {/* <button className={styles.sortingViewSwitch} onClick={() => setBarMode(b => !b)}>
//                {barMode ? 'Square Mode' : 'Bar Mode'}
//              </button> */}
//           </div>

//           {/* Playback controls */}
//           <div className={styles.controls}>
//             <button className={styles.controlBtn} onClick={() => setCurrentStep(0)}>Reset</button>
//             <button className={styles.controlBtn} onClick={() => setCurrentStep(s => Math.max(0, s - 1))}>Back</button>
//             <button className={styles.controlBtn} onClick={() => setCurrentStep(s => Math.min(totalSteps - 1, s + 1))}>Forward</button>
//           </div>
//         </div>

//         {/* Pseudocode panel */}
//         <div className={styles.pseudocodePanel}>
//           <div className={styles.panelHeader}>Pseudocode</div>
//           <div className={styles.pseudocodeArea}>
//             <span className={styles.placeholder}>Pseudocode for {activeTopic}</span>
//           </div>
//         </div>

//       </div>

//       {/* Quiz button */}
//       <div className={styles.quizRow}>
//         <button
//           className={styles.quizBtn}
//           onClick={() => navigate(`/quiz/${category}/${activeTopic}`)}
//         >
//           Take a quiz on {activeTopic} →
//         </button>
//       </div>

//     </div>
//   )
// }

// export default TopicViewer