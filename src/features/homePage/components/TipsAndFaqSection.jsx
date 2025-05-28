import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import styles from "../style/TipsAndFaqSection.module.css"

const tips = [
  {
    id: 1,
    title: "Problems About Social Insurance For Truck Drivers",
    date: "December 14th, 2021",
    author: "Admin",
  },
  {
    id: 2,
    title: "5 Secrets To Coaching Your Employees To Greatness",
    date: "Sep 17th, 2021",
    author: "Torres",
  
  },
  {
    id: 3,
    title: "5 Steps To Build Strategy Planning",
    date: "May 15th, 2021",
    author: "Admin",
   
  },
]

const faqs = [
  {
    id: 1,
    question: "Can I Get A Divorce Without A Consultant?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur consectetur elit lacinia ornare. In volutpat rutrum molestie. Vivamus efficitur orci, ac gravida eros bibendum non. Nullam auctor varius faucibus ante ipsum primis in faucibus orci luctus et ultrices.",
  },
  {
    id: 2,
    question: "I Have A Technical Problem Or Support Issue I Need Resolved, Who Do I Email?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur consectetur elit lacinia ornare.",
  },
  {
    id: 3,
    question: "What Other Services Are You Compatible With?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur consectetur elit lacinia ornare.",
  },
  {
    id: 4,
    question: "Are You Hiring?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur consectetur elit lacinia ornare.",
  },
]

export default function TipsAndFaqSection() {
  const [openFaq, setOpenFaq] = useState(1)

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Tips & Tricks */}
          <div>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleHighlight}>Tips &</span> Tricks
            </h2>

            <div className={styles.tipsContainer}>
              {tips.map((tip) => (
                <div key={tip.id} className={styles.tipItem}>
                  <div className={styles.tipContent}>
                    <h3>{tip.title}</h3>
                    <p className={styles.tipMeta}>
                      {tip.date} by <span>{tip.author}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleHighlight}>FAQs</span>
            </h2>

            <div className={styles.faqContainer}>
              {faqs.map((faq) => (
                <div key={faq.id} className={styles.faqItem}>
                  <div className={styles.faqHeader}>
                    <button onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)} className={styles.faqButton}>
                      <span className={styles.faqQuestion}>{faq.question}</span>
                      {openFaq === faq.id ? (
                        <ChevronUp className={`w-5 h-5 ${styles.faqIcon}`} />
                      ) : (
                        <ChevronDown className={`w-5 h-5 ${styles.faqIcon}`} />
                      )}
                    </button>
                    {openFaq === faq.id && (
                      <div className={styles.faqContent}>
                        <p className={styles.faqAnswer}>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
