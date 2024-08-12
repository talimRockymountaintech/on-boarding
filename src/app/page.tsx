
import { Container } from '@mui/material'
import styles from './page.module.css'
import HomePage from './components/HomePage'
export default function Home() {
  
  return (
    <main className={styles.main}>
      <Container maxWidth="sm">
       <HomePage/>
      </Container>
    </main>
  )
}
