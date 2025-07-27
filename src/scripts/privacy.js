// Privacy Page Specific JavaScript

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

// Initialize managers for privacy page
const themeManager = new ThemeManager()
const mobileMenuManager = new MobileMenuManager()

// Make managers globally available
window.themeManager = themeManager

// Initialize page on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('TranslaTalk Privacy Page Loaded')
})

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
  // ESC key to close mobile menu
  if (e.key === 'Escape' && mobileMenuManager.isMenuOpen) {
    mobileMenuManager.closeMenu()
  }
})
