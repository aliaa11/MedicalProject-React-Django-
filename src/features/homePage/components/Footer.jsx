
import { useState } from "react"
import { MapPin, Mail, Phone, ArrowRight } from "lucide-react"
import styles from "../style/Footer.module.css"

const popularTags = [
  "Amazing",
  "Envato",
  "Themes",
  "Clean",
  "Wordpress",
  "Creative",
  "Multipurpose",
  "Retina Ready",
  "Twitter",
  "Responsive",
]

const recentPosts = [
  "Lorem Ipsum dolor sit amet pulvinar",
  "Medical is all about quality.",
  "Is your website user friendly ?",
  "AI offer weekly updates & more.",
  "Customer should love your web.",
  "Your site smooth and stunning.",
]

export default function Footer() {
  const [email, setEmail] = useState("")

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Company Info */}
          <div className={styles.companySection}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <div className={styles.logoIconInner}></div>
              </div>
              <div className={styles.logoText}>
                <div className={styles.logoTitle}>MEDICAL</div>
              </div>
            </div>

            <p className={styles.description}>
              Sed elit quam, iaculis sed semper sit amet udin vitae nibh at magna akal semperFusce.
            </p>

            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <MapPin className={`w-4 h-4 ${styles.contactIcon}`} />
                <span className={styles.contactText}>69 Halsey St, New York, Ny 10002, United States.</span>
              </div>
              <div className={styles.contactItem}>
                <Mail className={`w-4 h-4 ${styles.contactIcon}`} />
                <span className={styles.contactText}>hello@yourdomain.com</span>
              </div>
              <div className={styles.contactItem}>
                <Phone className={`w-4 h-4 ${styles.contactIcon}`} />
                <span className={styles.contactText}>(0091) 8547 632521</span>
              </div>
            </div>
          </div>

          {/* Popular Tags */}
          <div>
            <h3 className={styles.sectionTitle}>Popular Tags</h3>
            <div className={styles.tagsContainer}>
              {popularTags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <h3 className={styles.sectionTitle}>Recent Posts</h3>
            <div className={styles.postsContainer}>
              {recentPosts.map((post, index) => (
                <div key={index} className={styles.postItem}>
                  <ArrowRight className={`w-4 h-4 ${styles.postIcon}`} />
                  <span className={styles.postText}>{post}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className={styles.newsletterSection}>
            <h3 className={styles.sectionTitle}>Newsletter</h3>
            <p className={styles.newsletterDescription}>
              Sign up for our mailing list to get latest updates and offers.
            </p>

            <div className={styles.emailForm}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.emailInput}
              />
              <button className={styles.submitButton}>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          <p className={styles.copyrightText}>
            © 2025 <span className={styles.brandHighlight}>MEDICAL</span>. Made with ❤️ by HasThemes
          </p>
        </div>
      </div>
    </footer>
  )
}
