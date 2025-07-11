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

// Animation Manager
class AnimationManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupIntersectionObserver()
    this.setupHoverEffects()
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

  setupHoverEffects() {
    // Add ripple effect to buttons
    document.querySelectorAll(".btn-primary, .btn-secondary").forEach((button) => {
      button.addEventListener("click", this.createRipple)
    })
  }

  createRipple(event) {
    const button = event.currentTarget
    const ripple = document.createElement("span")
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"
    ripple.classList.add("ripple")

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }
}

// Notification Manager
class NotificationManager {
  constructor() {
    this.notifications = []
    this.container = this.createContainer()
  }

  createContainer() {
    const container = document.createElement("div")
    container.className = "notification-container"
    container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `
    document.body.appendChild(container)
    return container
  }

  show(message, type = "info", duration = 5000) {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.style.cssText = `
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 16px 20px;
            color: var(--text-primary);
            box-shadow: var(--shadow-medium);
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `

    const icon = this.getIcon(type)
    notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="${icon}" style="color: ${this.getColor(type)};"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: var(--text-muted); margin-left: auto;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `

    this.container.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        notification.style.transform = "translateX(100%)"
        setTimeout(() => notification.remove(), 300)
      }, duration)
    }

    return notification
  }

  getIcon(type) {
    const icons = {
      success: "fas fa-check-circle",
      error: "fas fa-exclamation-circle",
      warning: "fas fa-exclamation-triangle",
      info: "fas fa-info-circle",
    }
    return icons[type] || icons.info
  }

  getColor(type) {
    const colors = {
      success: "var(--success-color)",
      error: "var(--error-color)",
      warning: "var(--warning-color)",
      info: "var(--info-color)",
    }
    return colors[type] || colors.info
  }
}

// Add user session management
class SessionManager {
  constructor() {
    this.currentUser = null
    this.init()
  }

  init() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser")) || null
    this.checkAuthStatus()
  }

  login(userData) {
    this.currentUser = userData
    localStorage.setItem("currentUser", JSON.stringify(userData))
    return true
  }

  logout() {
    this.currentUser = null
    localStorage.removeItem("currentUser")
    localStorage.removeItem("chatMessages")
    window.location.href = "login.html"
  }

  isAuthenticated() {
    return this.currentUser !== null
  }

  getCurrentUser() {
    return this.currentUser
  }

  // checkAuthStatus() {
  //   const currentPage = window.location.pathname.split("/").pop()
  //   const publicPages = ["index.html", "login.html", "about.html", ""]

  //   if (!this.isAuthenticated() && !publicPages.includes(currentPage)) {
  //     window.location.href = "login.html"
  //   } else if (this.isAuthenticated() && (currentPage === "login.html" || currentPage === "")) {
  //     window.location.href = "chat.html"
  //   }
  // }
}

// Initialize managers
const themeManager = new ThemeManager()
const mobileMenuManager = new MobileMenuManager()
const navigationManager = new NavigationManager()
const animationManager = new AnimationManager()
const notificationManager = new NotificationManager()
const sessionManager = new SessionManager()

// Make session manager globally available
window.sessionManager = sessionManager

// Global functions
function navigateTo(url) {
  navigationManager.navigateTo(url)
}

function showNotification(message, type, duration) {
  return notificationManager.show(message, type, duration)
}

// Add ripple effect CSS
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`

const style = document.createElement("style")
style.textContent = rippleCSS
document.head.appendChild(style)
