// About Page Specific JavaScript

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

// Mobile Menu Manager
class MobileMenuManager {
  constructor() {
    this.isMenuOpen = false
    this.init()
  }

  init() {
    this.setupMobileMenuToggle()
    this.setupOutsideClickHandler()
    this.setupResizeHandler()
  }

  setupMobileMenuToggle() {
    const mobileMenuToggle = document.getElementById("mobileMenuToggle")
    const headerNav = document.querySelector(".header-nav")
    
    if (mobileMenuToggle && headerNav) {
      mobileMenuToggle.addEventListener("click", () => {
        this.toggleMenu()
      })
    }
  }

  toggleMenu() {
    const headerNav = document.querySelector(".header-nav")
    const mobileMenuToggle = document.getElementById("mobileMenuToggle")
    
    if (headerNav && mobileMenuToggle) {
      this.isMenuOpen = !this.isMenuOpen
      headerNav.classList.toggle("active", this.isMenuOpen)
      
      // Update toggle button icon
      const icon = mobileMenuToggle.querySelector("i")
      if (icon) {
        icon.className = this.isMenuOpen ? "fas fa-times" : "fas fa-bars"
      }
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = this.isMenuOpen ? "hidden" : ""
    }
  }

  closeMenu() {
    const headerNav = document.querySelector(".header-nav")
    const mobileMenuToggle = document.getElementById("mobileMenuToggle")
    
    if (headerNav && mobileMenuToggle && this.isMenuOpen) {
      this.isMenuOpen = false
      headerNav.classList.remove("active")
      
      // Reset toggle button icon
      const icon = mobileMenuToggle.querySelector("i")
      if (icon) {
        icon.className = "fas fa-bars"
      }
      
      // Restore body scroll
      document.body.style.overflow = ""
    }
  }

  setupOutsideClickHandler() {
    document.addEventListener("click", (e) => {
      const headerNav = document.querySelector(".header-nav")
      const mobileMenuToggle = document.getElementById("mobileMenuToggle")
      
      if (this.isMenuOpen && 
          headerNav && mobileMenuToggle &&
          !headerNav.contains(e.target) && 
          !mobileMenuToggle.contains(e.target)) {
        this.closeMenu()
      }
    })
  }

  setupResizeHandler() {
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMenu()
      }
    })
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

// Animation Manager for About Page
class AnimationManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupIntersectionObserver()
    this.initializeTimelineAnimations()
    this.initializeFeatureAnimations()
    this.initializeTeamAnimations()
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
            
            // Add staggered animation for timeline items
            if (entry.target.classList.contains("timeline-item")) {
              const timelineItems = document.querySelectorAll(".timeline-item")
              timelineItems.forEach((item, index) => {
                setTimeout(() => {
                  item.style.opacity = "1"
                  item.style.transform = "translateY(0)"
                }, index * 200)
              })
            }
          }
        })
      },
      {
        threshold: 0.1,
      },
    )

    // Observe elements that should animate on scroll
    document.querySelectorAll(".timeline-item, .feature-card, .team-member").forEach((el) => {
      observer.observe(el)
    })
  }

  initializeTimelineAnimations() {
    const timelineItems = document.querySelectorAll(".timeline-item")
    
    timelineItems.forEach((item, index) => {
      // Set initial state
      item.style.opacity = "0"
      item.style.transform = "translateY(30px)"
      item.style.transition = "all 0.6s ease"
      
      // Add hover effects
      item.addEventListener("mouseenter", () => {
        item.style.transform = "translateY(-10px) scale(1.02)"
      })
      
      item.addEventListener("mouseleave", () => {
        item.style.transform = "translateY(0) scale(1)"
      })
    })
  }

  initializeFeatureAnimations() {
    const featureCards = document.querySelectorAll(".feature-card")
    
    featureCards.forEach((card, index) => {
      // Add staggered entrance animation
      card.style.animationDelay = `${index * 0.1}s`
      
      // Add icon hover animation
      const icon = card.querySelector(".feature-icon")
      if (icon) {
        card.addEventListener("mouseenter", () => {
          icon.style.transform = "scale(1.1) rotate(5deg)"
        })
        
        card.addEventListener("mouseleave", () => {
          icon.style.transform = "scale(1) rotate(0deg)"
        })
      }
    })
  }

  initializeTeamAnimations() {
    const teamMembers = document.querySelectorAll(".team-member")
    
    teamMembers.forEach((member, index) => {
      // Add staggered entrance animation
      member.style.animationDelay = `${index * 0.15}s`
      
      // Add social links animation
      const socialLinks = member.querySelectorAll(".social-links a")
      socialLinks.forEach((link, linkIndex) => {
        link.addEventListener("mouseenter", () => {
          link.style.transform = "scale(1.3) rotate(10deg)"
        })
        
        link.addEventListener("mouseleave", () => {
          link.style.transform = "scale(1) rotate(0deg)"
        })
      })
    })
  }
}

// Session Manager (simplified for about page)
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

// Scroll Manager for About Page
class ScrollManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupSmoothScrolling()
    this.setupScrollIndicator()
    this.setupParallaxEffects()
  }

  setupSmoothScrolling() {
    // Smooth scroll for anchor links
    document.addEventListener('click', (e) => {
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
  }

  setupScrollIndicator() {
    // Create scroll progress indicator
    const progressBar = document.createElement('div')
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: 9999;
      transition: width 0.3s ease;
    `
    document.body.appendChild(progressBar)

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.body.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      progressBar.style.width = scrollPercent + '%'
    })
  }

  setupParallaxEffects() {
    const floatingIcons = document.querySelectorAll('.floating-icon')
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset
      
      floatingIcons.forEach((icon, index) => {
        const speed = 0.5 + (index * 0.1)
        const yPos = -(scrollTop * speed)
        icon.style.transform = `translateY(${yPos}px) rotate(${scrollTop * 0.1}deg)`
      })
    })
  }
}

// Initialize managers for about page
const themeManager = new ThemeManager()
const mobileMenuManager = new MobileMenuManager()
const navigationManager = new NavigationManager()
const animationManager = new AnimationManager()
const sessionManager = new SessionManager()
const scrollManager = new ScrollManager()

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
  console.log('TranslaTalk About Page Loaded')
  
  // Initialize floating elements animation delays
  const floatingElements = document.querySelectorAll('.floating-icon')
  floatingElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.5}s`
  })

  // Add smooth entrance animations
  const sections = document.querySelectorAll('.hero-section, .timeline-section, .features-section, .team-section, .cta-section')
  sections.forEach((section, index) => {
    section.style.opacity = '0'
    section.style.transform = 'translateY(50px)'
    section.style.transition = 'all 0.8s ease'
    
    setTimeout(() => {
      section.style.opacity = '1'
      section.style.transform = 'translateY(0)'
    }, index * 200)
  })
})

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
  // ESC key to close mobile menu
  if (e.key === 'Escape' && mobileMenuManager.isMenuOpen) {
    mobileMenuManager.closeMenu()
  }
  
  // Arrow keys for timeline navigation
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const timelineItems = document.querySelectorAll('.timeline-item')
    let currentIndex = -1
    
    timelineItems.forEach((item, index) => {
      if (item.classList.contains('focused')) {
        currentIndex = index
      }
    })
    
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      timelineItems[currentIndex].classList.remove('focused')
      timelineItems[currentIndex - 1].classList.add('focused')
      timelineItems[currentIndex - 1].scrollIntoView({ behavior: 'smooth' })
    } else if (e.key === 'ArrowRight' && currentIndex < timelineItems.length - 1) {
      timelineItems[currentIndex].classList.remove('focused')
      timelineItems[currentIndex + 1].classList.add('focused')
      timelineItems[currentIndex + 1].scrollIntoView({ behavior: 'smooth' })
    }
  }
})

// Performance optimization - preload important pages
function preloadPages() {
  const importantPages = ['index.html', 'login.html', 'help.html', 'feedback.html']
  importantPages.forEach(page => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = page
    document.head.appendChild(link)
  })
}

// Team Grid Layout Manager
function setupTeamGridLayout() {
  const teamGrid = document.querySelector('.team-grid')
  const teamMembers = document.querySelectorAll('.team-member')
  
  if (teamGrid && teamMembers.length > 0) {
    const memberCount = teamMembers.length
    
    // Remove existing layout classes
    teamGrid.classList.remove('three-members', 'six-members')
    
    // Apply appropriate layout class based on member count
    if (memberCount === 3) {
      teamGrid.classList.add('three-members')
    } else if (memberCount === 6) {
      teamGrid.classList.add('six-members')
    }
    // For 4 members, the default 2x2 grid is used (no additional class needed)
    
    console.log(`Team grid configured for ${memberCount} members`)
  }
}

// Enhanced team member interactions
function initializeTeamInteractions() {
  const teamMembers = document.querySelectorAll('.team-member')
  
  teamMembers.forEach(member => {
    member.addEventListener('click', () => {
      // Add subtle click effect
      member.style.transform = 'scale(0.98)'
      setTimeout(() => {
        member.style.transform = 'scale(1)'
      }, 150)
    })
  })
}

// Enhanced feature card interactions
function initializeFeatureInteractions() {
  const featureCards = document.querySelectorAll('.feature-card')
  
  featureCards.forEach(card => {
    let isHovered = false
    
    card.addEventListener('mouseenter', () => {
      isHovered = true
      card.style.background = 'var(--bg-glass-hover)'
    })
    
    card.addEventListener('mouseleave', () => {
      isHovered = false
      card.style.background = 'var(--bg-glass)'
    })
    
    card.addEventListener('click', () => {
      if (!isHovered) return
      
      // Add ripple effect
      const ripple = document.createElement('span')
      const rect = card.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = event.clientX - rect.left - size / 2
      const y = event.clientY - rect.top - size / 2
      
      ripple.style.width = ripple.style.height = size + 'px'
      ripple.style.left = x + 'px'
      ripple.style.top = y + 'px'
      ripple.classList.add('ripple')
      
      card.appendChild(ripple)
      
      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
}

// Call initialization functions after page load
window.addEventListener('load', () => {
  setupTeamGridLayout()
  preloadPages()
  initializeTeamInteractions()
  initializeFeatureInteractions()
})
