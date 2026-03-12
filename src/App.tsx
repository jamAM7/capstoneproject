// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Layout from './components/Layout/Layout'
// import HomePage from './pages/Home/Home'
// import TopicViewer from './pages/TopicViewer/TopicViewer'
// import QuizMode from './pages/QuizMode/QuizMode'

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<Layout />}>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/topic/:category" element={<TopicViewer />} />
//           <Route path="/quiz" element={<QuizMode />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App


import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/Home/Home'
import TopicViewer from './pages/TopicViewer/TopicViewer'
import QuizMode from './pages/QuizMode/QuizMode'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/topic/:category" element={<TopicViewer />} />
          <Route path="/quiz/:category/:topic" element={<QuizMode />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
