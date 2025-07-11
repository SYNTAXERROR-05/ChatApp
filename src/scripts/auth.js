class AuthManager {
  constructor() {
    this.currentForm = "login"
    this.init()
  }

  init() {
    this.setupFormToggle()
    this.setupFormValidation()
    this.setupPasswordToggle()
    this.setupSocialAuth()
    this.setupFormSubmission()
  }

  setupFormToggle() {
    const toggleBtns = document.querySelectorAll(".toggle-btn")
    const forms = document.querySelectorAll(".auth-form")

    toggleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const formType = btn.getAttribute("data-form")
        this.switchForm(formType)
      })
    })
  }

  switchForm(formType) {
    const toggleBtns = document.querySelectorAll(".toggle-btn")
    const forms = document.querySelectorAll(".auth-form")
    const indicator = document.querySelector(".toggle-indicator")

    // Update toggle buttons
    toggleBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-form") === formType)
    })

    // Update forms
    forms.forEach((form) => {
      form.classList.toggle("active", form.id === formType + "Form")
    })

    // Move the toggle indicator
    if (indicator) {
      if (formType === "signup") {
        indicator.style.transform = "translateX(100%)"
      } else {
        indicator.style.transform = "translateX(0%)"
      }
    }

    // Update sidebar content based on form type
    this.updateSidebarContent(formType)

    this.currentForm = formType
  }

  updateSidebarContent(formType) {
    const welcomeTitle = document.getElementById("welcomeTitle")
    const welcomeDescription = document.getElementById("welcomeDescription")
    const featuresList = document.getElementById("featuresList")

    if (formType === "signup") {
      // Signup content
      welcomeTitle.textContent = "Welcome to the Future"
      welcomeDescription.textContent = "Experience next-generation communication with AI-powered features, end-to-end encryption, and seamless collaboration."
      
      featuresList.innerHTML = `
        <div class="feature-item">
          <i class="fas fa-shield-alt"></i>
          <span>End-to-End Encryption</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-robot"></i>
          <span>AI Assistant</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-globe"></i>
          <span>Real-time Translation</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-video"></i>
          <span>HD Video Calls</span>
        </div>
      `
    } else {
      // Login content
      welcomeTitle.textContent = "Welcome Back"
      welcomeDescription.textContent = "Sign in to continue your conversations and stay connected with your team."
      
      featuresList.innerHTML = `
        <div class="feature-item">
          <i class="fas fa-shield-alt"></i>
          <span>Secure Login</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-clock"></i>
          <span>Quick Access</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-users"></i>
          <span>Team Collaboration</span>
        </div>
        <div class="feature-item">
          <i class="fas fa-mobile-alt"></i>
          <span>Cross-Platform Access</span>
        </div>
      `
    }

    // Re-apply feature item animations
    const featureItems = featuresList.querySelectorAll('.feature-item')
    featureItems.forEach((item, index) => {
      item.style.setProperty('--delay', index + 3)
      item.style.animation = 'none'
      setTimeout(() => {
        item.style.animation = 'fadeInLeft 0.6s ease-out'
        item.style.animationDelay = `calc(${index + 3} * 0.1s)`
      }, 10)
    })
  }

  setupFormValidation() {
    const inputs = document.querySelectorAll(".input-group input")

    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input))
      input.addEventListener("input", () => this.clearFieldError(input))
    })
  }

  validateField(input) {
    const inputGroup = input.closest(".input-group")
    const value = input.value.trim()
    let isValid = true
    let errorMessage = ""

    // Remove existing error
    this.clearFieldError(input)

    // Email validation
    if (input.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        isValid = false
        errorMessage = "Please enter a valid email address"
      }
    }

    // Password validation
    if (input.type === "password" && value && input.id.includes("signup")) {
      if (value.length < 8) {
        isValid = false
        errorMessage = "Password must be at least 8 characters long"
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        isValid = false
        errorMessage = "Password must contain uppercase, lowercase, and number"
      }
    }

    // Confirm password validation
    if (input.id === "confirmPassword" && value) {
      const password = document.getElementById("signupPassword").value
      if (value !== password) {
        isValid = false
        errorMessage = "Passwords do not match"
      }
    }

    // Required field validation
    if (input.hasAttribute("required") && !value) {
      isValid = false
      errorMessage = "This field is required"
    }

    if (!isValid) {
      this.showFieldError(input, errorMessage)
    }

    return isValid
  }

  showFieldError(input, message) {
    const inputGroup = input.closest(".input-group")

    // Add error class
    inputGroup.classList.add("error")

    // Create error message element
    const errorElement = document.createElement("div")
    errorElement.className = "field-error"
    errorElement.textContent = message
    errorElement.style.cssText = `
            color: var(--error-color);
            font-size: 0.8rem;
            margin-top: 0.5rem;
            animation: fadeInUp 0.3s ease;
        `

    inputGroup.appendChild(errorElement)
  }

  clearFieldError(input) {
    const inputGroup = input.closest(".input-group")
    const errorElement = inputGroup.querySelector(".field-error")

    inputGroup.classList.remove("error")
    if (errorElement) {
      errorElement.remove()
    }
  }

  setupPasswordToggle() {
    const passwordToggles = document.querySelectorAll(".password-toggle")

    passwordToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        // Find the input field in the same input-group
        const inputGroup = toggle.closest(".input-group")
        const input = inputGroup.querySelector("input[type='password'], input[type='text']")
        const icon = toggle.querySelector("i")

        if (input.type === "password") {
          input.type = "text"
          icon.className = "fas fa-eye-slash"
        } else {
          input.type = "password"
          icon.className = "fas fa-eye"
        }
      })
    })
  }

  setupSocialAuth() {
    const socialBtns = document.querySelectorAll(".social-btn")

    socialBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const provider = btn.classList.contains("google")
          ? "Google"
          : btn.classList.contains("facebook")
            ? "Facebook"
            : "LinkedIn"

        this.handleSocialAuth(provider)
      })
    })
  }

  handleSocialAuth(provider) {
    window.showNotification(`Redirecting to ${provider} authentication...`, "info", 3000)

    // Simulate social auth redirect
    setTimeout(() => {
      window.showNotification(`${provider} authentication successful!`, "success", 3000)
      setTimeout(() => {
        window.navigateTo("chat.html")
      }, 1000)
    }, 2000)
  }

  setupFormSubmission() {
    const forms = document.querySelectorAll(".auth-form")

    forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault()
        console.log("Form submitted:", form.id) // Debug log
        this.handleFormSubmission(form)
      })
    })
  }

  handleFormSubmission(form) {
    console.log("Handling form submission for:", form.id) // Debug log
    
    const submitBtn = form.querySelector(".btn-auth")
    const inputs = form.querySelectorAll("input[required]")
    let isFormValid = true

    // Validate all required fields
    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isFormValid = false
      }
    })

    if (!isFormValid) {
      if (window.showNotification) {
        window.showNotification("Please fix the errors in the form", "error", 5000)
      } else {
        alert("Please fix the errors in the form")
      }
      return
    }

    // Show loading state
    submitBtn.classList.add("loading")
    submitBtn.disabled = true

    // Get form data
    const email = form.querySelector('input[type="email"]').value
    const password = form.querySelector('input[type="password"]').value

    console.log("Form data:", { email, currentForm: this.currentForm }) // Debug log

    // Simulate API call with real validation
    setTimeout(() => {
      submitBtn.classList.remove("loading")
      submitBtn.disabled = false

      if (this.currentForm === "login") {
        // Check credentials (in real app, this would be server-side)
        const storedUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
        const user = storedUsers.find((u) => u.email === email && u.password === password)

        if (user) {
          if (window.sessionManager) {
            window.sessionManager.login({
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              avatar: user.avatar || "/placeholder.svg?height=40&width=40",
            })
          }
          
          if (window.showNotification) {
            window.showNotification("Login successful! Welcome back!", "success", 3000)
          }
          
          setTimeout(() => {
            window.location.href = "chat.html"
          }, 1000)
        } else {
          if (window.showNotification) {
            window.showNotification("Invalid email or password", "error", 5000)
          } else {
            alert("Invalid email or password")
          }
        }
      } else {
        // Registration
        const firstName = form.querySelector("#firstName").value
        const lastName = form.querySelector("#lastName").value

        // Check if user already exists
        const storedUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
        const existingUser = storedUsers.find((u) => u.email === email)

        if (existingUser) {
          if (window.showNotification) {
            window.showNotification("User with this email already exists", "error", 5000)
          } else {
            alert("User with this email already exists")
          }
          return
        }

        // Create new user
        const newUser = {
          id: Date.now(),
          email,
          password,
          firstName,
          lastName,
          avatar: "/placeholder.svg?height=40&width=40",
          createdAt: new Date().toISOString(),
        }

        storedUsers.push(newUser)
        localStorage.setItem("registeredUsers", JSON.stringify(storedUsers))

        // Auto login after registration
        if (window.sessionManager) {
          window.sessionManager.login({
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            avatar: newUser.avatar,
          })
        }

        if (window.showNotification) {
          window.showNotification("Account created successfully! Welcome!", "success", 3000)
        }
        
        setTimeout(() => {
          window.location.href = "chat.html"
        }, 1000)
      }
    }, 2000)
  }
}

// Initialize auth manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AuthManager()
})
