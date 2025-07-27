// Chat Page Specific JavaScript

// Theme Management for Chat Page
class ChatThemeManager {
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

    // Add smooth transition effect
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

// Chat Functionality (placeholder for future features)
class ChatManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupProfileDropdown()
    this.setupMenuDropdown()
    this.setupMessageInput()
    this.setupInputButtons()
    this.setupFilterButtons()
    this.setupChatItems()
    this.setupSearchFunctionality()
    this.setupChatActionButtons()
    this.setupHeaderButtons()
    this.setupMessagesAreaAnimations()
  }

  setupProfileDropdown() {
    const profileAvatar = document.getElementById("profileAvatar")
    const profileDropdown = document.getElementById("profileDropdown")
    
    if (profileAvatar && profileDropdown) {
      profileAvatar.addEventListener("click", (e) => {
        e.stopPropagation()
        profileDropdown.classList.toggle("active")
      })

      // Close dropdown when clicking outside
      document.addEventListener("click", () => {
        profileDropdown.classList.remove("active")
      })
    }
  }

  setupMenuDropdown() {
    const menuBtn = document.getElementById("menuBtn")
    const menuDropdown = document.getElementById("menuDropdown")
    
    if (menuBtn && menuDropdown) {
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        menuDropdown.classList.toggle("active")
      })

      // Close dropdown when clicking outside
      document.addEventListener("click", () => {
        menuDropdown.classList.remove("active")
      })
    }
  }

  setupMessageInput() {
    const messageInput = document.getElementById("messageInput")
    const sendBtn = document.getElementById("sendBtn")
    
    if (messageInput && sendBtn) {
      // Auto-resize input as user types
      messageInput.addEventListener("input", () => {
        if (messageInput.value.trim()) {
          sendBtn.classList.add("active")
        } else {
          sendBtn.classList.remove("active")
        }
        
        // Auto-resize textarea effect
        this.adjustInputHeight(messageInput)
      })

      // Handle Enter key
      messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          if (messageInput.value.trim()) {
            this.sendMessage(messageInput.value.trim())
            messageInput.value = ""
            sendBtn.classList.remove("active")
            this.resetInputHeight(messageInput)
          }
        }
      })

      // Handle send button click
      sendBtn.addEventListener("click", () => {
        if (messageInput.value.trim()) {
          this.sendMessage(messageInput.value.trim())
          messageInput.value = ""
          sendBtn.classList.remove("active")
          this.resetInputHeight(messageInput)
        }
      })

      // Handle paste events for images
      messageInput.addEventListener("paste", (e) => {
        this.handlePaste(e)
      })

      // Focus animations
      messageInput.addEventListener("focus", () => {
        messageInput.parentElement.classList.add("focused")
      })

      messageInput.addEventListener("blur", () => {
        messageInput.parentElement.classList.remove("focused")
      })
    }
  }

  setupInputButtons() {
    this.setupEmojiButton()
    this.setupAttachButton()
    this.setupVoiceButton()
  }

  setupFilterButtons() {
    const filterButtons = document.querySelectorAll(".filter-btn")
    const chatItems = document.querySelectorAll(".chat-item")
    
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove("active"))
        // Add active class to clicked button
        btn.classList.add("active")
        
        // Get filter type from button text
        const filterType = btn.textContent.toLowerCase()
        
        // Apply filter with smooth animation
        this.applyFilter(filterType, chatItems)
      })
    })
  }

  applyFilter(filterType, chatItems) {
    chatItems.forEach(chatItem => {
      // Add fade out animation
      chatItem.style.transition = "opacity 0.2s ease, transform 0.2s ease"
      chatItem.style.opacity = "0.5"
      chatItem.style.transform = "scale(0.98)"
      
      setTimeout(() => {
        let shouldShow = false
        
        switch(filterType) {
          case 'all':
            shouldShow = true
            break
            
          case 'unread':
            // Check if chat has unread count
            const unreadCount = chatItem.querySelector(".unread-count")
            shouldShow = unreadCount && unreadCount.textContent.trim() !== ""
            break
            
          case 'favorites':
            // For demo purposes, mark some chats as favorites
            // In real app, this would check user's favorites data
            const chatName = chatItem.querySelector(".chat-name").textContent
            const favoriteNames = ["Virat Kohli", "Design Team", "Shakti Kapoor"]
            shouldShow = favoriteNames.includes(chatName)
            break
            
          case 'groups':
            // Check if it's a group chat (usually has multiple users or specific naming)
            const groupNames = ["Design Team"] // In real app, this would be dynamic
            const currentChatName = chatItem.querySelector(".chat-name").textContent
            shouldShow = groupNames.includes(currentChatName)
            break
            
          default:
            shouldShow = true
        }
        
        if (shouldShow) {
          chatItem.style.display = "flex"
          setTimeout(() => {
            chatItem.style.opacity = "1"
            chatItem.style.transform = "scale(1)"
          }, 10)
        } else {
          chatItem.style.display = "none"
        }
      }, 100)
    })
    
    // Add visual feedback
    this.showFilterFeedback(filterType)
  }

  showFilterFeedback(filterType) {
    // Create or update filter feedback element
    let feedbackElement = document.querySelector(".filter-feedback")
    
    if (!feedbackElement) {
      feedbackElement = document.createElement("div")
      feedbackElement.className = "filter-feedback"
      const chatFilter = document.querySelector(".chat-filter")
      chatFilter.parentNode.insertBefore(feedbackElement, chatFilter.nextSibling)
    }
    
    // Count visible chats
    const visibleChats = document.querySelectorAll('.chat-item[style*="display: flex"], .chat-item:not([style*="display: none"])')
    const visibleCount = Array.from(visibleChats).filter(chat => 
      !chat.style.display || chat.style.display === "flex"
    ).length
    
    // Update feedback text
    if (filterType === 'all') {
      feedbackElement.textContent = `Showing all conversations`
    } else {
      feedbackElement.textContent = `${visibleCount} ${filterType} conversation${visibleCount !== 1 ? 's' : ''}`
    }
    
    // Show feedback with animation
    feedbackElement.style.opacity = "1"
    feedbackElement.style.transform = "translateY(0)"
    
    // Hide feedback after 2 seconds
    setTimeout(() => {
      feedbackElement.style.opacity = "0"
      feedbackElement.style.transform = "translateY(-10px)"
    }, 2000)
  }

  setupChatItems() {
    const chatItems = document.querySelectorAll(".chat-item")
    
    chatItems.forEach(chatItem => {
      // Add click event listener
      chatItem.addEventListener("click", () => {
        this.selectChat(chatItem)
      })
      
      // Add hover effects
      chatItem.addEventListener("mouseenter", () => {
        this.addChatHoverEffect(chatItem)
      })
      
      chatItem.addEventListener("mouseleave", () => {
        this.removeChatHoverEffect(chatItem)
      })
      
      // Add long press for mobile context menu (future feature)
      let pressTimer = null
      chatItem.addEventListener("mousedown", () => {
        pressTimer = setTimeout(() => {
          this.showChatContextMenu(chatItem)
        }, 800)
      })
      
      chatItem.addEventListener("mouseup", () => {
        if (pressTimer) {
          clearTimeout(pressTimer)
          pressTimer = null
        }
      })
      
      chatItem.addEventListener("mouseleave", () => {
        if (pressTimer) {
          clearTimeout(pressTimer)
          pressTimer = null
        }
      })
    })
  }

  setupSearchFunctionality() {
    const searchInput = document.querySelector(".search-input")
    const chatItems = document.querySelectorAll(".chat-item")
    let searchTimeout = null
    
    if (!searchInput) return
    
    // Add search event listeners
    searchInput.addEventListener("input", (e) => {
      // Clear previous timeout to debounce search
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
      
      // Debounce search by 300ms
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value.trim(), chatItems)
      }, 300)
    })
    
    // Handle search focus effects
    searchInput.addEventListener("focus", () => {
      this.addSearchFocusEffect()
    })
    
    searchInput.addEventListener("blur", () => {
      this.removeSearchFocusEffect()
    })
    
    // Handle Enter key for search
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        this.performSearch(e.target.value.trim(), chatItems)
      }
    })
    
    // Handle clear search when input is empty
    searchInput.addEventListener("keyup", (e) => {
      if (e.target.value === "") {
        this.clearSearch(chatItems)
      }
    })
  }

  performSearch(searchTerm, chatItems) {
    // If search is empty, show all chats
    if (!searchTerm) {
      this.clearSearch(chatItems)
      return
    }
    
    // Convert search term to lowercase for case-insensitive search
    const lowerSearchTerm = searchTerm.toLowerCase()
    let matchCount = 0
    
    // Search through each chat item
    chatItems.forEach(chatItem => {
      const chatName = chatItem.querySelector(".chat-name")?.textContent.toLowerCase() || ""
      const lastMessage = chatItem.querySelector(".message-preview span")?.textContent.toLowerCase() || ""
      const chatTime = chatItem.querySelector(".chat-time")?.textContent.toLowerCase() || ""
      
      // Check if search term matches name, message, or time
      const isMatch = chatName.includes(lowerSearchTerm) || 
                     lastMessage.includes(lowerSearchTerm) || 
                     chatTime.includes(lowerSearchTerm)
      
      // Show/hide chat item with animation
      if (isMatch) {
        this.showChatItem(chatItem)
        matchCount++
        
        // Highlight matching text
        this.highlightSearchResults(chatItem, lowerSearchTerm)
      } else {
        this.hideChatItem(chatItem)
      }
    })
    
    // Show search results feedback
    this.showSearchFeedback(searchTerm, matchCount)
  }

  showChatItem(chatItem) {
    chatItem.style.display = "flex"
    chatItem.style.opacity = "0"
    chatItem.style.transform = "translateX(-20px)"
    
    setTimeout(() => {
      chatItem.style.transition = "all 0.3s ease"
      chatItem.style.opacity = "1"
      chatItem.style.transform = "translateX(0)"
    }, 10)
  }

  hideChatItem(chatItem) {
    chatItem.style.transition = "all 0.2s ease"
    chatItem.style.opacity = "0"
    chatItem.style.transform = "translateX(-20px)"
    
    setTimeout(() => {
      if (chatItem.style.opacity === "0") {
        chatItem.style.display = "none"
      }
    }, 200)
  }

  highlightSearchResults(chatItem, searchTerm) {
    // Highlight matching text in chat name
    const chatName = chatItem.querySelector(".chat-name")
    const lastMessage = chatItem.querySelector(".message-preview span")
    
    if (chatName) {
      chatName.innerHTML = this.highlightText(chatName.textContent, searchTerm)
    }
    
    if (lastMessage) {
      lastMessage.innerHTML = this.highlightText(lastMessage.textContent, searchTerm)
    }
  }

  highlightText(text, searchTerm) {
    if (!searchTerm) return text
    
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    return text.replace(regex, '<mark class="search-highlight">$1</mark>')
  }

  clearSearch(chatItems) {
    // Show all chat items
    chatItems.forEach(chatItem => {
      chatItem.style.display = "flex"
      chatItem.style.opacity = "1"
      chatItem.style.transform = "translateX(0)"
      chatItem.style.transition = ""
      
      // Remove highlight from text
      this.removeHighlight(chatItem)
    })
    
    // Hide search feedback
    this.hideSearchFeedback()
  }

  removeHighlight(chatItem) {
    const chatName = chatItem.querySelector(".chat-name")
    const lastMessage = chatItem.querySelector(".message-preview span")
    
    if (chatName) {
      chatName.innerHTML = chatName.textContent
    }
    
    if (lastMessage) {
      lastMessage.innerHTML = lastMessage.textContent
    }
  }

  addSearchFocusEffect() {
    const searchContainer = document.querySelector(".search-input-container")
    if (searchContainer) {
      searchContainer.classList.add("focused")
    }
  }

  removeSearchFocusEffect() {
    const searchContainer = document.querySelector(".search-input-container")
    if (searchContainer) {
      searchContainer.classList.remove("focused")
    }
  }

  showSearchFeedback(searchTerm, matchCount) {
    // Create or update search feedback element
    let feedbackElement = document.querySelector(".search-feedback")
    
    if (!feedbackElement) {
      feedbackElement = document.createElement("div")
      feedbackElement.className = "search-feedback"
      const searchSection = document.querySelector(".search-section")
      searchSection.parentNode.insertBefore(feedbackElement, searchSection.nextSibling)
    }
    
    // Update feedback text
    if (matchCount === 0) {
      feedbackElement.textContent = `No results found for "${searchTerm}"`
      feedbackElement.classList.add("no-results")
    } else {
      feedbackElement.textContent = `${matchCount} result${matchCount !== 1 ? 's' : ''} for "${searchTerm}"`
      feedbackElement.classList.remove("no-results")
    }
    
    // Show feedback with animation
    feedbackElement.style.opacity = "1"
    feedbackElement.style.transform = "translateY(0)"
  }

  hideSearchFeedback() {
    const feedbackElement = document.querySelector(".search-feedback")
    if (feedbackElement) {
      feedbackElement.style.opacity = "0"
      feedbackElement.style.transform = "translateY(-10px)"
    }
  }

  selectChat(selectedChatItem) {
    // Remove active class from all chat items and clear inline styles
    const allChatItems = document.querySelectorAll(".chat-item")
    allChatItems.forEach(item => {
      item.classList.remove("active")
      // Clear any inline background styles that might interfere
      item.style.backgroundColor = ""
    })
    
    // Add active class to selected chat
    selectedChatItem.classList.add("active")
    
    // Get chat data
    const chatData = this.extractChatData(selectedChatItem)
    
    // Update chat window with selected chat
    this.updateChatWindow(chatData)
    
    // Mark chat as read (remove unread count)
    this.markChatAsRead(selectedChatItem)
    
    // Add selection animation
    this.addSelectionAnimation(selectedChatItem)
  }

  extractChatData(chatItem) {
    const avatar = chatItem.querySelector(".chat-avatar img")
    const name = chatItem.querySelector(".chat-name")
    const time = chatItem.querySelector(".chat-time")
    const lastMessage = chatItem.querySelector(".message-preview span")
    
    return {
      avatar: avatar ? avatar.src : "/src/images/default-profile.png",
      name: name ? name.textContent : "Unknown",
      time: time ? time.textContent : "",
      lastMessage: lastMessage ? lastMessage.textContent : "",
      status: this.generateUserStatus(time ? time.textContent : "")
    }
  }

  updateChatWindow(chatData) {
    // Update contact info in chat header
    const contactAvatar = document.querySelector(".contact-avatar img")
    const contactName = document.querySelector(".contact-name")
    const contactStatus = document.querySelector(".contact-status")
    
    if (contactAvatar) contactAvatar.src = chatData.avatar
    if (contactName) contactName.textContent = chatData.name
    if (contactStatus) contactStatus.textContent = chatData.status
    
    // Load chat messages (for demo, we'll show sample messages)
    this.loadChatMessages(chatData.name)
    
    // Update page title
    document.title = `${chatData.name} - TranslaTalk`
  }

  generateUserStatus(lastSeen) {
    const currentTime = new Date()
    const timeString = lastSeen.toLowerCase()
    
    if (timeString.includes("pm") || timeString.includes("am")) {
      return `last seen today at ${lastSeen}`
    } else if (timeString === "yesterday") {
      return "last seen yesterday"
    } else if (timeString.includes("day")) {
      return `last seen ${lastSeen}`
    } else {
      return "last seen recently"
    }
  }

  loadChatMessages(contactName) {
    const messagesArea = document.getElementById("messagesArea")
    if (!messagesArea) return
    
    // Sample messages for different contacts (in a real app, this would fetch from backend)
    const messageTemplates = {
      "Virat Kohli": [
        { type: "received", text: "Kya india team ki jeet hogi? 😊", time: "2:30 PM" },
        { type: "sent", text: "nhi buddy india team to gyo", time: "2:32 PM", status: "read" },
        { type: "received", text: "ha Ben Stokes kaisa khel rhe hai", time: "2:35 PM", translated: true },
        { type: "sent", text: "yha pr thala hi jaan bacha skte hai", time: "2:38 PM", status: "read" }
      ],
      "Arjun Kapoor": [
        { type: "received", text: "Hey! How's the project going?", time: "1:10 PM" },
        { type: "sent", text: "It's going well, almost done!", time: "1:12 PM", status: "read" },
        { type: "received", text: "Thanks for the help with the project!", time: "1:15 PM" }
      ],
      "Design Team": [
        { type: "received", text: "New mockups are ready for review", time: "11:40 AM", sender: "Shakti Kapoor" },
        { type: "sent", text: "Great! I'll check them out", time: "11:42 AM", status: "read" },
        { type: "received", text: "Let me know your feedback", time: "11:45 AM", sender: "Shakti Kapoor" }
      ]
    }
    
    const messages = messageTemplates[contactName] || [
      { type: "received", text: "Hello! How are you?", time: "12:00 PM" },
      { type: "sent", text: "I'm doing great, thanks!", time: "12:01 PM", status: "read" }
    ]
    
    // Clear existing messages
    messagesArea.innerHTML = `
      <div class="date-separator">
        <span>Today</span>
      </div>
    `
    
    // Add messages with animation
    messages.forEach((msg, index) => {
      setTimeout(() => {
        this.addMessageToChat(messagesArea, msg)
      }, index * 100)
    })
    
    // Add typing indicator
    setTimeout(() => {
      this.addTypingIndicator(messagesArea)
    }, messages.length * 100 + 500)
  }

  addMessageToChat(messagesArea, messageData) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${messageData.type}`
    
    let messageHTML = `
      <div class="message-bubble">
        <p class="message-text">${messageData.text}</p>
        <div class="message-meta">
          <span class="message-time">${messageData.time}</span>
          ${messageData.status ? `<i class="fas fa-check-double message-status ${messageData.status}"></i>` : ''}
        </div>
        ${messageData.translated ? `
          <div class="translate-indicator">
            <i class="fas fa-language"></i>
            <span>Translated from Spanish</span>
          </div>
        ` : ''}
      </div>
    `
    
    messageDiv.innerHTML = messageHTML
    
    // Add animation
    messageDiv.style.opacity = "0"
    messageDiv.style.transform = "translateY(20px)"
    messagesArea.appendChild(messageDiv)
    
    setTimeout(() => {
      messageDiv.style.transition = "all 0.3s ease"
      messageDiv.style.opacity = "1"
      messageDiv.style.transform = "translateY(0)"
    }, 10)
    
    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight
  }

  addTypingIndicator(messagesArea) {
    const existingIndicator = messagesArea.querySelector(".typing-indicator")
    if (existingIndicator) {
      existingIndicator.remove()
    }
    
    const typingDiv = document.createElement("div")
    typingDiv.className = "typing-indicator"
    typingDiv.innerHTML = `
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `
    
    messagesArea.appendChild(typingDiv)
    messagesArea.scrollTop = messagesArea.scrollHeight
    
    // Remove typing indicator after 3 seconds
    setTimeout(() => {
      if (typingDiv.parentNode) {
        typingDiv.remove()
      }
    }, 3000)
  }

  markChatAsRead(chatItem) {
    const unreadCount = chatItem.querySelector(".unread-count")
    if (unreadCount) {
      unreadCount.style.transition = "all 0.3s ease"
      unreadCount.style.opacity = "0"
      unreadCount.style.transform = "scale(0.8)"
      
      setTimeout(() => {
        unreadCount.remove()
      }, 300)
    }
  }

  addSelectionAnimation(chatItem) {
    chatItem.style.transform = "scale(0.98)"
    setTimeout(() => {
      chatItem.style.transition = "transform 0.2s ease"
      chatItem.style.transform = "scale(1)"
    }, 50)
  }


  showChatContextMenu(chatItem) {
    // Future feature: Show context menu with options like
    // Delete, Archive, Mark as unread, etc.
    console.log("Context menu for:", chatItem.querySelector(".chat-name").textContent)
    
    // Add visual feedback for long press
    chatItem.style.transform = "scale(0.95)"
    setTimeout(() => {
      chatItem.style.transform = "scale(1)"
    }, 200)
  }

  setupChatActionButtons() {
    const actionButtons = document.querySelectorAll(".action-btn")
    
    actionButtons.forEach(button => {
      const title = button.getAttribute("title")
      
      button.addEventListener("click", (e) => {
        e.preventDefault()
        this.handleActionButtonClick(title, button)
      })
      
      // Add hover effects
      button.addEventListener("mouseenter", () => {
        this.addActionButtonHover(button)
      })
      
      button.addEventListener("mouseleave", () => {
        this.removeActionButtonHover(button)
      })
    })
  }

  setupHeaderButtons() {
    // Setup Communities button
    const communitiesBtn = document.getElementById("communitiesBtn")
    const communitiesPopup = document.getElementById("communitiesPopup")
    
    if (communitiesBtn && communitiesPopup) {
      communitiesBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        // Close any other open popups
        this.closeAllPopups()
        // Show communities popup
        communitiesPopup.classList.add("active")
      })
    }

    // Setup Status button
    const statusBtn = document.getElementById("statusBtn")
    const statusPopup = document.getElementById("statusPopup")
    
    if (statusBtn && statusPopup) {
      statusBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        // Close any other open popups
        this.closeAllPopups()
        // Show status popup
        statusPopup.classList.add("active")
      })
    }

    // Close popups when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".new-feature-popup") && 
          !e.target.closest("#communitiesBtn") && 
          !e.target.closest("#statusBtn")) {
        this.closeAllPopups()
      }
    })

    // Auto-close popups after 8 seconds
    const autoClosePopups = () => {
      setTimeout(() => {
        if (communitiesPopup && communitiesPopup.classList.contains("active")) {
          closeCommunititesPopup()
        }
        if (statusPopup && statusPopup.classList.contains("active")) {
          closeStatusPopup()
        }
      }, 8000)
    }

    if (communitiesBtn) {
      communitiesBtn.addEventListener("click", autoClosePopups)
    }
    if (statusBtn) {
      statusBtn.addEventListener("click", autoClosePopups)
    }
  }

  closeAllPopups() {
    const communitiesPopup = document.getElementById("communitiesPopup")
    const statusPopup = document.getElementById("statusPopup")
    
    if (communitiesPopup && communitiesPopup.classList.contains("active")) {
      closeCommunititesPopup()
    }
    if (statusPopup && statusPopup.classList.contains("active")) {
      closeStatusPopup()
    }
  }

  handleActionButtonClick(actionType, button) {
    // Add click animation
    this.addActionButtonClickEffect(button)
    
    switch(actionType) {
      case "Search":
        this.toggleChatSearch()
        break
        
      case "Voice Call":
        this.showNewFeaturePopup("Voice Call")
        break
        
      case "Video Call":
        this.showNewFeaturePopup("Video Call")
        break
        
      case "More":
        this.showMoreOptions(button)
        break
        
      default:
        console.log("Unknown action:", actionType)
    }
  }

  toggleChatSearch() {
    // Toggle in-chat search functionality
    let searchContainer = document.querySelector(".chat-search-container")
    
    if (!searchContainer) {
      // Create search container (not full-screen overlay)
      searchContainer = document.createElement("div")
      searchContainer.className = "chat-search-container"
      searchContainer.innerHTML = `
        <div class="chat-search-input-container">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search in this conversation..." class="chat-search-input" id="chatSearchInput">
          <button class="chat-search-close" id="chatSearchClose">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="search-results-info" id="searchResultsInfo"></div>
      `
      
      // Position search container relative to chat actions
      const chatActions = document.querySelector(".chat-actions")
      chatActions.style.position = "relative"
      chatActions.appendChild(searchContainer)
      
      // Setup search functionality
      this.setupInChatSearch()
    } else {
      // Toggle visibility
      searchContainer.classList.toggle("active")
      
      // If closing, remove outside click listener
      if (!searchContainer.classList.contains("active")) {
        this.removeChatSearchOutsideClickListener()
      }
    }
    
    // Focus on search input if shown
    if (searchContainer.classList.contains("active")) {
      const searchInput = document.getElementById("chatSearchInput")
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100)
      }
      // Add outside click listener when search is shown
      this.addChatSearchOutsideClickListener()
    }
  }

  setupInChatSearch() {
    const searchInput = document.getElementById("chatSearchInput")
    const searchClose = document.getElementById("chatSearchClose")
    const searchContainer = document.querySelector(".chat-search-container")
    
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchInCurrentChat(e.target.value)
      })
      
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.searchInCurrentChat(e.target.value)
        }
      })
    }
    
    if (searchClose) {
      searchClose.addEventListener("click", () => {
        searchContainer.classList.remove("active")
        this.clearChatSearch()
        this.removeChatSearchOutsideClickListener()
      })
    }
    
    // Show container
    setTimeout(() => {
      searchContainer.classList.add("active")
    }, 10)
  }

  addChatSearchOutsideClickListener() {
    // Remove any existing listener first
    this.removeChatSearchOutsideClickListener()
    
    // Define the outside click handler
    this.chatSearchOutsideClickHandler = (e) => {
      const searchContainer = document.querySelector(".chat-search-container")
      const searchButton = document.querySelector('[title="Search"]')
      
      // Check if click is outside search container and search button
      if (searchContainer && 
          !searchContainer.contains(e.target) && 
          !searchButton.contains(e.target) &&
          searchContainer.classList.contains("active")) {
        
        searchContainer.classList.remove("active")
        this.clearChatSearch()
        this.removeChatSearchOutsideClickListener()
      }
    }
    
    // Add listener with a small delay to prevent immediate triggering
    setTimeout(() => {
      document.addEventListener("click", this.chatSearchOutsideClickHandler)
    }, 100)
  }

  removeChatSearchOutsideClickListener() {
    if (this.chatSearchOutsideClickHandler) {
      document.removeEventListener("click", this.chatSearchOutsideClickHandler)
      this.chatSearchOutsideClickHandler = null
    }
  }

  searchInCurrentChat(searchTerm) {
    const messages = document.querySelectorAll(".message-text")
    const resultsInfo = document.getElementById("searchResultsInfo")
    let matchCount = 0
    
    // Clear previous highlights
    messages.forEach(msg => {
      msg.innerHTML = msg.textContent
    })
    
    if (searchTerm.trim()) {
      const regex = new RegExp(`(${searchTerm.trim()})`, 'gi')
      
      messages.forEach(msg => {
        const text = msg.textContent
        if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
          msg.innerHTML = text.replace(regex, '<span class="chat-search-highlight">$1</span>')
          matchCount++
        }
      })
      
      // Update results info
      if (resultsInfo) {
        if (matchCount === 0) {
          resultsInfo.textContent = `No results found for "${searchTerm}"`
          resultsInfo.className = "search-results-info no-results"
        } else {
          resultsInfo.textContent = `${matchCount} result${matchCount !== 1 ? 's' : ''} found`
          resultsInfo.className = "search-results-info has-results"
        }
      }
    } else {
      this.clearChatSearch()
    }
  }

  clearChatSearch() {
    const messages = document.querySelectorAll(".message-text")
    const resultsInfo = document.getElementById("searchResultsInfo")
    
    messages.forEach(msg => {
      msg.innerHTML = msg.textContent
    })
    
    if (resultsInfo) {
      resultsInfo.textContent = ""
      resultsInfo.className = "search-results-info"
    }
  }

  showNewFeaturePopup(featureName) {
    // Remove any existing popup
    const existingPopup = document.querySelector(".new-feature-popup.dynamic-popup")
    if (existingPopup) {
      existingPopup.remove()
    }

    // Find the button that was clicked
    const buttons = document.querySelectorAll(".action-btn")
    let targetButton = null
    
    buttons.forEach(button => {
      const title = button.getAttribute("title") || button.getAttribute("data-action")
      if (title === featureName) {
        targetButton = button
      }
    })

    if (!targetButton) return

    // Determine popup positioning class based on feature
    const positionClass = (featureName === "Voice Call" || featureName === "Video Call") ? "right-side" : "left-side"

    // Create dropdown popup positioned relative to button
    const popup = document.createElement("div")
    popup.className = `new-feature-popup ${positionClass} dynamic-popup`
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-header">
          <h3>🚀 Coming Soon!</h3>
          <button class="popup-close" title="Close popup" id="closePopup">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="popup-body">
          <div class="feature-icon">
            ${featureName === "Voice Call" ? "📞" : featureName === "Video Call" ? "📹" : "🚀"}
          </div>
          <h4>${featureName}</h4>
          <p>This feature is currently under development. Stay tuned for updates!</p>
          <p class="feature-note">We're working hard to bring you the best chat experience.</p>
        </div>
        <div class="popup-footer">
          <button class="btn-primary" id="gotItBtn">Got it!</button>
        </div>
      </div>
    `
    
    // Position popup relative to the button
    const buttonContainer = targetButton.parentElement
    buttonContainer.style.position = "relative"
    buttonContainer.appendChild(popup)
    
    // Show popup with animation
    setTimeout(() => {
      popup.classList.add("active")
    }, 10)
    
    // Add event listeners
    const closeBtn = popup.querySelector("#closePopup")
    const gotItBtn = popup.querySelector("#gotItBtn")
    
    const closePopupHandler = () => {
      popup.classList.remove("active")
      popup.classList.add("closing")
      setTimeout(() => {
        if (popup.parentElement) {
          popup.parentElement.removeChild(popup)
        }
      }, 300)
    }
    
    closeBtn.addEventListener("click", closePopupHandler)
    gotItBtn.addEventListener("click", closePopupHandler)
    
    const closePopup = () => {
      popup.classList.remove("active")
      popup.classList.add("closing")
      setTimeout(() => {
        if (popup.parentElement) {
          popup.parentElement.removeChild(popup)
        }
      }, 300)
    }
    
    
    // Close on outside click
    const outsideClickHandler = (e) => {
      if (!popup.contains(e.target) && !targetButton.contains(e.target)) {
        closePopupHandler()
        document.removeEventListener("click", outsideClickHandler)
      }
    }
    
    setTimeout(() => {
      document.addEventListener("click", outsideClickHandler)
    }, 100)
    
    // Auto close after 8 seconds
    setTimeout(() => {
      if (popup.parentElement) {
        closePopupHandler()
        document.removeEventListener("click", outsideClickHandler)
      }
    }, 8000)
  }

  showMoreOptions(button) {
    // Create more options dropdown
    let moreDropdown = document.querySelector(".more-options-dropdown")
    
    if (!moreDropdown) {
      moreDropdown = document.createElement("div")
      moreDropdown.className = "more-options-dropdown"
      moreDropdown.innerHTML = `
        <div class="more-options-content">
          <button class="more-option-item" data-action="view-contact">
            <i class="fas fa-user"></i>
            <span>View Contact</span>
          </button>
          <button class="more-option-item" data-action="media">
            <i class="fas fa-images"></i>
            <span>Media, Links, Docs</span>
          </button>
          <button class="more-option-item" data-action="search">
            <i class="fas fa-search"></i>
            <span>Search</span>
          </button>
          <button class="more-option-item" data-action="mute">
            <i class="fas fa-volume-mute"></i>
            <span>Mute Notifications</span>
          </button>
          <button class="more-option-item" data-action="wallpaper">
            <i class="fas fa-palette"></i>
            <span>Wallpaper</span>
          </button>
          <hr class="more-options-divider">
          <button class="more-option-item danger" data-action="block">
            <i class="fas fa-ban"></i>
            <span>Block</span>
          </button>
          <button class="more-option-item danger" data-action="report">
            <i class="fas fa-flag"></i>
            <span>Report</span>
          </button>
        </div>
      `
      
      button.parentNode.appendChild(moreDropdown)
      
      // Setup option clicks
      moreDropdown.querySelectorAll(".more-option-item").forEach(item => {
        item.addEventListener("click", () => {
          const action = item.getAttribute("data-action")
          this.handleMoreOption(action)
          moreDropdown.classList.remove("active")
        })
      })
      
      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!moreDropdown.contains(e.target) && !button.contains(e.target)) {
          moreDropdown.classList.remove("active")
        }
      })
    }
    
    moreDropdown.classList.toggle("active")
  }

  handleMoreOption(action) {
    const contactName = document.querySelector(".contact-name")?.textContent || "Contact"
    
    switch(action) {
      case "view-contact":
        this.showNotification(`📋 Opening ${contactName}'s profile...`, "info")
        setTimeout(() => {
          window.location.href = '/template/friend-profile.html'
        }, 1000)
        break
        
      case "media":
        this.showNotification("📁 Opening media gallery...", "info")
        break
        
      case "search":
        this.toggleChatSearch()
        break
        
      case "mute":
        this.showNotification(`🔇 ${contactName} notifications muted`, "success")
        break
        
      case "wallpaper":
        this.showNotification("🎨 Wallpaper settings opened", "info")
        break
        
      case "block":
        this.showNotification(`🚫 ${contactName} has been blocked`, "warning")
        break
        
      case "report":
        this.showNotification(`🏴 ${contactName} has been reported`, "warning")
        break
        
      default:
        console.log("Unknown more option:", action)
    }
  }

  addActionButtonHover(button) {
    button.style.transform = "scale(1.1)"
    button.style.backgroundColor = "var(--hover-color)"
  }

  removeActionButtonHover(button) {
    button.style.transform = "scale(1)"
    button.style.backgroundColor = ""
  }

  addActionButtonClickEffect(button) {
    button.style.transform = "scale(0.95)"
    setTimeout(() => {
      button.style.transform = "scale(1)"
    }, 150)
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close">×</button>
      </div>
    `
    
    // Add to document
    document.body.appendChild(notification)
    
    // Show notification
    setTimeout(() => {
      notification.classList.add("show")
    }, 10)
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
    
    // Close button functionality
    notification.querySelector(".notification-close").addEventListener("click", () => {
      notification.classList.remove("show")
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    })
  }

  sendMessage(text) {
    if (!text.trim()) return
    
    // Add sending animation to send button
    const sendBtn = document.getElementById('sendBtn')
    if (sendBtn) {
      sendBtn.classList.add('sending')
      setTimeout(() => {
        sendBtn.classList.remove('sending')
        sendBtn.classList.add('sent')
        setTimeout(() => {
          sendBtn.classList.remove('sent')
        }, 600)
      }, 300)
    }
    
    // Add message to chat immediately
    this.addTextMessageToChat(text)
    
    // Show success notification for demo
    this.showNotification('Message sent!', 'success')
    
    // In a real app, you would send the message to your backend here
    console.log("Sending message:", text)
    
    // Simulate typing response after 2 seconds
    setTimeout(() => {
      this.simulateTypingResponse()
    }, 2000)
  }

  addTextMessageToChat(text) {
    const messagesArea = document.getElementById('messagesArea')
    if (!messagesArea) return

    // Create text message element
    const messageDiv = document.createElement('div')
    messageDiv.className = 'message sent'
    
    messageDiv.innerHTML = `
      <div class="message-bubble">
        <p class="message-text">${this.escapeHtml(text)}</p>
        <div class="message-meta">
          <span class="message-time">${this.getCurrentTime()}</span>
          <i class="fas fa-check-double message-status"></i>
        </div>
      </div>
    `
    
    // Add message with animation
    messageDiv.style.opacity = '0'
    messageDiv.style.transform = 'translateX(30px)'
    messagesArea.appendChild(messageDiv)
    
    setTimeout(() => {
      messageDiv.style.transition = 'all 0.3s ease'
      messageDiv.style.opacity = '1'
      messageDiv.style.transform = 'translateX(0)'
    }, 10)
    
    // Auto-scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight
    
    // Mark as read after animation
    setTimeout(() => {
      const status = messageDiv.querySelector('.message-status')
      if (status) {
        status.classList.add('read')
      }
    }, 1000)
  }

  simulateTypingResponse() {
    const messagesArea = document.getElementById('messagesArea')
    if (!messagesArea) return

    // Add typing indicator
    this.addTypingIndicator(messagesArea)
    
    // Auto responses based on keywords
    const responses = [
      "That's interesting! 😊",
      "I see what you mean 👍",
      "Thanks for sharing that!",
      "Got it! 😄",
      "Absolutely! 💯",
      "That makes sense 🤔",
      "Cool! 😎"
    ]
    
    setTimeout(() => {
      // Remove typing indicator
      const typingIndicator = messagesArea.querySelector('.typing-indicator')
      if (typingIndicator) {
        typingIndicator.remove()
      }
      
      // Add response message
      const response = responses[Math.floor(Math.random() * responses.length)]
      this.addReceivedMessage(response)
    }, 1500)
  }

  addReceivedMessage(text) {
    const messagesArea = document.getElementById('messagesArea')
    if (!messagesArea) return

    const messageDiv = document.createElement('div')
    messageDiv.className = 'message received'
    
    messageDiv.innerHTML = `
      <div class="message-bubble">
        <p class="message-text">${this.escapeHtml(text)}</p>
        <div class="message-meta">
          <span class="message-time">${this.getCurrentTime()}</span>
        </div>
      </div>
    `
    
    // Add message with animation
    messageDiv.style.opacity = '0'
    messageDiv.style.transform = 'translateX(-30px)'
    messagesArea.appendChild(messageDiv)
    
    setTimeout(() => {
      messageDiv.style.transition = 'all 0.3s ease'
      messageDiv.style.opacity = '1'
      messageDiv.style.transform = 'translateX(0)'
    }, 10)
    
    // Auto-scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  addButtonClickEffect(button) {
    button.style.transform = 'scale(0.95)'
    button.style.transition = 'transform 0.1s ease'
    
    setTimeout(() => {
      button.style.transform = 'scale(1)'
    }, 100)
  }

  setupMessagesAreaAnimations() {
    const messagesArea = document.getElementById("messagesArea")
    if (!messagesArea) return

    // Add scroll-based animations
    let isScrolling = false
    let scrollTimeout

    messagesArea.addEventListener("scroll", () => {
      if (!isScrolling) {
        messagesArea.style.animation = "scrollGlow 0.8s ease-in-out"
        isScrolling = true
      }

      // Clear previous timeout
      clearTimeout(scrollTimeout)

      // Set new timeout
      scrollTimeout = setTimeout(() => {
        messagesArea.style.animation = ""
        isScrolling = false
      }, 150)
    })

    // Animate messages on load
    this.animateExistingMessages()

    // Observe new messages for animation
    this.observeNewMessages()
  }

  animateExistingMessages() {
    const messages = document.querySelectorAll(".message")
    messages.forEach((message, index) => {
      message.style.animationDelay = `${index * 0.1}s`
      message.style.opacity = "0"
      
      // Trigger animation
      setTimeout(() => {
        message.style.opacity = "1"
      }, index * 100)
    })
  }

  observeNewMessages() {
    const messagesArea = document.getElementById("messagesArea")
    if (!messagesArea) return

    // Create intersection observer for message animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("message-visible")
          
          // Add floating particle effect on message appear
          this.createMessageParticles(entry.target)
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: "20px"
    })

    // Observe all messages
    const messages = messagesArea.querySelectorAll(".message")
    messages.forEach(message => {
      observer.observe(message)
    })
  }

  createMessageParticles(messageElement) {
    // Create subtle particle effect when message comes into view
    for (let i = 0; i < 3; i++) {
      const particle = document.createElement("div")
      particle.className = "message-particle"
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(102, 126, 234, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10;
        animation: particleFloat 2s ease-out forwards;
      `
      
      const rect = messageElement.getBoundingClientRect()
      particle.style.left = `${rect.left + Math.random() * rect.width}px`
      particle.style.top = `${rect.top + rect.height / 2}px`
      
      document.body.appendChild(particle)
      
      // Remove particle after animation
      setTimeout(() => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle)
        }
      }, 2000)
    }
  }

  // Emoji Button Functionality
  setupEmojiButton() {
    const emojiBtn = document.querySelector('.input-btn[title="Emoji"]')
    if (!emojiBtn) return

    emojiBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      this.showEmojiPicker()
      this.addButtonClickEffect(emojiBtn)
    })

    // Close emoji picker when clicking outside
    document.addEventListener('click', (e) => {
      const emojiPicker = document.getElementById('emojiPicker')
      if (emojiPicker && !emojiPicker.contains(e.target) && !emojiBtn.contains(e.target)) {
        emojiPicker.remove()
      }
    })
  }

  showEmojiPicker() {
    // Remove existing emoji picker
    const existingPicker = document.getElementById('emojiPicker')
    if (existingPicker) {
      existingPicker.remove()
      return
    }

    // Common emojis
    const emojis = [
      '😀', '😂', '🥰', '😍', '🤔', '😎', '🙄', '😴',
      '👍', '👎', '👌', '✌️', '🤝', '👏', '🙏', '💪',
      '❤️', '💔', '💯', '🔥', '⭐', '✨', '🎉', '🎊',
      '👋', '🤗', '🤦', '🤷', '😅', '🙃', '😊', '☺️'
    ]

    // Create emoji picker
    const picker = document.createElement('div')
    picker.id = 'emojiPicker'
    picker.className = 'emoji-picker'
    picker.innerHTML = `
      <div class="emoji-picker-header">
        <span>Choose an emoji</span>
        <button class="emoji-close" onclick="this.closest('.emoji-picker').remove()">×</button>
      </div>
      <div class="emoji-grid">
        ${emojis.map(emoji => `<button class="emoji-btn" onclick="insertEmoji('${emoji}')">${emoji}</button>`).join('')}
      </div>
    `

    // Position and show picker
    const inputContainer = document.querySelector('.input-container')
    inputContainer.appendChild(picker)

    // Prevent clicks inside picker from closing it
    picker.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    // Animate in
    setTimeout(() => picker.classList.add('show'), 10)
  }

  // Attach Button Functionality
  setupAttachButton() {
    const attachBtn = document.querySelector('.input-btn[title="Attach"]')
    if (!attachBtn) return

    attachBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      this.showAttachmentOptions()
      this.addButtonClickEffect(attachBtn)
    })

    // Close attach menu when clicking outside
    document.addEventListener('click', (e) => {
      const attachMenu = document.getElementById('attachMenu')
      if (attachMenu && !attachMenu.contains(e.target) && !attachBtn.contains(e.target)) {
        attachMenu.remove()
      }
    })
  }

  showAttachmentOptions() {
    // Remove existing menu
    const existingMenu = document.getElementById('attachMenu')
    if (existingMenu) {
      existingMenu.remove()
      return
    }

    // Create attachment menu
    const menu = document.createElement('div')
    menu.id = 'attachMenu'
    menu.className = 'attach-menu'
    menu.innerHTML = `
      <div class="attach-menu-header">
        <span>Attach</span>
        <button class="attach-close" onclick="this.closest('.attach-menu').remove()">×</button>
      </div>
      <div class="attach-options">
        <button class="attach-option" onclick="selectFile('image')">
          <i class="fas fa-image"></i>
          <span>Photos</span>
        </button>
        <button class="attach-option" onclick="selectFile('document')">
          <i class="fas fa-file"></i>
          <span>Document</span>
        </button>
        <button class="attach-option" onclick="selectFile('video')">
          <i class="fas fa-video"></i>
          <span>Video</span>
        </button>
        <button class="attach-option" onclick="selectFile('audio')">
          <i class="fas fa-music"></i>
          <span>Audio</span>
        </button>
      </div>
    `

    // Position and show menu
    const inputContainer = document.querySelector('.input-container')
    inputContainer.appendChild(menu)

    // Prevent clicks inside menu from closing it
    menu.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    // Animate in
    setTimeout(() => menu.classList.add('show'), 10)
  }

  // Voice Button Functionality
  setupVoiceButton() {
    const voiceBtn = document.getElementById('voiceBtn')
    if (!voiceBtn) return

    voiceBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      if (!voiceBtn._isRecording) {
        this.startVoiceRecording(voiceBtn)
      } else {
        this.stopVoiceRecording(voiceBtn)
      }
    })

    // Initialize recording state
    voiceBtn._isRecording = false
    voiceBtn._mediaRecorder = null
  }

  async startVoiceRecording(voiceBtn) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      voiceBtn._mediaRecorder = mediaRecorder
      voiceBtn._isRecording = true
      
      // UI changes
      voiceBtn.classList.add('recording')
      voiceBtn.innerHTML = '<i class="fas fa-stop"></i>'
      voiceBtn.title = 'Stop Recording'
      
      // Create recording indicator
      this.showRecordingIndicator()
      
      let chunks = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        this.handleVoiceMessage(blob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      this.startRecordingTimer()
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      this.showNotification('Microphone access denied', 'error')
    }
  }

  stopVoiceRecording(voiceBtn) {
    if (voiceBtn._mediaRecorder && voiceBtn._isRecording) {
      voiceBtn._mediaRecorder.stop()
      voiceBtn._isRecording = false
      
      // Reset UI
      voiceBtn.classList.remove('recording')
      voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>'
      voiceBtn.title = 'Voice Message'
      
      this.hideRecordingIndicator()
      this.stopRecordingTimer()
    }
  }

  showRecordingIndicator() {
    const indicator = document.createElement('div')
    indicator.id = 'recordingIndicator'
    indicator.className = 'recording-indicator'
    indicator.innerHTML = `
      <div class="recording-animation">
        <div class="recording-dot"></div>
        <span class="recording-text">Recording... <span class="recording-time">00:00</span></span>
      </div>
    `
    
    document.querySelector('.message-input-area').appendChild(indicator)
  }

  hideRecordingIndicator() {
    const indicator = document.getElementById('recordingIndicator')
    if (indicator) {
      indicator.remove()
    }
  }

  startRecordingTimer() {
    this.recordingTime = 0
    this.recordingTimer = setInterval(() => {
      this.recordingTime++
      const minutes = Math.floor(this.recordingTime / 60).toString().padStart(2, '0')
      const seconds = (this.recordingTime % 60).toString().padStart(2, '0')
      
      const timeDisplay = document.querySelector('.recording-time')
      if (timeDisplay) {
        timeDisplay.textContent = `${minutes}:${seconds}`
      }
    }, 1000)
  }

  stopRecordingTimer() {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer)
      this.recordingTimer = null
      this.recordingTime = 0
    }
  }

  handleVoiceMessage(audioBlob) {
    // Create audio URL for playback
    const audioUrl = URL.createObjectURL(audioBlob)
    
    // Add voice message to chat immediately
    this.addVoiceMessageToChat(audioBlob, audioUrl)
    
    // Show success notification
    this.showNotification('Voice message sent!', 'success')
    
    // In a real app, you would upload the audio blob to your server here
    console.log('Voice message recorded:', audioUrl, 'Size:', audioBlob.size, 'bytes')
  }

  addVoiceMessageToChat(audioBlob, audioUrl) {
    const messagesArea = document.getElementById('messagesArea')
    if (!messagesArea) return

    // Create voice message element
    const messageDiv = document.createElement('div')
    messageDiv.className = 'message sent'
    
    const duration = this.recordingTime || 0
    const minutes = Math.floor(duration / 60).toString().padStart(2, '0')
    const seconds = (duration % 60).toString().padStart(2, '0')
    
    messageDiv.innerHTML = `
      <div class="message-bubble voice-message">
        <div class="voice-message-content">
          <button class="voice-play-btn" onclick="toggleVoicePlayback(this, '${audioUrl}')">
            <i class="fas fa-play"></i>
          </button>
          <div class="voice-waveform">
            <div class="voice-duration">${minutes}:${seconds}</div>
            <div class="voice-progress">
              <div class="voice-progress-bar"></div>
            </div>
          </div>
        </div>
        <div class="message-meta">
          <span class="message-time">${this.getCurrentTime()}</span>
          <i class="fas fa-check-double message-status"></i>
        </div>
      </div>
    `
    
    // Add message with animation
    messageDiv.style.opacity = '0'
    messageDiv.style.transform = 'translateY(20px)'
    messagesArea.appendChild(messageDiv)
    
    setTimeout(() => {
      messageDiv.style.transition = 'all 0.3s ease'
      messageDiv.style.opacity = '1'
      messageDiv.style.transform = 'translateY(0)'
    }, 10)
    
    // Auto-scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight
    
    // Mark as read after animation
    setTimeout(() => {
      const status = messageDiv.querySelector('.message-status')
      if (status) {
        status.classList.add('read')
      }
    }, 1000)
  }

  getCurrentTime() {
    const now = new Date()
    let hours = now.getHours()
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
    return `${hours}:${minutes} ${ampm}`
  }

  // Input Helper Methods
  adjustInputHeight(input) {
    input.style.height = 'auto'
    input.style.height = Math.min(input.scrollHeight, 120) + 'px'
  }

  resetInputHeight(input) {
    input.style.height = 'auto'
  }

  handlePaste(e) {
    const items = e.clipboardData?.items
    if (!items) return

    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile()
        this.handleImageFile(file)
        e.preventDefault()
      }
    }
  }

  handleImageFile(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      // Show image preview (placeholder)
      this.showNotification('Image pasted! Ready to send.', 'info')
      console.log('Image file:', file)
    }
    reader.readAsDataURL(file)
  }
}

// Global functions for input functionality
function insertEmoji(emoji) {
  const messageInput = document.getElementById('messageInput')
  if (messageInput) {
    const cursorPos = messageInput.selectionStart
    const textBefore = messageInput.value.substring(0, cursorPos)
    const textAfter = messageInput.value.substring(messageInput.selectionEnd)
    
    messageInput.value = textBefore + emoji + textAfter
    messageInput.selectionStart = messageInput.selectionEnd = cursorPos + emoji.length
    
    // Trigger input event to update send button state
    messageInput.dispatchEvent(new Event('input'))
    messageInput.focus()
  }
  
  // Close emoji picker
  const picker = document.getElementById('emojiPicker')
  if (picker) picker.remove()
}

// Global function for voice message playback
function toggleVoicePlayback(button, audioUrl) {
  const icon = button.querySelector('i')
  const progressBar = button.closest('.voice-message-content').querySelector('.voice-progress-bar')
  
  // Check if audio is already playing
  if (button._audio && !button._audio.paused) {
    // Pause audio
    button._audio.pause()
    icon.className = 'fas fa-play'
    if (button._animationFrame) {
      cancelAnimationFrame(button._animationFrame)
    }
    return
  }
  
  // Create or reuse audio element
  if (!button._audio) {
    button._audio = new Audio(audioUrl)
    
    button._audio.addEventListener('ended', () => {
      icon.className = 'fas fa-play'
      progressBar.style.width = '0%'
      if (button._animationFrame) {
        cancelAnimationFrame(button._animationFrame)
      }
    })
    
    button._audio.addEventListener('error', (e) => {
      console.error('Error playing voice message:', e)
      icon.className = 'fas fa-play'
      showNotification('Error playing voice message', 'error')
    })
  }
  
  // Play audio
  button._audio.play().then(() => {
    icon.className = 'fas fa-pause'
    
    // Update progress bar
    const updateProgress = () => {
      if (button._audio && !button._audio.paused) {
        const progress = (button._audio.currentTime / button._audio.duration) * 100
        progressBar.style.width = progress + '%'
        button._animationFrame = requestAnimationFrame(updateProgress)
      }
    }
    updateProgress()
  }).catch((e) => {
    console.error('Error playing voice message:', e)
    showNotification('Error playing voice message', 'error')
  })
}

// Notification system
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div')
  notification.className = `notification ${type}`
  
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `
  
  document.body.appendChild(notification)
  
  // Show notification
  setTimeout(() => notification.classList.add('show'), 100)
  
  // Auto remove
  setTimeout(() => {
    notification.classList.remove('show')
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 300)
  }, duration)
}

function selectFile(type) {
  // Create file input dynamically
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.style.display = 'none'
  
  // Set accept types based on selection
  switch(type) {
    case 'image':
      fileInput.accept = 'image/*'
      break
    case 'document':
      fileInput.accept = '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx'
      break
    case 'video':
      fileInput.accept = 'video/*'
      break
    case 'audio':
      fileInput.accept = 'audio/*'
      break
  }
  
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file, type)
    }
  })
  
  document.body.appendChild(fileInput)
  fileInput.click()
  document.body.removeChild(fileInput)
  
  // Close attach menu
  const menu = document.getElementById('attachMenu')
  if (menu) menu.remove()
}

function handleFileUpload(file, type) {
  // File size validation (10MB limit)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    showNotification('File size must be less than 10MB', 'error')
    return
  }
  
  // Show upload progress
  showFileUploadProgress(file)
  
  // Simulate file upload (replace with actual upload logic)
  setTimeout(() => {
    showNotification(`${type} uploaded successfully!`, 'success')
    console.log('File uploaded:', file)
  }, 2000)
}

function showFileUploadProgress(file) {
  const progress = document.createElement('div')
  progress.className = 'file-upload-progress'
  progress.innerHTML = `
    <div class="upload-info">
      <i class="fas fa-file"></i>
      <span class="file-name">${file.name}</span>
      <span class="file-size">${formatFileSize(file.size)}</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill"></div>
    </div>
    <button class="cancel-upload" onclick="this.closest('.file-upload-progress').remove()">
      <i class="fas fa-times"></i>
    </button>
  `
  
  const messagesArea = document.getElementById('messagesArea')
  messagesArea.appendChild(progress)
  
  // Animate progress
  const progressFill = progress.querySelector('.progress-fill')
  let width = 0
  const interval = setInterval(() => {
    width += 5
    progressFill.style.width = width + '%'
    
    if (width >= 100) {
      clearInterval(interval)
      setTimeout(() => progress.remove(), 1000)
    }
  }, 100)
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">×</button>
    </div>
  `
  
  // Add to document
  document.body.appendChild(notification)
  
  // Show notification
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)
  
  // Auto hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
  
  // Close button functionality
  notification.querySelector(".notification-close").addEventListener("click", () => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  })
}

// Global functions for popup handling
function closeCommunititesPopup() {
  const popup = document.getElementById("communitiesPopup")
  if (popup) {
    popup.classList.remove("active")
    popup.classList.add("closing")
    setTimeout(() => {
      popup.classList.remove("closing")
    }, 300)
  }
}

function closeStatusPopup() {
  const popup = document.getElementById("statusPopup")
  if (popup) {
    popup.classList.remove("active")
    popup.classList.add("closing")
    setTimeout(() => {
      popup.classList.remove("closing")
    }, 300)
  }
}

// Initialize on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme manager
  new ChatThemeManager()
  
  // Initialize chat functionality
  new ChatManager()
})