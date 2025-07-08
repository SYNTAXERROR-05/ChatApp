class ChatManager {
  constructor() {
    this.currentContact = null
    this.messages = JSON.parse(localStorage.getItem("chatMessages") || "{}")
    this.contacts = this.initializeContacts()
    this.isTyping = false
    this.isRecording = false
    this.typingTimeout = null
    this.currentUser = window.sessionManager.getCurrentUser()
    this.init()
  }

  initializeContacts() {
    return [
      {
        id: 1,
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=50&width=50",
        status: "online",
        lastMessage: "Hey! How are you doing? 😊",
        lastMessageTime: "2 min ago",
        unreadCount: 2,
      },
      {
        id: 2,
        name: "Mike Chen",
        avatar: "/placeholder.svg?height=50&width=50",
        status: "away",
        lastMessage: "Thanks for the help!",
        lastMessageTime: "1 hour ago",
        unreadCount: 0,
      },
      {
        id: 3,
        name: "Design Team",
        avatar: "/placeholder.svg?height=50&width=50",
        status: "offline",
        lastMessage: "New mockups are ready",
        lastMessageTime: "3 hours ago",
        unreadCount: 5,
      },
      {
        id: 4,
        name: "Alex Rivera",
        avatar: "/placeholder.svg?height=50&width=50",
        status: "online",
        lastMessage: "Let's schedule a meeting",
        lastMessageTime: "5 hours ago",
        unreadCount: 1,
      },
    ]
  }

  init() {
    this.loadUserProfile()
    this.setupSidebarNavigation()
    this.setupProfileDropdown()
    this.setupContactSelection()
    this.setupMessageInput()
    this.setupChatActions()
    this.loadMessages()
    this.simulateIncomingMessages()

    // Select first contact by default
    if (this.contacts.length > 0) {
      this.selectContact(this.contacts[0])
    }
  }

  loadUserProfile() {
    if (this.currentUser) {
      const profileAvatar = document.querySelector(".user-profile .profile-avatar img")
      const profileName = document.querySelector(".profile-name")
      const profileStatus = document.querySelector(".profile-status")

      if (profileAvatar) profileAvatar.src = this.currentUser.avatar
      if (profileName) profileName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`
      if (profileStatus) profileStatus.textContent = "Online"
    }
  }

  setupSidebarNavigation() {
    const navItems = document.querySelectorAll(".nav-item")

    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Remove active class from all items
        navItems.forEach((nav) => nav.classList.remove("active"))
        // Add active class to clicked item
        item.classList.add("active")

        const section = item.getAttribute("data-section")
        this.handleNavigation(section)
      })
    })
  }

  handleNavigation(section) {
    switch (section) {
      case "chats":
        window.showNotification("Chats section selected", "info", 2000)
        break
      case "contacts":
        window.showNotification("Contacts section selected", "info", 2000)
        break
      case "notifications":
        window.showNotification("Notifications section selected", "info", 2000)
        break
      case "settings":
        window.location.href = "settings.html"
        break
      case "help":
        window.location.href = "help.html"
        break
    }
  }

  setupProfileDropdown() {
    const userProfile = document.getElementById("userProfile")
    const profileDropdown = document.getElementById("profileDropdown")

    if (userProfile) {
      userProfile.addEventListener("click", () => {
        userProfile.classList.toggle("active")
        profileDropdown.classList.toggle("active")
      })

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!userProfile.contains(e.target)) {
          userProfile.classList.remove("active")
          profileDropdown.classList.remove("active")
        }
      })

      // Handle logout
      const logoutBtn = profileDropdown.querySelector(".logout")
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          window.showNotification("Logging out...", "info", 2000)
          setTimeout(() => {
            window.sessionManager.logout()
          }, 1000)
        })
      }
    }
  }

  setupContactSelection() {
    const contactItems = document.querySelectorAll(".contact-item")

    contactItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Remove active class from all contacts
        contactItems.forEach((contact) => contact.classList.remove("active"))
        // Add active class to clicked contact
        item.classList.add("active")

        // Update current contact
        const contactName = item.querySelector(".contact-name").textContent
        this.currentContact = contactName

        // Update chat header
        this.updateChatHeader(item)

        // Clear unread badge
        const unreadBadge = item.querySelector(".unread-badge")
        if (unreadBadge) {
          unreadBadge.style.animation = "fadeOut 0.3s ease"
          setTimeout(() => unreadBadge.remove(), 300)
        }
      })
    })
  }

  updateChatHeader(contactItem) {
    const chatHeader = document.querySelector(".chat-header")
    const contactName = contactItem.querySelector(".contact-name").textContent
    const contactAvatar = contactItem.querySelector(".contact-avatar img").src
    const statusIndicator = contactItem.querySelector(".status-indicator")

    // Update chat header contact info
    const headerAvatar = chatHeader.querySelector(".contact-avatar img")
    const headerName = chatHeader.querySelector(".contact-name")
    const headerStatus = chatHeader.querySelector(".contact-status")

    headerAvatar.src = contactAvatar
    headerName.textContent = contactName

    // Update status
    if (statusIndicator.classList.contains("online")) {
      headerStatus.innerHTML = '<span style="color: var(--success-color);">Online</span>'
    } else if (statusIndicator.classList.contains("away")) {
      headerStatus.innerHTML = '<span style="color: var(--warning-color);">Away</span>'
    } else {
      headerStatus.innerHTML = '<span style="color: var(--text-muted);">Offline</span>'
    }
  }

  setupMessageInput() {
    const messageInput = document.getElementById("messageInput")
    const sendBtn = document.getElementById("sendBtn")

    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        this.sendMessage()
      }
    })

    messageInput.addEventListener("input", () => {
      // Show typing indicator to other users (simulated)
      this.showTypingIndicator()
    })

    sendBtn.addEventListener("click", () => {
      this.sendMessage()
    })

    // Voice message button
    const voiceBtn = document.querySelector(".voice-btn")
    voiceBtn.addEventListener("click", () => {
      this.handleVoiceMessage()
    })
  }

  sendMessage() {
    const messageInput = document.getElementById("messageInput")
    const message = messageInput.value.trim()

    if (!message || !this.currentContact) return

    const messageObj = {
      id: Date.now(),
      text: message,
      type: "sent",
      timestamp: new Date(),
      senderId: this.currentUser.id,
      receiverId: this.currentContact.id,
    }

    // Add to messages
    if (!this.messages[this.currentContact.id]) {
      this.messages[this.currentContact.id] = []
    }
    this.messages[this.currentContact.id].push(messageObj)

    // Save to localStorage
    localStorage.setItem("chatMessages", JSON.stringify(this.messages))

    // Display message
    this.displayMessage(messageObj)

    // Clear input
    messageInput.value = ""

    // Update contact's last message
    this.currentContact.lastMessage = message
    this.currentContact.lastMessageTime = "now"
    this.updateContactList()

    // Simulate response after delay
    setTimeout(
      () => {
        this.simulateResponse()
      },
      1000 + Math.random() * 2000,
    )
  }

  displayMessage(messageObj) {
    const messagesContainer = document.getElementById("messagesContainer")
    const messageElement = document.createElement("div")
    messageElement.className = `message ${messageObj.type}`

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    if (messageObj.type === "received") {
      messageElement.innerHTML = `
                <div class="message-avatar">
                    <img src="${messageObj.senderId === this.currentUser.id ? this.currentUser.avatar : this.currentContact.avatar}" alt="Contact">
                </div>
                <div class="message-content">
                    <div class="message-bubble">
                        <p>${messageObj.text}</p>
                        <div class="message-time">${currentTime}</div>
                        ${Math.random() > 0.7 ? '<div class="translate-badge"><i class="fas fa-language"></i><span>Translated</span></div>' : ""}
                    </div>
                </div>
            `
    } else {
      messageElement.innerHTML = `
                <div class="message-content">
                    <div class="message-bubble">
                        <p>${messageObj.text}</p>
                        <div class="message-time">
                            ${currentTime}
                            <div class="message-status">
                                <i class="fas fa-check-double"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `
    }

    messagesContainer.appendChild(messageElement)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  simulateResponse() {
    if (!this.currentContact) return

    const responses = [
      "That's interesting! Tell me more about it.",
      "I completely agree with you on that point.",
      "Thanks for sharing that with me! 😊",
      "That sounds like a great idea!",
      "I'll definitely consider that option.",
      "You always have such great insights!",
      "That reminds me of something similar I experienced.",
      "I appreciate you taking the time to explain that.",
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    const messageObj = {
      id: Date.now(),
      text: randomResponse,
      type: "received",
      timestamp: new Date(),
      senderId: this.currentContact.id,
      receiverId: this.currentUser.id,
    }

    // Add to messages
    if (!this.messages[this.currentContact.id]) {
      this.messages[this.currentContact.id] = []
    }
    this.messages[this.currentContact.id].push(messageObj)

    // Save to localStorage
    localStorage.setItem("chatMessages", JSON.stringify(this.messages))

    // Display message
    this.displayMessage(messageObj)

    // Update contact's last message
    this.currentContact.lastMessage = randomResponse
    this.currentContact.lastMessageTime = "now"
    this.updateContactList()
  }

  showTypingIndicator() {
    const contactStatus = document.querySelector(".contact-status")
    const originalContent = contactStatus.innerHTML

    contactStatus.innerHTML = `
            <span class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </span>
            typing...
        `

    // Clear typing indicator after 3 seconds
    clearTimeout(this.typingTimeout)
    this.typingTimeout = setTimeout(() => {
      contactStatus.innerHTML = originalContent
    }, 3000)
  }

  handleVoiceMessage() {
    const voiceBtn = document.querySelector(".voice-btn")

    if (!this.isRecording) {
      // Start recording
      this.isRecording = true
      voiceBtn.style.background = "var(--error-color)"
      voiceBtn.innerHTML = '<i class="fas fa-stop"></i>'

      const showNotification = (message, type, duration) => {
        console.log(`Notification: ${message} (${type})`)
        setTimeout(() => {
          console.log("Notification dismissed")
        }, duration)
      }

      showNotification("Recording voice message...", "info", 2000)

      // Simulate recording for 3 seconds
      setTimeout(() => {
        this.stopVoiceRecording()
      }, 3000)
    } else {
      this.stopVoiceRecording()
    }
  }

  stopVoiceRecording() {
    this.isRecording = false
    const voiceBtn = document.querySelector(".voice-btn")

    voiceBtn.style.background = "var(--secondary-gradient)"
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>'

    // Add voice message to chat
    this.addMessage("🎵 Voice message (0:03)", "sent")

    const showNotification = (message, type, duration) => {
      console.log(`Notification: ${message} (${type})`)
      setTimeout(() => {
        console.log("Notification dismissed")
      }, duration)
    }

    showNotification("Voice message sent!", "success", 2000)
  }

  setupChatActions() {
    const chatActionBtns = document.querySelectorAll(".chat-action-btn")

    chatActionBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const icon = btn.querySelector("i")

        if (icon.classList.contains("fa-phone")) {
          const showNotification = (message, type, duration) => {
            console.log(`Notification: ${message} (${type})`)
            setTimeout(() => {
              console.log("Notification dismissed")
            }, duration)
          }

          showNotification("Starting voice call...", "info", 3000)
        } else if (icon.classList.contains("fa-video")) {
          const showNotification = (message, type, duration) => {
            console.log(`Notification: ${message} (${type})`)
            setTimeout(() => {
              console.log("Notification dismissed")
            }, duration)
          }

          showNotification("Starting video call...", "info", 3000)
        } else if (icon.classList.contains("fa-ellipsis-v")) {
          this.showChatOptions()
        }
      })
    })

    // Input action buttons
    const inputActionBtns = document.querySelectorAll(".input-action-btn")
    inputActionBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const icon = btn.querySelector("i")

        if (icon.classList.contains("fa-paperclip")) {
          this.handleFileAttachment()
        } else if (icon.classList.contains("fa-smile")) {
          this.showEmojiPicker()
        }
      })
    })
  }

  showChatOptions() {
    // Create a temporary options menu
    const optionsMenu = document.createElement("div")
    optionsMenu.className = "chat-options-menu"
    optionsMenu.style.cssText = `
            position: absolute;
            top: 70px;
            right: 20px;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 8px;
            box-shadow: var(--shadow-medium);
            z-index: 1000;
            min-width: 150px;
        `

    optionsMenu.innerHTML = `
            <div class="option-item" onclick="this.parentElement.remove(); showNotification('Chat cleared', 'info', 2000);">
                <i class="fas fa-trash"></i> Clear Chat
            </div>
            <div class="option-item" onclick="this.parentElement.remove(); showNotification('Chat archived', 'info', 2000);">
                <i class="fas fa-archive"></i> Archive
            </div>
            <div class="option-item" onclick="this.parentElement.remove(); showNotification('Contact blocked', 'warning', 2000);">
                <i class="fas fa-ban"></i> Block Contact
            </div>
        `

    // Add styles for option items
    const style = document.createElement("style")
    style.textContent = `
            .option-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                border-radius: 8px;
                transition: all 0.3s ease;
                color: var(--text-secondary);
                font-size: 0.9rem;
            }
            .option-item:hover {
                background: var(--bg-glass-hover);
                color: var(--text-primary);
            }
        `
    document.head.appendChild(style)

    document.body.appendChild(optionsMenu)

    // Remove menu when clicking outside
    setTimeout(() => {
      document.addEventListener("click", function removeMenu(e) {
        if (!optionsMenu.contains(e.target)) {
          optionsMenu.remove()
          document.removeEventListener("click", removeMenu)
        }
      })
    }, 100)
  }

  handleFileAttachment() {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.accept = "image/*,video/*,audio/*,.pdf,.doc,.docx"

    input.onchange = (e) => {
      const files = Array.from(e.target.files)
      files.forEach((file) => {
        const fileType = file.type.split("/")[0]
        let icon = "fas fa-file"

        if (fileType === "image") icon = "fas fa-image"
        else if (fileType === "video") icon = "fas fa-video"
        else if (fileType === "audio") icon = "fas fa-music"

        this.addMessage(`<i class="${icon}"></i> ${file.name}`, "sent")
      })

      const showNotification = (message, type, duration) => {
        console.log(`Notification: ${message} (${type})`)
        setTimeout(() => {
          console.log("Notification dismissed")
        }, duration)
      }

      showNotification(`${files.length} file(s) sent!`, "success", 2000)
    }

    input.click()
  }

  showEmojiPicker() {
    const emojis = ["😀", "😂", "😍", "🤔", "👍", "❤️", "🎉", "🔥", "💯", "✨"]

    const emojiPicker = document.createElement("div")
    emojiPicker.className = "emoji-picker"
    emojiPicker.style.cssText = `
            position: absolute;
            bottom: 80px;
            left: 60px;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 12px;
            box-shadow: var(--shadow-medium);
            z-index: 1000;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
        `

    emojis.forEach((emoji) => {
      const emojiBtn = document.createElement("button")
      emojiBtn.textContent = emoji
      emojiBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 1.5rem;
                padding: 8px;
                border-radius: 8px;
                transition: all 0.3s ease;
            `

      emojiBtn.addEventListener("click", () => {
        const messageInput = document.getElementById("messageInput")
        messageInput.value += emoji
        messageInput.focus()
        emojiPicker.remove()
      })

      emojiBtn.addEventListener("mouseenter", () => {
        emojiBtn.style.background = "var(--bg-glass-hover)"
        emojiBtn.style.transform = "scale(1.2)"
      })

      emojiBtn.addEventListener("mouseleave", () => {
        emojiBtn.style.background = "none"
        emojiBtn.style.transform = "scale(1)"
      })

      emojiPicker.appendChild(emojiBtn)
    })

    document.body.appendChild(emojiPicker)

    // Remove picker when clicking outside
    setTimeout(() => {
      document.addEventListener("click", function removePicker(e) {
        if (!emojiPicker.contains(e.target) && !e.target.closest(".input-action-btn")) {
          emojiPicker.remove()
          document.removeEventListener("click", removePicker)
        }
      })
    }, 100)
  }

  simulateIncomingMessages() {
    // Simulate random incoming messages
    setInterval(() => {
      if (Math.random() > 0.8) {
        // 20% chance every 10 seconds
        const messages = [
          "Hey! How's your day going?",
          "Did you see the latest update?",
          "Let's catch up soon! ☕",
          "Thanks for your help earlier!",
          "Hope you're having a great day! 😊",
        ]

        const randomMessage = messages[Math.floor(Math.random() * messages.length)]
        this.addMessage(randomMessage, "received")

        // Update notification badge
        this.updateNotificationBadge()
      }
    }, 10000)
  }

  updateNotificationBadge() {
    const badge = document.querySelector('.nav-item[data-section="chats"] .notification-badge')
    if (badge) {
      const currentCount = Number.parseInt(badge.textContent) || 0
      badge.textContent = currentCount + 1
      badge.style.animation = "bounce 0.5s ease"
    }
  }

  loadMessages() {
    const messagesContainer = document.getElementById("messagesContainer")
    messagesContainer.innerHTML = ""

    if (this.messages[this.currentContact.id]) {
      this.messages[this.currentContact.id].forEach((message) => {
        this.displayMessage(message)
      })
    }
  }

  selectContact(contact) {
    this.currentContact = contact
    this.updateChatHeader(contact)
    this.loadMessages()
  }

  updateContactList() {
    const contactItems = document.querySelectorAll(".contact-item")

    contactItems.forEach((item) => {
      const contactId = item.getAttribute("data-contact-id")
      const contact = this.contacts.find((c) => c.id == contactId)

      if (contact) {
        const unreadBadge = item.querySelector(".unread-badge")
        if (contact.unreadCount > 0) {
          if (!unreadBadge) {
            const badge = document.createElement("div")
            badge.className = "unread-badge"
            badge.textContent = contact.unreadCount
            item.appendChild(badge)
          } else {
            unreadBadge.textContent = contact.unreadCount
          }
        } else if (unreadBadge) {
          unreadBadge.style.animation = "fadeOut 0.3s ease"
          setTimeout(() => unreadBadge.remove(), 300)
        }
      }
    })
  }
}

// Initialize chat manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ChatManager()
})
