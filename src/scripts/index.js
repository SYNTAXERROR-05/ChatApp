// Index Page Specific JavaScript

// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem("theme") || "light"
    this.init()
  }

  init() {
    this.applyTheme(this.currentTheme)
    this.setupThemeToggle()
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    this.currentTheme = theme
    localStorage.setItem("theme", theme)
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light"
    this.applyTheme(newTheme)

    // Add transition effect
    document.body.style.transition = "all 0.3s ease"
    setTimeout(() => {
      document.body.style.transition = ""
    }, 300)
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme())
    }
  }
}

// Navigation Manager
class NavigationManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupPageTransitions()
  }

  navigateTo(url) {
    // Add page transition effect
    document.body.classList.add("page-transition")

    setTimeout(() => {
      window.location.href = url
    }, 300)
  }

  setupPageTransitions() {
    // Add entrance animation to current page
    document.addEventListener("DOMContentLoaded", () => {
      document.body.classList.add("page-transition", "active")
    })
  }
}

// Animation Manager for Index Page
class AnimationManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupIntersectionObserver()
    this.initializeFloatingElements()
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      {
        threshold: 0.1,
      },
    )

    // Observe elements that should animate on scroll
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el)
    })
  }

  initializeFloatingElements() {
    // Add subtle animation to floating elements
    const floatingElements = document.querySelectorAll('.floating-icon')
    floatingElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.5}s`
    })
  }
}

// Session Manager (simplified for index page)
class SessionManager {
  constructor() {
    this.currentUser = null
    this.init()
  }

  init() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser")) || null
  }

  isAuthenticated() {
    return this.currentUser !== null
  }

  getCurrentUser() {
    return this.currentUser
  }
}

// Initialize managers for index page
const themeManager = new ThemeManager()
const navigationManager = new NavigationManager()
const animationManager = new AnimationManager()
const sessionManager = new SessionManager()

// Make managers globally available
window.themeManager = themeManager
window.navigationManager = navigationManager
window.sessionManager = sessionManager

// Global navigation function
function navigateTo(url) {
  navigationManager.navigateTo(url)
}

// Initialize page on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add any additional initialization code here
  console.log('TranslaTalk Index Page Loaded')
  
  // Check if user is already logged in and redirect if needed
  if (sessionManager.isAuthenticated()) {
    // Uncomment below to redirect logged-in users to chat
    // navigateTo('chat.html')
  }
})

// Add smooth scrolling behavior
document.addEventListener('click', function(e) {
  // Handle any additional click events if needed
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault()
    const targetId = e.target.getAttribute('href').substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
})

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
  // Add keyboard navigation if needed
  if (e.key === 'Escape') {
    // Handle escape key if needed
  }
})

// Performance optimization - preload important pages
function preloadPages() {
  const importantPages = ['login.html', 'about.html']
  importantPages.forEach(page => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = page
    document.head.appendChild(link)
  })
}

// Call preload after page is fully loaded
window.addEventListener('load', preloadPages)
