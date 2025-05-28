
import { ChevronLeft, ChevronRight } from "lucide-react"
import styles from "../style/HeroSection.module.css"

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      {/* Content */}
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.subtitle}>FEEL THE DIFFERENCE WITH US</p>
          <h1 className={styles.title}>
            Your Health <span className={styles.titleBlock}>Is Our Priority</span>
          </h1>
          <div className={styles.buttonGroup}>
            <button className={styles.primaryButton}>GET A QUOTE</button>
            <button className={styles.secondaryButton}>OUR SERVICES</button>
          </div>
        </div>
      </div>
    </section>
  )
}
