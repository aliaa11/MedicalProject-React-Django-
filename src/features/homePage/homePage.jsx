import Header from "./components/Header"
import HeroSection from "./components/HeroSection"
import ServicesSection from "./components/ServicesSection"
import DoctorsSection from "./components/DoctorsSection"
import TipsAndFaqSection from "./components/TipsAndFaqSection"
import Footer from "./components/Footer"
import styles from "./style/HomePage.module.css"

export default function HomePage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.section}>
          <Header />
        </div>
        <div className={styles.section}>
          <HeroSection />
        </div>
        <div className={styles.section}>
          <ServicesSection />
        </div>
        <div className={styles.section}>
          <DoctorsSection />
        </div>
        <div className={styles.section}>
          <TipsAndFaqSection />
        </div>
        <div className={styles.section}>
          <Footer />
        </div>
      </main>
    </div>
  )
}
