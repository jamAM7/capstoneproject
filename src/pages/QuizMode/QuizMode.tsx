// function QuizModePage() {
//   return <div>Quiz</div>
// }

// export default QuizModePage

import { useParams, useNavigate } from 'react-router-dom'
import styles from './QuizMode.module.css'

function QuizMode() {
  const { category, topic } = useParams<{ category: string; topic: string }>()
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(`/topic/${category}`)}>
          ← Back to {topic}
        </button>
        <h1 className={styles.title}>Quiz: {topic}</h1>
        <div className={styles.progress}>
          <span className={styles.progressText}>Question 1 of 5</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '20%' }} />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className={styles.questionCard}>
        <p className={styles.questionText}>
          Question will appear here...
        </p>
      </div>

      {/* Answer options */}
      <div className={styles.options}>
        {['Option A', 'Option B', 'Option C', 'Option D'].map((option) => (
          <button key={option} className={styles.optionBtn}>
            {option}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.submitBtn}>Submit Answer</button>
      </div>
    </div>
  )
}

export default QuizMode
