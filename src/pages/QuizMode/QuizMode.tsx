import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quizMap } from '../../data/quizzes/quizMap'
import styles from './QuizMode.module.css'

function QuizMode() {
  const { category, topic } = useParams<{ category: string; topic: string }>()
  const navigate = useNavigate()

  const questions = quizMap[topic ?? ''] ?? []
  const total = questions.length

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[currentIndex]
  const progressPercent = total > 0 ? ((currentIndex) / total) * 100 : 0

  function handleSubmit() {
    if (selectedOption === null) return
    if (selectedOption === question.correctIndex) {
      setScore(s => s + 1)
    }
    setSubmitted(true)
  }

  function handleNext() {
    if (currentIndex + 1 >= total) {
      setFinished(true)
    } else {
      setCurrentIndex(i => i + 1)
      setSelectedOption(null)
      setSubmitted(false)
    }
  }

  if (questions.length === 0) {
    return (
      <div className={styles.page}>
        <p>No quiz available for {topic} yet.</p>
        <button className={styles.backBtn} onClick={() => navigate(`/topic/${category}`)}>
          ← Back
        </button>
      </div>
    )
  }

  if (finished) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(`/topic/${category}`)}>
            ← Back to {topic}
          </button>
          <h1 className={styles.title}>Quiz Complete</h1>
        </div>
        <div className={styles.questionCard}>
          <p className={styles.questionText}>
            You scored <strong>{score}</strong> out of <strong>{total}</strong>
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.submitBtn} onClick={() => {
            setCurrentIndex(0)
            setSelectedOption(null)
            setSubmitted(false)
            setScore(0)
            setFinished(false)
          }}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(`/topic/${category}`)}>
          ← Back to {topic}
        </button>
        <h1 className={styles.title}>Quiz: {topic}</h1>
        <div className={styles.progress}>
          <span className={styles.progressText}>Question {currentIndex + 1} of {total}</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div className={styles.questionCard}>
        <p className={styles.questionText}>{question.question}</p>
      </div>

      <div className={styles.options}>
        {question.options.map((option, index) => {
          let optionClass = styles.optionBtn
          if (submitted) {
            if (index === question.correctIndex) optionClass = `${styles.optionBtn} ${styles.correct}`
            else if (index === selectedOption) optionClass = `${styles.optionBtn} ${styles.incorrect}`
          } else if (index === selectedOption) {
            optionClass = `${styles.optionBtn} ${styles.selected}`
          }
          return (
            <button
              key={index}
              className={optionClass}
              onClick={() => !submitted && setSelectedOption(index)}
            >
              {option}
            </button>
          )
        })}
      </div>

      <div className={styles.actions}>
        {!submitted
          ? <button className={styles.submitBtn} onClick={handleSubmit} disabled={selectedOption === null}>
              Submit Answer
            </button>
          : <button className={styles.submitBtn} onClick={handleNext}>
              {currentIndex + 1 >= total ? 'See Results' : 'Next Question'}
            </button>
        }
      </div>
    </div>
  )
}

export default QuizMode