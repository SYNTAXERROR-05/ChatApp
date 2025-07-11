// Profile page functionality
class ProfileManager {
  constructor() {
    this.currentUser = window.sessionManager?.getCurrentUser() || null
    this.init()
  }

  init() {
    this.loadUserData()
    this.setupTabs()
    this.setupForms()
    this.setupToggles()
    this.setupSliders()
  }

  loadUserData() {
    if (this.currentUser) {
      // Load user data into form fields
      document.getElementById("profileName").textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`
      document.getElementById("profileEmail").textContent = this.currentUser.email
      document.getElementById("profileImage").src = this.currentUser.avatar

      // Load form fields
      document.getElementById("firstName").value = this.currentUser.firstName
      document.getElementById("lastName").value = this.currentUser.lastName
      document.getElementById("email").value = this.currentUser.email
    }
  }

  setupTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn")
    const tabContents = document.querySelectorAll(".tab-content")

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab")

        // Remove active class from all tabs and contents
        tabBtns.forEach((b) => b.classList.remove("active"))
        tabContents.forEach((c) => c.classList.remove("active"))

        // Add active class to clicked tab and corresponding content
        btn.classList.add("active")
        document.getElementById(targetTab).classList.add("active")
      })
    })
  }

  setupForms() {
    const personalForm = document.getElementById("personalForm")

    personalForm.addEventListener("submit", (e) => {
      e.preventDefault()
      this.savePersonalInfo()
    })

    // Setup other form handlers
    window.resetForm = () => {
      personalForm.reset()
      this.loadUserData()
      window.showNotification("Form reset to original values", "info", 3000)
    }

    window.changeAvatar = () => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"

      input.onchange = (e) => {
        const file = e.target.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            document.getElementById("profileImage").src = e.target.result
            window.showNotification("Avatar updated!", "success", 3000)
          }
          reader.readAsDataURL(file)
        }
      }

      input.click()
    }

    window.showPasswordForm = () => {
      window.showNotification("Password change form would open here", "info", 3000)
    }

    window.showActiveSessions = () => {
      window.showNotification("Active sessions panel would open here", "info", 3000)
    }
  }

  savePersonalInfo() {
    const formData = new FormData(document.getElementById("personalForm"))

    // Simulate saving
    window.showNotification("Saving changes...", "info", 2000)

    setTimeout(() => {
      // Update current user data
      if (this.currentUser) {
        this.currentUser.firstName = formData.get("firstName")
        this.currentUser.lastName = formData.get("lastName")
        this.currentUser.email = formData.get("email")

        // Update session
        window.sessionManager?.login(this.currentUser)

        // Update display
        document.getElementById("profileName").textContent =
          `${this.currentUser.firstName} ${this.currentUser.lastName}`
        document.getElementById("profileEmail").textContent = this.currentUser.email
      }

      window.showNotification("Profile updated successfully!", "success", 3000)
    }, 2000)
  }

  setupToggles() {
    const toggles = document.querySelectorAll(".toggle-switch input")

    toggles.forEach((toggle) => {
      toggle.addEventListener("change", () => {
        const setting = toggle.id
        const enabled = toggle.checked

        window.showNotification(`${setting} ${enabled ? "enabled" : "disabled"}`, "info", 2000)
      })
    })
  }

  setupSliders() {
    const sliders = document.querySelectorAll('input[type="range"]')

    sliders.forEach((slider) => {
      const updateValue = () => {
        const valueSpan = slider.parentElement.querySelector(".slider-value")
        if (valueSpan) {
          valueSpan.textContent = slider.value + "px"
        }
      }

      slider.addEventListener("input", updateValue)
      updateValue() // Set initial value
    })
  }
}

// Initialize profile manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ProfileManager()
})
