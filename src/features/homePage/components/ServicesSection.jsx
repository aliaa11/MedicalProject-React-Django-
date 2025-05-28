import { FileText, Users, Microscope, Clock, User, Heart } from "lucide-react"
import styles from "../style/ServicesSection.module.css"
import servicesImage from "../../../assets/senior-doctor-explaining-colleague-data-clipboard.jpg"
const services = [
  {
    icon: FileText,
    title: "MEDICAL COUNSELING",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit vero. Donec ultri sollicitudin lacus",
  },
  {
    icon: Users,
    title: "TOP LEVEL DOCTORS",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit vero. Donec ultri sollicitudin lacus",
  },
  {
    icon: Microscope,
    title: "MEDICAL FACILITES",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit vero. Donec ultri sollicitudin lacus",
  },
  {
    icon: Clock,
    title: "24 HOURS SERVICES",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit vero. Donec ultri sollicitudin lacus",
  },
  {
    icon: User,
    title: "PERSONAL SERVICES",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit vero. Donec ultri sollicitudin lacus",
  },
  {
    icon: Heart,
    title: "DEDICATED PATIENT CARE",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit vero. Donec ultri sollicitudin lacus",
  },
]

export default function ServicesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Content */}
          <div>
            <p className={styles.subtitle}>WHY CHOOSE HOPE MEDICAL</p>
            <h2 className={styles.title}>
              <span className={styles.titleHighlight}>The Best</span> For Your Health
            </h2>

            <div className={styles.servicesGrid}>
              {services.map((service, index) => (
                <div key={index} className={styles.serviceItem}>
                  <div className={styles.serviceIcon}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={styles.serviceContent}>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className={styles.imageContainer}>
            <img src={servicesImage} alt="Medical Professional" className={styles.image} />
          </div>
        </div>
      </div>
    </section>
  )
}
