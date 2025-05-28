import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import styles from "../style/Header.module.css"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userObj = JSON.parse(user)
        setUserRole(userObj.role)
      } catch (error) {
        console.error('Failed to parse user from localStorage', error)
      }
    }
  }, [])
  const getDashboardUrl = () => {
    if (userRole === 'doctor') {
      return '/doctor/profile'
    } else if (userRole === 'patient') {
      return '/patient/profile'
    }
    return '/'
  }

  const shouldShowDashboard = () => {
    return userRole === 'doctor' || userRole === 'patient'
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <div className={styles.logoIconInner}></div>
            </div>
            <div className={styles.logoText}>
              <div className={styles.logoTitle}>MEDICAL</div>
            </div>
          </div>

          <nav className={styles.nav}>
            <a href="/" className={styles.navLink}>
              HOME
            </a>
            {shouldShowDashboard() && (
              <a href={getDashboardUrl()} className={styles.navLink}>
                My Dashboard
              </a>
            )}
          </nav>

          <div>
            {userRole ? (
              <button 
                className={styles.ctaButton}
                onClick={() => {
                  localStorage.removeItem('user'); 
                  setUserRole(null);
                  window.location.href = '/'; 
                }}
              >
                Logout
              </button>
            ) : (
              <button 
                className={styles.ctaButton}
                onClick={() => {
                  window.location.href = '/login';
                }}
              >
                Login
              </button>
            )}
          </div>

          <button className={styles.mobileMenuButton} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNav}>
              <a href="/" className={styles.mobileNavLink}>
                HOME
              </a>
              {shouldShowDashboard() && (
                <a href={getDashboardUrl()} className={styles.mobileNavLink}>
                  My Dashboard
                </a>
              )}
              <button className={styles.mobileCta}>BOOK AN APPOINTMENT</button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}