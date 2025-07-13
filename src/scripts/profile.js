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
    this.initializeTheme()
    this.initializeHeaderProfile()
  }

  initializeHeaderProfile() {
    // Initialize header profile information
    const headerProfileName = document.getElementById("headerProfileName")
    const headerProfileImage = document.getElementById("headerProfileImage")
    
    if (this.currentUser) {
      if (headerProfileName) {
        headerProfileName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`
      }
      if (headerProfileImage) {
        headerProfileImage.src = this.currentUser.avatar
      }
    } else {
      if (headerProfileName) {
        headerProfileName.textContent = "John Doe"
      }
      if (headerProfileImage) {
        headerProfileImage.src = "/src/images/dev.png"
      }
    }
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'auto'
    this.setTheme(savedTheme)
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

        // Handle auto-translate toggle
        if (setting === 'autoTranslate') {
          this.handleAutoTranslate(enabled)
        }

        window.showNotification(`${setting} ${enabled ? "enabled" : "disabled"}`, "info", 2000)
      })
    })

    // Handle theme selector
    const themeSelect = document.getElementById('themeSelect')
    if (themeSelect) {
      // Set initial theme value
      const currentTheme = localStorage.getItem('theme') || 'auto'
      themeSelect.value = currentTheme

      themeSelect.addEventListener('change', (e) => {
        const selectedTheme = e.target.value
        this.setTheme(selectedTheme)
      })
    }

    // Handle translate language selector
    const translateLanguageSelect = document.getElementById('translateLanguage')
    if (translateLanguageSelect) {
      // Set initial language
      const savedLanguage = localStorage.getItem('translateLanguage') || 'en'
      translateLanguageSelect.value = savedLanguage

      translateLanguageSelect.addEventListener('change', (e) => {
        const selectedLanguage = e.target.value
        this.setTranslateLanguage(selectedLanguage)
      })
    }

    // Initialize auto-translate state
    this.initializeAutoTranslate()
  }

  handleAutoTranslate(enabled) {
    const languageSelector = document.getElementById('translateLanguageSelector')
    
    if (enabled) {
      languageSelector.classList.add('show')
      // Save auto-translate state
      localStorage.setItem('autoTranslate', 'true')
      
      // Initialize translation service
      this.initializeTranslationService()
    } else {
      languageSelector.classList.remove('show')
      localStorage.setItem('autoTranslate', 'false')
      
      // Disable translation service
      this.disableTranslationService()
    }
  }

  initializeAutoTranslate() {
    const autoTranslateToggle = document.getElementById('autoTranslate')
    const languageSelector = document.getElementById('translateLanguageSelector')
    
    if (autoTranslateToggle && languageSelector) {
      const isEnabled = localStorage.getItem('autoTranslate') === 'true'
      autoTranslateToggle.checked = isEnabled
      
      if (isEnabled) {
        languageSelector.classList.add('show')
        this.initializeTranslationService()
      }
    }
  }

  setTranslateLanguage(language) {
    localStorage.setItem('translateLanguage', language)
    
    // Get language name for display
    const select = document.getElementById('translateLanguage')
    const selectedOption = select.querySelector(`option[value="${language}"]`)
    const languageName = selectedOption ? selectedOption.textContent : language
    
    window.showNotification(`Translation language set to ${languageName}`, "success", 2000)
    
    // Update translation service with new language
    this.updateTranslationService(language)
  }

  initializeTranslationService() {
    const targetLanguage = localStorage.getItem('translateLanguage') || 'en'
    
    // Create translation service object
    window.translationService = {
      enabled: true,
      targetLanguage: targetLanguage,
      
      // Simulate translation function
      translateMessage: async (message, fromLanguage = 'auto') => {
        // In a real app, this would call a translation API
        const translatedMessage = `[${targetLanguage.toUpperCase()}] ${message}`
        return translatedMessage
      },
      
      // Detect language function
      detectLanguage: async (text) => {
        // In a real app, this would detect the language
        return 'en' // Default to English
      }
    }
    
    console.log('Translation service initialized for language:', targetLanguage)
    window.showNotification(`Translation service enabled for ${this.getLanguageName(targetLanguage)}`, "success", 2000)
  }

  updateTranslationService(language) {
    if (window.translationService) {
      window.translationService.targetLanguage = language
      console.log('Translation service updated to language:', language)
    }
  }

  disableTranslationService() {
    if (window.translationService) {
      window.translationService.enabled = false
      console.log('Translation service disabled')
    }
  }

  getLanguageName(code) {
    const languages = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'ja': 'Japanese',
      'ko': 'Korean',
      'zh': 'Chinese (Simplified)',
      'ar': 'Arabic',
      'hi': 'Hindi',
      'tr': 'Turkish',
      'pl': 'Polish',
      'nl': 'Dutch',
      'sv': 'Swedish',
      'da': 'Danish',
      'no': 'Norwegian',
      'fi': 'Finnish',
      'cs': 'Czech',
      'hu': 'Hungarian',
      'ro': 'Romanian',
      'bg': 'Bulgarian',
      'hr': 'Croatian',
      'sk': 'Slovak',
      'sl': 'Slovenian',
      'et': 'Estonian',
      'lv': 'Latvian',
      'lt': 'Lithuanian',
      'mt': 'Maltese',
      'el': 'Greek',
      'cy': 'Welsh',
      'ga': 'Irish',
      'is': 'Icelandic',
      'mk': 'Macedonian',
      'sq': 'Albanian',
      'sr': 'Serbian',
      'bs': 'Bosnian',
      'me': 'Montenegrin',
      'uk': 'Ukrainian',
      'be': 'Belarusian',
      'ka': 'Georgian',
      'hy': 'Armenian',
      'az': 'Azerbaijani',
      'kk': 'Kazakh',
      'ky': 'Kyrgyz',
      'uz': 'Uzbek',
      'tg': 'Tajik',
      'mn': 'Mongolian',
      'th': 'Thai',
      'vi': 'Vietnamese',
      'id': 'Indonesian',
      'ms': 'Malay',
      'tl': 'Filipino',
      'sw': 'Swahili',
      'am': 'Amharic',
      'he': 'Hebrew',
      'fa': 'Persian',
      'ur': 'Urdu',
      'bn': 'Bengali',
      'ta': 'Tamil',
      'te': 'Telugu',
      'kn': 'Kannada',
      'ml': 'Malayalam',
      'gu': 'Gujarati',
      'pa': 'Punjabi',
      'or': 'Odia',
      'as': 'Assamese',
      'mr': 'Marathi',
      'ne': 'Nepali',
      'si': 'Sinhala',
      'my': 'Myanmar',
      'km': 'Khmer',
      'lo': 'Lao'
    }
    
    return languages[code] || code.toUpperCase()
  }

  setTheme(theme) {
    console.log('Setting theme to:', theme)
    
    // Remove existing theme
    document.documentElement.removeAttribute('data-theme')
    
    // Set new theme
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      // Auto theme - detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-theme', 'light')
      }
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme)
    
    // Update theme toggle if it exists
    this.updateThemeToggle()
    
    // Show notification
    window.showNotification(`Theme changed to ${theme}`, "success", 2000)
  }

  updateThemeToggle() {
    const themeToggle = document.getElementById('themeToggle')
    if (themeToggle) {
      const currentTheme = document.documentElement.getAttribute('data-theme')
      if (currentTheme === 'dark') {
        themeToggle.classList.add('dark')
      } else {
        themeToggle.classList.remove('dark')
      }
    }
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

// Global functions for profile operations
function changeAvatar() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = function(event) {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = function(e) {
        const profileImage = document.getElementById('profileImage')
        if (profileImage) {
          profileImage.src = e.target.result
        }
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

function resetForm() {
  const form = document.getElementById('personalForm')
  if (form) {
    form.reset()
  }
}

function showPasswordForm() {
  alert('Change Password form will be implemented in the next version.')
}

function showActiveSessions() {
  alert('Active Sessions view will be implemented in the next version.')
}

// Initialize profile manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ProfileManager()
})
