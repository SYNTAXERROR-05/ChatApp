// Help page functionality
class HelpManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupFAQ()
    this.setupSearch()
    this.setupSupportActions()
    this.setupSmoothScrolling()
  }

  setupFAQ() {
    const faqItems = document.querySelectorAll(".faq-item")

    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
      const answer = item.querySelector(".faq-answer")

      // Add accessibility attributes
      question.setAttribute('role', 'button')
      question.setAttribute('aria-expanded', 'false')
      question.setAttribute('tabindex', '0')
      
      // Add keyboard support
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          question.click()
        }
      })

      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active")

        // Close all other FAQ items
        faqItems.forEach((otherItem) => {
          otherItem.classList.remove("active")
          otherItem.querySelector(".faq-question").setAttribute('aria-expanded', 'false')
        })

        // Toggle current item
        if (!isActive) {
          item.classList.add("active")
          question.setAttribute('aria-expanded', 'true')
        } else {
          question.setAttribute('aria-expanded', 'false')
        }
      })
    })
  }

  setupSearch() {
    const searchInput = document.getElementById("helpSearch")
    const searchBtn = document.querySelector(".search-btn")

    if (!searchInput || !searchBtn) {
      console.error("Search elements not found")
      return
    }

    const performSearch = () => {
      const query = searchInput.value.trim()
      if (query) {
        this.searchHelp(query)
      }
    }

    searchBtn.addEventListener("click", performSearch)
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        performSearch()
      }
    })
  }

  searchHelp(query) {
    if (!window.showNotification) {
      console.error("showNotification function not available")
      return
    }

    window.showNotification(`Searching for: "${query}"`, "info", 3000)

    // Simulate search results
    setTimeout(() => {
      const results = this.getSearchResults(query)
      this.displaySearchResults(results)
    }, 1000)
  }

  getSearchResults(query) {
    const mockResults = [
      {
        title: "How to send messages",
        content: "Learn how to send text, voice, and media messages",
        category: "Messaging",
      },
      {
        title: "Account security",
        content: "Keep your account safe with these security tips",
        category: "Security",
      },
      {
        title: "Notification settings",
        content: "Customize your notification preferences",
        category: "Settings",
      },
    ]

    return mockResults.filter(
      (result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.content.toLowerCase().includes(query.toLowerCase()),
    )
  }

  displaySearchResults(results) {
    if (results.length > 0) {
      window.showNotification(`Found ${results.length} result(s)`, "success", 3000)
    } else {
      window.showNotification("No results found", "warning", 3000)
    }
  }

  setupSupportActions() {
    // These functions would be called by the onclick handlers in the HTML
    window.startLiveChat = () => {
      window.showNotification("Starting live chat...", "info", 3000)
      setTimeout(() => {
        window.showNotification("Connected to support agent!", "success", 3000)
      }, 2000)
    }

    window.openEmailSupport = () => {
      window.showNotification("Opening email client...", "info", 2000)
      // In a real app, this would open the default email client
      setTimeout(() => {
        window.location.href = "mailto:support@translatalk.com?subject=Support Request"
      }, 1000)
    }

    window.openDocs = () => {
      window.showNotification("Opening documentation...", "info", 2000)
      // In a real app, this would open the documentation site
      setTimeout(() => {
        window.open("https://docs.translatalk.com", "_blank")
      }, 1000)
    }

    window.startBotChat = () => {
      window.showNotification("Starting chat with TranslaBot...", "info", 3000)
      setTimeout(() => {
        window.showNotification("TranslaBot is ready to help!", "success", 3000)
      }, 2000)
    }
  }

  setupSmoothScrolling() {
    // Add smooth scrolling for anchor links
    const helpLinks = document.querySelectorAll('a[href^="#"]')
    
    helpLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const targetId = link.getAttribute('href')
        
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId)
          
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            })
          }
        }
      })
    })
  }
}

// Initialize help manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new HelpManager()
})
