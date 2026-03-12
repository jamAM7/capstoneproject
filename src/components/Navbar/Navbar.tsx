// function Navbar() {
//   return (
//     <nav>
//       <h1>DSA Learning</h1>
//     </nav>
//   )
// }

// export default Navbar

import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        DSA Learning
      </Link>
    </nav>
  )
}

export default Navbar
