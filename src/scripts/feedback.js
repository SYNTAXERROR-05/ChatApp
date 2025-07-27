// Feedback Page Specific JavaScript

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

// Star Rating Manager
class StarRatingManager {
  constructor() {
    this.rating = 0
    this.stars = document.querySelectorAll(".rating i")
    this.init()
  }

  init() {
    this.setupStarInteractions()
  }

  setupStarInteractions() {
    this.stars.forEach((star, index) => {
      // Click handler
      star.addEventListener("click", (e) => {
        this.setRating(index + 1)
        this.addRippleEffect(e, star)
      })

      // Hover handlers
      star.addEventListener("mouseenter", () => {
        this.highlightStars(index + 1)
      })

      star.addEventListener("mouseleave", () => {
        this.highlightStars(this.rating)
      })
    })
  }

  setRating(rating) {
    this.rating = rating
    this.highlightStars(rating)
  }

  highlightStars(count) {
    this.stars.forEach((star, index) => {
      if (index < count) {
        star.classList.remove("fa-regular")
        star.classList.add("fa-solid")
      } else {
        star.classList.remove("fa-solid")
        star.classList.add("fa-regular")
      }
    })
  }

  addRippleEffect(event, element) {
    const ripple = document.createElement('span')
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    ripple.classList.add('ripple')
    
    element.style.position = 'relative'
    element.appendChild(ripple)
    
    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  getRating() {
    return this.rating
  }

  resetRating() {
    this.rating = 0
    this.highlightStars(0)
  }
}

// Form Manager
class FeedbackFormManager {
  constructor() {
    this.form = document.querySelector(".feedback-form")
    this.toast = document.getElementById("toast")
    this.init()
  }

  init() {
    this.setupFormValidation()
    this.setupFormSubmission()
    this.setupFormAnimations()
  }

  setupFormValidation() {
    const inputs = this.form.querySelectorAll("input, textarea")
    
    inputs.forEach(input => {
      input.addEventListener("blur", () => this.validateField(input))
      input.addEventListener("input", () => this.clearFieldError(input))
    })
  }

  validateField(field) {
    const value = field.value.trim()
    const fieldType = field.type || "text"
    
    let isValid = true
    let errorMessage = ""

    // Check if required field is empty
    if (field.hasAttribute("required") && !value) {
      isValid = false
      errorMessage = "This field is required"
    }

    // Email validation
    if (fieldType === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        isValid = false
        errorMessage = "Please enter a valid email address"
      }
    }

    // Name validation (no numbers)
    if (field.id === "name" && value) {
      const nameRegex = /^[a-zA-Z\s]+$/
      if (!nameRegex.test(value)) {
        isValid = false
        errorMessage = "Name should only contain letters"
      }
    }

    this.showFieldError(field, isValid, errorMessage)
    return isValid
  }

  showFieldError(field, isValid, message) {
    // Remove existing error
    this.clearFieldError(field)

    if (!isValid) {
      field.style.borderColor = "var(--error-color)"
      field.style.boxShadow = "0 0 0 3px rgba(245, 101, 101, 0.1)"
      
      // Add error message
      const errorElement = document.createElement("div")
      errorElement.className = "field-error"
      errorElement.textContent = message
      errorElement.style.cssText = `
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        font-weight: 500;
      `
      
      field.parentNode.appendChild(errorElement)
    }
  }

  clearFieldError(field) {
    field.style.borderColor = ""
    field.style.boxShadow = ""
    
    const errorElement = field.parentNode.querySelector(".field-error")
    if (errorElement) {
      errorElement.remove()
    }
  }

  setupFormSubmission() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e))
  }

  handleSubmit(e) {
    e.preventDefault()
    
    // Validate all fields
    const inputs = this.form.querySelectorAll("input, textarea")
    let isFormValid = true
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false
      }
    })

    // Check if rating is provided
    const starRating = window.starRatingManager.getRating()
    if (starRating === 0) {
      isFormValid = false
      this.showToast("Please provide a rating", "error")
      return
    }

    if (isFormValid) {
      this.submitForm()
    } else {
      this.showToast("Please correct the errors in the form", "error")
    }
  }

  async submitForm() {
    // Show loading state
    const submitButton = this.form.querySelector('button[type="submit"]')
    const originalText = submitButton.innerHTML
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...'
    submitButton.disabled = true

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success
      this.showToast("✅ Thanks for your feedback!", "success")
      this.resetForm()
      
    } catch (error) {
      this.showToast("❌ Something went wrong. Please try again.", "error")
    } finally {
      // Reset button
      submitButton.innerHTML = originalText
      submitButton.disabled = false
    }
  }

  resetForm() {
    this.form.reset()
    window.starRatingManager.resetRating()
    
    // Clear any remaining errors
    const inputs = this.form.querySelectorAll("input, textarea")
    inputs.forEach(input => this.clearFieldError(input))
  }

  showToast(message, type = "success") {
    if (this.toast) {
      this.toast.textContent = message
      this.toast.className = `toast ${type}`
      this.toast.style.display = "block"
      this.toast.classList.add("show")
      
      setTimeout(() => {
        this.toast.classList.remove("show")
        setTimeout(() => {
          this.toast.style.display = "none"
        }, 300)
      }, 3000)
    }
  }

  setupFormAnimations() {
    const inputs = this.form.querySelectorAll("input, textarea")
    
    inputs.forEach(input => {
      input.addEventListener("focus", () => {
        input.style.transform = "translateY(-2px)"
      })
      
      input.addEventListener("blur", () => {
        input.style.transform = ""
      })
    })
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupFloatingAnimations()
    this.setupScrollAnimations()
    this.setupHoverEffects()
  }

  setupFloatingAnimations() {
    const floatingIcons = document.querySelectorAll(".floating-icon")
    
    floatingIcons.forEach((icon, index) => {
      // Set custom animation delay
      icon.style.animationDelay = `${index}s`
      
      // Add random movement
      setInterval(() => {
        const randomX = Math.random() * 20 - 10
        const randomY = Math.random() * 20 - 10
        icon.style.transform = `translate(${randomX}px, ${randomY}px)`
      }, 3000 + (index * 1000))
    })
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    // Observe sections
    const sections = document.querySelectorAll(".feedback-form-section, .page-footer")
    sections.forEach(section => {
      section.style.opacity = "0"
      section.style.transform = "translateY(30px)"
      section.style.transition = "all 0.6s ease"
      observer.observe(section)
    })
  }

  setupHoverEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll(".btn-primary, .btn-secondary")
    
    buttons.forEach(button => {
      button.addEventListener("click", (e) => {
        this.addRippleEffect(e, button)
      })
    })
  }

  addRippleEffect(event, element) {
    const ripple = document.createElement('span')
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    ripple.style.width = ripple.style.height = size + 'px'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    ripple.classList.add('ripple')
    
    element.style.position = 'relative'
    element.appendChild(ripple)
    
    setTimeout(() => {
      ripple.remove()
    }, 600)
  }
}

// Navigation Manager
class NavigationManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupPageTransitions()
    this.setupNavigationEffects()
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

  setupNavigationEffects() {
    const navLinks = document.querySelectorAll(".nav-link")
    
    navLinks.forEach(link => {
      link.addEventListener("mouseenter", () => {
        link.style.transform = "translateY(-2px) scale(1.05)"
      })
      
      link.addEventListener("mouseleave", () => {
        link.style.transform = ""
      })
    })
  }
}

// Performance Manager
class PerformanceManager {
  constructor() {
    this.init()
  }

  init() {
    this.optimizeImages()
    this.setupLazyLoading()
    this.preloadCriticalResources()
  }

  optimizeImages() {
    const images = document.querySelectorAll("img")
    images.forEach(img => {
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", "lazy")
      }
    })
  }

  setupLazyLoading() {
    if ("IntersectionObserver" in window) {
      const lazyElements = document.querySelectorAll("[data-lazy]")
      const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target
            element.classList.add("loaded")
            lazyObserver.unobserve(element)
          }
        })
      })

      lazyElements.forEach(element => lazyObserver.observe(element))
    }
  }

  preloadCriticalResources() {
    // Preload critical fonts
    const fontLinks = [
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
    ]

    fontLinks.forEach(href => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "style"
      link.href = href
      document.head.appendChild(link)
    })
  }
}

// Main Application Class
class FeedbackPageManager {
  constructor() {
    this.themeManager = new ThemeManager()
    this.mobileMenuManager = new MobileMenuManager()
    this.starRatingManager = new StarRatingManager()
    this.formManager = new FeedbackFormManager()
    this.animationManager = new AnimationManager()
    this.navigationManager = new NavigationManager()
    this.performanceManager = new PerformanceManager()

    // Make star rating manager globally available
    window.starRatingManager = this.starRatingManager
    
    this.init()
  }

  init() {
    console.log("🎯 Feedback Page initialized successfully!")
    this.setupGlobalEventListeners()
    this.handlePageLoad()
  }

  setupGlobalEventListeners() {
    // Global keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Escape key to close mobile menu
      if (e.key === "Escape") {
        this.mobileMenuManager.closeMenu()
      }
      
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        const firstInput = document.querySelector("input")
        if (firstInput) firstInput.focus()
      }
    })

    // Handle page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // Page is hidden
        console.log("📱 Page hidden - pausing animations")
      } else {
        // Page is visible
        console.log("👀 Page visible - resuming animations")
      }
    })
  }

  handlePageLoad() {
    // Set up smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth"
    
    // Initialize page animations
    setTimeout(() => {
      document.body.classList.add("loaded")
    }, 100)
  }
}

// Global utility functions
window.handleSubmit = function(e) {
  // This function is called from the HTML form
  e.preventDefault()
  if (window.feedbackPageManager && window.feedbackPageManager.formManager) {
    window.feedbackPageManager.formManager.handleSubmit(e)
  }
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.feedbackPageManager = new FeedbackPageManager()
})

// Handle page unload
window.addEventListener("beforeunload", () => {
  console.log("👋 Feedback Page unloading...")
})
