// Settings page functionality
class SettingsManager {
  constructor() {
    this.settings = this.loadSettings()
    this.init()
  }

  init() {
    this.setupNavigation()
    this.setupThemeOptions()
    this.setupToggles()
    this.setupSliders()
    this.setupSelects()
    this.setupActions()
    this.setupHeaderThemeToggle()
    this.loadCurrentSettings()
  }

  setupHeaderThemeToggle() {
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'auto'
        let newTheme = 'auto'
        
        if (currentTheme === 'auto') {
          newTheme = 'light'
        } else if (currentTheme === 'light') {
          newTheme = 'dark'
        } else {
          newTheme = 'auto'
        }
        
        this.settings.theme = newTheme
        this.saveSettings()
        
        // Apply theme
        if (window.themeManager) {
          window.themeManager.applyTheme(newTheme)
        } else {
          document.documentElement.setAttribute('data-theme', newTheme)
          localStorage.setItem('theme', newTheme)
        }
        
        // Update theme options in settings
        const themeOptions = document.querySelectorAll(".theme-option")
        themeOptions.forEach((option) => {
          option.classList.toggle("active", option.getAttribute("data-theme") === newTheme)
        })
        
        window.showNotification(`Theme changed to ${newTheme}`, "success", 2000)
      })
    }
  }

  loadSettings() {
    return (
      JSON.parse(localStorage.getItem("appSettings")) || {
        theme: "auto",
        fontSize: 16,
        notifications: true,
        sounds: true,
        autoSave: true,
        readReceipts: true,
        onlineStatus: true,
        language: "en",
      }
    )
  }

  saveSettings() {
    localStorage.setItem("appSettings", JSON.stringify(this.settings))
  }

  setupNavigation() {
    const navItems = document.querySelectorAll(".settings-nav .nav-item")
    const panels = document.querySelectorAll(".settings-panel")

    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const section = item.getAttribute("data-section")

        // Remove active class from all items and panels
        navItems.forEach((nav) => nav.classList.remove("active"))
        panels.forEach((panel) => panel.classList.remove("active"))

        // Add active class to clicked item and corresponding panel
        item.classList.add("active")
        document.getElementById(section).classList.add("active")
      })
    })
  }

  setupThemeOptions() {
    const themeOptions = document.querySelectorAll(".theme-option")

    themeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const theme = option.getAttribute("data-theme")

        // Remove active class from all options
        themeOptions.forEach((opt) => opt.classList.remove("active"))

        // Add active class to clicked option
        option.classList.add("active")

        // Apply theme
        this.settings.theme = theme
        this.saveSettings()
        
        // Apply theme through theme manager
        if (window.themeManager) {
          window.themeManager.applyTheme(theme)
        } else {
          // Fallback: apply theme directly
          document.documentElement.setAttribute('data-theme', theme)
          localStorage.setItem('theme', theme)
        }

        window.showNotification(`Theme changed to ${theme}`, "success", 2000)
      })
    })
  }

  setupToggles() {
    const toggles = document.querySelectorAll(".toggle-switch input")

    toggles.forEach((toggle) => {
      toggle.addEventListener("change", () => {
        const setting = toggle.id
        const enabled = toggle.checked

        this.settings[setting] = enabled
        this.saveSettings()

        window.showNotification(`${this.formatSettingName(setting)} ${enabled ? "enabled" : "disabled"}`, "info", 2000)
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

        if (slider.id === "fontSizeSlider") {
          this.settings.fontSize = Number.parseInt(slider.value)
          this.saveSettings()
          this.applyFontSize(slider.value)
        }
      }

      slider.addEventListener("input", updateValue)
      updateValue() // Set initial value
    })
  }

  setupSelects() {
    const selects = document.querySelectorAll(".setting-select")

    selects.forEach((select) => {
      select.addEventListener("change", () => {
        const setting = select.name || select.id
        const value = select.value

        this.settings[setting] = value
        this.saveSettings()

        window.showNotification(`${this.formatSettingName(setting)} changed`, "info", 2000)
      })
    })
  }

  setupActions() {
    // Test sound button
    const testSoundBtn = document.querySelector(".test-sound")
    if (testSoundBtn) {
      testSoundBtn.addEventListener("click", () => {
        window.showNotification("Playing test sound...", "info", 2000)
        // In a real app, this would play the selected notification sound
      })
    }

    // Setup action functions
    window.clearCache = () => {
      window.showNotification("Clearing cache...", "info", 2000)
      setTimeout(() => {
        window.showNotification("Cache cleared successfully!", "success", 3000)
      }, 2000)
    }

    window.exportData = () => {
      window.showNotification("Preparing data export...", "info", 2000)
      setTimeout(() => {
        // In a real app, this would trigger a download
        window.showNotification("Data export ready for download!", "success", 3000)
      }, 2000)
    }

    window.deleteAllData = () => {
      if (confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
        window.showNotification("Deleting all data...", "warning", 3000)
        setTimeout(() => {
          localStorage.clear()
          window.showNotification("All data deleted. Redirecting to login...", "info", 3000)
          setTimeout(() => {
            window.location.href = "login.html"
          }, 2000)
        }, 2000)
      }
    }

    window.resetSettings = () => {
      if (confirm("Reset all settings to default values?")) {
        this.settings = {
          theme: "auto",
          fontSize: 16,
          notifications: true,
          sounds: true,
          autoSave: true,
          readReceipts: true,
          onlineStatus: true,
          language: "en",
        }
        this.saveSettings()
        this.loadCurrentSettings()
        window.showNotification("Settings reset to defaults", "success", 3000)
      }
    }
  }

  loadCurrentSettings() {
    // Load theme
    const themeOptions = document.querySelectorAll(".theme-option")
    themeOptions.forEach((option) => {
      option.classList.toggle("active", option.getAttribute("data-theme") === this.settings.theme)
    })

    // Load toggles
    Object.keys(this.settings).forEach((key) => {
      const toggle = document.getElementById(key)
      if (toggle && toggle.type === "checkbox") {
        toggle.checked = this.settings[key]
      }
    })

    // Load sliders
    const fontSizeSlider = document.getElementById("fontSizeSlider")
    if (fontSizeSlider) {
      fontSizeSlider.value = this.settings.fontSize
      const valueSpan = fontSizeSlider.parentElement.querySelector(".slider-value")
      if (valueSpan) {
        valueSpan.textContent = this.settings.fontSize + "px"
      }
    }

    // Load selects
    const languageSelect = document.querySelector('select[name="language"]')
    if (languageSelect) {
      languageSelect.value = this.settings.language
    }
  }

  applyFontSize(size) {
    document.documentElement.style.setProperty("--base-font-size", size + "px")
  }

  formatSettingName(setting) {
    return setting.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  }
}

// Initialize settings manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SettingsManager()
})
