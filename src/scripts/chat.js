/**
 * TranslaTalk Chat Manager
 * WhatsApp-style Chat Application for Real-time Communication
 * 
 * Features:
 * - Real-time messaging
 * - Contact management
 * - Message translation
 * - Voice recording
 * - File attachments
 * - Typing indicators
 * - Message status (sent, delivered, read)
 */

class TranslaTalkChatManager {
  // ============================================================================
  // INITIALIZATION & CONSTRUCTOR
  // ============================================================================
  
  constructor() {
    this.currentContact = null;
    this.messages = JSON.parse(localStorage.getItem("translaTalkMessages") || "{}");
    this.contacts = this.initializeContacts();
    this.isTyping = false;
    this.isRecording = false;
    this.typingTimeout = null;
    this.currentUser = this.getCurrentUser();
    this.init();
  }

  init() {
    this.setupChatSelection();
    this.setupMessageInput();
    this.setupChatActions();
    this.setupHeaderActions();
    this.setupSearchFunctionality();
    this.setupFilterTabs();
    this.setupVoiceRecording();
    this.setupProfileDropdown();
    this.loadMessages();
    this.simulateIncomingMessages();

    // Select first contact by default
    if (this.contacts.length > 0) {
      this.selectContact(this.contacts[0]);
    }
  }

  // ============================================================================
  // DATA INITIALIZATION
  // ============================================================================

  getCurrentUser() {
    return {
      id: 'current-user',
      name: 'You',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    };
  }

  initializeContacts() {
    return [
      {
        id: 1,
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        status: "online",
        lastMessage: "Hey! How are you doing? 😊",
        lastMessageTime: "2:30 PM",
        unreadCount: 2,
        lastSeen: "last seen today at 2:28 PM"
      },
      {
        id: 2,
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        status: "away",
        lastMessage: "Thanks for the help with the project!",
        lastMessageTime: "1:15 PM",
        unreadCount: 0,
        lastSeen: "last seen today at 1:15 PM"
      },
      {
        id: 3,
        name: "Design Team",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        status: "offline",
        lastMessage: "Alex: New mockups are ready for review",
        lastMessageTime: "11:45 AM",
        unreadCount: 3,
        lastSeen: "last seen today at 11:45 AM"
      },
      {
        id: 4,
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        status: "offline",
        lastMessage: "See you at the meeting tomorrow",
        lastMessageTime: "Yesterday",
        unreadCount: 0,
        lastSeen: "last seen yesterday at 5:30 PM"
      },
      {
        id: 5,
        name: "James Rodriguez",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        status: "online",
        lastMessage: "¡Hola! ¿Cómo estás? 👋",
        lastMessageTime: "Tuesday",
        unreadCount: 0,
        lastSeen: "last seen Tuesday at 3:45 PM"
      },
      {
        id: 6,
        name: "Lisa Park",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        status: "away",
        lastMessage: "Great work on the presentation! 🎉",
        lastMessageTime: "Monday",
        unreadCount: 0,
        lastSeen: "last seen Monday at 6:20 PM"
      },
      {
        id: 7,
        name: "David Thompson",
        avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        status: "offline",
        lastMessage: "Let's catch up soon!",
        lastMessageTime: "Sunday",
        unreadCount: 0,
        lastSeen: "last seen Sunday at 4:15 PM"
      }
    ];
  }

  getDefaultMessages(contactId) {
    const defaultMessages = {
      1: [
        {
          id: 1,
          text: "Hey! How are you doing? 😊",
          time: "2:30 PM",
          type: "received",
          translated: false
        },
        {
          id: 2,
          text: "I'm doing great! Just working on some new designs. How about you?",
          time: "2:32 PM",
          type: "sent",
          status: "read"
        },
        {
          id: 3,
          text: "That sounds exciting! I'd love to see them when you're ready to share.",
          time: "2:35 PM",
          type: "received",
          translated: true,
          originalLanguage: "Spanish"
        },
        {
          id: 4,
          text: "Sure! I'll send them over once I finish the final touches.",
          time: "2:38 PM",
          type: "sent",
          status: "read"
        }
      ],
      2: [
        {
          id: 1,
          text: "Thanks for the help with the project!",
          time: "1:15 PM",
          type: "received"
        },
        {
          id: 2,
          text: "You're welcome! Let me know if you need anything else.",
          time: "1:16 PM",
          type: "sent",
          status: "read"
        },
        {
          id: 3,
          text: "Actually, I have a question about the API implementation",
          time: "1:18 PM",
          type: "received"
        },
        {
          id: 4,
          text: "Sure, what's the question?",
          time: "1:19 PM",
          type: "sent",
          status: "read"
        }
      ],
      3: [
        {
          id: 1,
          text: "New mockups are ready for review",
          time: "11:45 AM",
          type: "received",
          sender: "Alex"
        },
        {
          id: 2,
          text: "Great! I'll take a look at them this afternoon.",
          time: "11:47 AM",
          type: "sent",
          status: "read"
        },
        {
          id: 3,
          text: "The color scheme looks amazing! 🎨",
          time: "11:50 AM",
          type: "received",
          sender: "Maria"
        }
      ],
      4: [
        {
          id: 1,
          text: "See you at the meeting tomorrow",
          time: "Yesterday",
          type: "received"
        },
        {
          id: 2,
          text: "See you there! 👍",
          time: "Yesterday",
          type: "sent",
          status: "delivered"
        }
      ],
      5: [
        {
          id: 1,
          text: "¡Hola! ¿Cómo estás? 👋",
          time: "Tuesday",
          type: "received",
          translated: true,
          originalLanguage: "Spanish"
        },
        {
          id: 2,
          text: "¡Hola James! Estoy bien, gracias. ¿Y tú?",
          time: "Tuesday",
          type: "sent",
          status: "read"
        },
        {
          id: 3,
          text: "Muy bien, trabajando en el nuevo proyecto",
          time: "Tuesday",
          type: "received",
          translated: true,
          originalLanguage: "Spanish"
        }
      ],
      6: [
        {
          id: 1,
          text: "Great work on the presentation! 🎉",
          time: "Monday",
          type: "received"
        },
        {
          id: 2,
          text: "Thank you! I'm glad it went well.",
          time: "Monday",
          type: "sent",
          status: "read"
        },
        {
          id: 3,
          text: "The client was really impressed with the design concepts",
          time: "Monday",
          type: "received"
        }
      ],
      7: [
        {
          id: 1,
          text: "Let's catch up soon!",
          time: "Sunday",
          type: "received"
        },
        {
          id: 2,
          text: "Absolutely! How about coffee this weekend?",
          time: "Sunday",
          type: "sent",
          status: "read"
        },
        {
          id: 3,
          text: "Sounds perfect! Saturday afternoon works for me ☕",
          time: "Sunday",
          type: "received"
        }
      ]
    };

    return defaultMessages[contactId] || [];
  }

  // ============================================================================
  // CONTACT & CHAT MANAGEMENT
  // ============================================================================

  selectContact(contact) {
    this.currentContact = contact;
    this.updateChatHeader(contact);
    this.loadContactMessages(contact);
    this.markAsRead(contact);
  }

  updateChatHeader(contact) {
    const contactName = document.querySelector('.chat-window-header .contact-name');
    const contactStatus = document.querySelector('.chat-window-header .contact-status');
    const contactAvatar = document.querySelector('.chat-window-header .contact-avatar img');

    if (contactName) contactName.textContent = contact.name;
    if (contactStatus) contactStatus.textContent = contact.lastSeen;
    if (contactAvatar) contactAvatar.src = contact.avatar;
  }

  loadContactMessages(contact) {
    const messagesArea = document.getElementById('messagesArea');
    if (!messagesArea) return;

    // Clear existing messages except date separator and typing indicator
    const existingMessages = messagesArea.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Load messages for this contact
    const contactMessages = this.messages[contact.id] || this.getDefaultMessages(contact.id);
    
    // Insert messages before typing indicator
    const typingIndicator = messagesArea.querySelector('.typing-indicator');
    
    contactMessages.forEach(message => {
      const messageElement = this.createMessageElement(message);
      messagesArea.insertBefore(messageElement, typingIndicator);
    });

    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  markAsRead(contact) {
    const chatItems = document.querySelectorAll('.chat-item');
    const contactIndex = this.contacts.findIndex(c => c.id === contact.id);
    
    if (contactIndex !== -1 && chatItems[contactIndex]) {
      const unreadBadge = chatItems[contactIndex].querySelector('.unread-count');
      if (unreadBadge) {
        unreadBadge.style.display = 'none';
      }
    }
    
    // Update contact object
    contact.unreadCount = 0;
  }

  // ============================================================================
  // MESSAGE HANDLING
  // ============================================================================

  createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.type}`;
    messageDiv.setAttribute('data-message-id', message.id);
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    const textP = document.createElement('p');
    textP.className = 'message-text';
    textP.textContent = message.text;
    
    const metaDiv = document.createElement('div');
    metaDiv.className = 'message-meta';
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = message.time;
    
    metaDiv.appendChild(timeSpan);
    
    if (message.type === 'sent' && message.status) {
      const statusIcon = document.createElement('i');
      statusIcon.className = `fas fa-check-double message-status ${message.status === 'read' ? 'read' : ''}`;
      metaDiv.appendChild(statusIcon);
    }
    
    bubbleDiv.appendChild(textP);
    bubbleDiv.appendChild(metaDiv);
    
    if (message.translated) {
      const translateDiv = document.createElement('div');
      translateDiv.className = 'translate-indicator';
      translateDiv.innerHTML = `
        <i class="fas fa-language"></i>
        <span>Translated from ${message.originalLanguage}</span>
      `;
      bubbleDiv.appendChild(translateDiv);
    }
    
    messageDiv.appendChild(bubbleDiv);
    
    return messageDiv;
  }

  sendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput || !this.currentContact) return;
    
    const text = messageInput.value.trim();
    if (!text) return;
    
    const message = {
      id: Date.now(),
      text: text,
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      type: 'sent',
      status: 'sent'
    };
    
    // Add to messages
    if (!this.messages[this.currentContact.id]) {
      this.messages[this.currentContact.id] = [];
    }
    this.messages[this.currentContact.id].push(message);
    
    // Save to localStorage
    localStorage.setItem('translaTalkMessages', JSON.stringify(this.messages));
    
    // Add to UI
    const messagesArea = document.getElementById('messagesArea');
    const typingIndicator = messagesArea.querySelector('.typing-indicator');
    const messageElement = this.createMessageElement(message);
    messagesArea.insertBefore(messageElement, typingIndicator);
    
    // Clear input
    messageInput.value = '';
    
    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
    
    // Update chat list
    this.updateChatListItem(this.currentContact.id, text);
    
    // Simulate message status update
    setTimeout(() => {
      message.status = 'delivered';
      this.updateMessageStatus(message.id, 'delivered');
    }, 1000);
    
    setTimeout(() => {
      message.status = 'read';
      this.updateMessageStatus(message.id, 'read');
    }, 3000);
  }

  // Add translation functionality to incoming messages
  async handleIncomingMessage(message) {
    // Check if auto-translate is enabled
    if (window.translationService && window.translationService.enabled) {
      try {
        const translatedText = await window.translationService.translateMessage(message.text);
        message.originalText = message.text;
        message.translatedText = translatedText;
        message.isTranslated = true;
      } catch (error) {
        console.error('Translation failed:', error);
      }
    }
    
    return message;
  }

  // Enhanced message creation with translation support
  createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.type}`;
    messageDiv.setAttribute('data-message-id', message.id);
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    const textP = document.createElement('p');
    textP.className = 'message-text';
    
    // Show translated text if available
    if (message.isTranslated && message.translatedText) {
      textP.textContent = message.translatedText;
      
      // Add translation indicator
      const translateIndicator = document.createElement('div');
      translateIndicator.className = 'translate-indicator';
      translateIndicator.innerHTML = `
        <i class="fas fa-language"></i>
        <span>Translated</span>
        <button class="show-original-btn" onclick="toggleOriginalText('${message.id}')">
          <i class="fas fa-eye"></i>
        </button>
      `;
      bubbleDiv.appendChild(translateIndicator);
      
      // Store original text for toggle functionality
      textP.setAttribute('data-original', message.originalText);
      textP.setAttribute('data-translated', message.translatedText);
    } else {
      textP.textContent = message.text;
    }
    
    bubbleDiv.appendChild(textP);
    
    const metaDiv = document.createElement('div');
    metaDiv.className = 'message-meta';
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = message.time;
    metaDiv.appendChild(timeSpan);
    
    if (message.type === 'sent') {
      const statusIcon = document.createElement('i');
      statusIcon.className = `fas fa-check-double message-status ${message.status === 'read' ? 'read' : ''}`;
      metaDiv.appendChild(statusIcon);
    }
    
    bubbleDiv.appendChild(metaDiv);
    messageDiv.appendChild(bubbleDiv);
    
    return messageDiv;
  }

  updateMessageStatus(messageId, status) {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
      const statusIcon = messageElement.querySelector('.message-status');
      if (statusIcon) {
        if (status === 'read') {
          statusIcon.classList.add('read');
        }
      }
    }
  }

  updateChatListItem(contactId, lastMessage) {
    const chatItems = document.querySelectorAll('.chat-item');
    const contactIndex = this.contacts.findIndex(c => c.id === contactId);
    
    if (contactIndex !== -1 && chatItems[contactIndex]) {
      const messagePreview = chatItems[contactIndex].querySelector('.message-preview span');
      const chatTime = chatItems[contactIndex].querySelector('.chat-time');
      
      if (messagePreview) messagePreview.textContent = lastMessage;
      if (chatTime) chatTime.textContent = 'now';
    }
  }

  handleTyping() {
    if (!this.isTyping) {
      this.isTyping = true;
      // Could send typing indicator to server here
    }
    
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;
      // Could send stop typing indicator to server here
    }, 1000);
  }

  async simulateIncomingMessage() {
    const randomContact = this.contacts[Math.floor(Math.random() * this.contacts.length)];
    const randomMessages = [
      "Hey, are you free to chat?",
      "Just wanted to check in on you 😊",
      "Did you see the latest update?",
      "Thanks for your help earlier!",
      "Let's catch up soon!",
      "Hola, ¿cómo estás?",
      "Bonjour, comment allez-vous?",
      "Guten Tag, wie geht es Ihnen?",
      "こんにちは、元気ですか？",
      "안녕하세요, 어떻게 지내세요?",
      "Привет, как дела?",
      "Ciao, come stai?",
      "Olá, como vai?",
      "مرحبا، كيف حالك؟",
      "नमस्ते, आप कैसे हैं?"
    ];
    
    let message = {
      id: Date.now(),
      text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      type: 'received'
    };
    
    // Apply translation if enabled
    message = await this.handleIncomingMessage(message);
    
    // Add to messages
    if (!this.messages[randomContact.id]) {
      this.messages[randomContact.id] = [];
    }
    this.messages[randomContact.id].push(message);
    
    // Save to localStorage
    localStorage.setItem('translaTalkMessages', JSON.stringify(this.messages));
    
    // Update UI if this is the current contact
    if (this.currentContact && this.currentContact.id === randomContact.id) {
      const messagesArea = document.getElementById('messagesArea');
      const typingIndicator = messagesArea.querySelector('.typing-indicator');
      const messageElement = this.createMessageElement(message);
      messagesArea.insertBefore(messageElement, typingIndicator);
      messagesArea.scrollTop = messagesArea.scrollHeight;
    }
    
    // Update chat list
    this.updateChatListItem(randomContact.id, message.text);
    
    // Show notification
    this.showNotification(`New message from ${randomContact.name}`, 'info');
  }

  // ============================================================================
  // EVENT SETUP METHODS
  // ============================================================================

  setupChatSelection() {
    const chatItems = document.querySelectorAll('.chat-item');
    
    chatItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        // Remove active class from all items
        chatItems.forEach(chat => chat.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
        
        // Select the contact
        this.selectContact(this.contacts[index]);
      });
    });
  }

  setupMessageInput() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    
    if (messageInput) {
      messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
      
      messageInput.addEventListener('input', () => {
        this.handleTyping();
      });
    }
    
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        this.sendMessage();
      });
    }
  }

  setupChatActions() {
    const searchBtn = document.querySelector('.chat-actions .action-btn[title="Search"]');
    const voiceBtn = document.querySelector('.chat-actions .action-btn[title="Voice Call"]');
    const videoBtn = document.querySelector('.chat-actions .action-btn[title="Video Call"]');
    const moreBtn = document.querySelector('.chat-actions .action-btn[title="More"]');
    
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.showNotification('Search functionality coming soon!', 'info');
      });
    }
    
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        this.showNotification(`Starting voice call with ${this.currentContact?.name || 'contact'}...`, 'info');
      });
    }
    
    if (videoBtn) {
      videoBtn.addEventListener('click', () => {
        this.showNotification(`Starting video call with ${this.currentContact?.name || 'contact'}...`, 'info');
      });
    }
    
    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        this.showContactOptions();
      });
    }
    
    // Input actions
    const emojiBtn = document.querySelector('.input-btn[title="Emoji"]');
    const attachBtn = document.querySelector('.input-btn[title="Attach"]');
    
    if (emojiBtn) {
      emojiBtn.addEventListener('click', () => {
        this.showEmojiPicker();
      });
    }
    
    if (attachBtn) {
      attachBtn.addEventListener('click', () => {
        this.showAttachmentOptions();
      });
    }
  }

  setupHeaderActions() {
    console.log('Setting up header actions...');
    const communitiesBtn = document.querySelector('.header-btn[title="Communities"]');
    const statusBtn = document.querySelector('.header-btn[title="Status"]');
    const newChatBtn = document.querySelector('.header-btn[title="New Chat"]');
    const menuBtn = document.querySelector('.header-btn[title="Menu"]');
    
    console.log('Header buttons found:', { communitiesBtn, statusBtn, newChatBtn, menuBtn });
    
    if (communitiesBtn) {
      communitiesBtn.addEventListener('click', () => {
        console.log('Communities button clicked');
        this.showNotification('Communities feature coming soon!', 'info');
      });
    }
    
    if (statusBtn) {
      statusBtn.addEventListener('click', () => {
        console.log('Status button clicked');
        this.showNotification('Status updates coming soon!', 'info');
      });
    }
    
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => {
        console.log('New chat button clicked');
        this.showNewChatDialog();
      });
    }
    
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        console.log('Menu button clicked');
        this.showMainMenu();
      });
    }
  }

  setupSearchFunctionality() {
    console.log('Setting up search functionality...');
    const searchInput = document.querySelector('.search-input');
    
    console.log('Search input found:', searchInput);
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        console.log('Search term:', searchTerm);
        this.filterChats(searchTerm);
      });
    } else {
      console.error('Search input not found');
    }
  }

  setupFilterTabs() {
    console.log('Setting up filter tabs...');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    console.log('Filter buttons found:', filterButtons.length);
    
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        console.log('Filter button clicked:', btn.textContent);
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.textContent.toLowerCase();
        this.applyFilter(filter);
      });
    });
  }

  setupVoiceRecording() {
    const voiceBtn = document.getElementById('voiceBtn');
    
    if (voiceBtn) {
      voiceBtn.addEventListener('mousedown', () => {
        this.startVoiceRecording();
      });
      
      voiceBtn.addEventListener('mouseup', () => {
        this.stopVoiceRecording();
      });
      
      voiceBtn.addEventListener('mouseleave', () => {
        this.stopVoiceRecording();
      });
    }
  }

  setupProfileDropdown() {
    console.log('Setting up profile dropdown...');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileDropdown = document.getElementById('profileDropdown');
    
    console.log('Profile elements found:', { profileAvatar, profileDropdown });
    
    if (profileAvatar && profileDropdown) {
      console.log('Adding click listener to profile avatar');
      // Toggle dropdown on avatar click
      profileAvatar.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Profile avatar clicked');
        profileDropdown.classList.toggle('show');
        console.log('Dropdown classes:', profileDropdown.classList.toString());
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!profileAvatar.contains(e.target) && !profileDropdown.contains(e.target)) {
          profileDropdown.classList.remove('show');
        }
      });
      
      // Handle dropdown item clicks
      const dropdownItems = profileDropdown.querySelectorAll('.dropdown-item');
      console.log('Found dropdown items:', dropdownItems.length);
      dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = item.dataset.action;
          console.log('Profile action clicked:', action);
          this.handleProfileAction(action);
          profileDropdown.classList.remove('show');
        });
      });
    } else {
      console.error('Profile dropdown elements not found:', { profileAvatar, profileDropdown });
    }
  }

  // ============================================================================
  // FILTER & SEARCH FUNCTIONALITY
  // ============================================================================

  filterChats(searchTerm) {
    const chatItems = document.querySelectorAll('.chat-item');
    
    chatItems.forEach((item, index) => {
      const contact = this.contacts[index];
      const contactName = contact.name.toLowerCase();
      const lastMessage = contact.lastMessage.toLowerCase();
      
      if (contactName.includes(searchTerm) || lastMessage.includes(searchTerm)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  applyFilter(filter) {
    const chatItems = document.querySelectorAll('.chat-item');
    
    chatItems.forEach((item, index) => {
      const contact = this.contacts[index];
      let show = true;
      
      switch (filter) {
        case 'unread':
          show = contact.unreadCount > 0;
          break;
        case 'favorites':
          show = contact.isFavorite || false;
          break;
        case 'groups':
          show = contact.isGroup || contact.name.includes('Team');
          break;
        case 'all':
        default:
          show = true;
          break;
      }
      
      item.style.display = show ? 'flex' : 'none';
    });
  }

  // ============================================================================
  // VOICE RECORDING
  // ============================================================================

  startVoiceRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      const voiceBtn = document.getElementById('voiceBtn');
      voiceBtn.classList.add('recording');
      this.showNotification('Voice recording started (hold to record)', 'info');
    }
  }

  stopVoiceRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      const voiceBtn = document.getElementById('voiceBtn');
      voiceBtn.classList.remove('recording');
      this.showNotification('Voice recording stopped', 'info');
    }
  }

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================

  handleProfileAction(action) {
    switch(action) {
      case 'profile':
        this.showNotification('Opening profile page...', 'info');
        setTimeout(() => {
          window.location.href = '/template/profile.html';
        }, 1000);
        break;
      case 'settings':
        this.showNotification('Opening settings page...', 'info');
        setTimeout(() => {
          window.location.href = '/template/settings.html';
        }, 1000);
        break;
      case 'help':
        this.showNotification('Opening help page...', 'info');
        setTimeout(() => {
          window.location.href = '/template/help.html';
        }, 1000);
        break;
      case 'logout':
        this.showNotification('Logging out...', 'info');
        setTimeout(() => {
          localStorage.removeItem('translaTalkMessages');
          window.location.href = '/template/login.html';
        }, 1000);
        break;
      default:
        this.showNotification('Feature coming soon!', 'info');
    }
  }

  handleContactAction(action) {
    switch(action) {
      case 'block':
        this.showNotification(`${this.currentContact?.name || 'Contact'} blocked`, 'info');
        break;
      case 'mute':
        this.showNotification(`${this.currentContact?.name || 'Contact'} muted`, 'info');
        break;
      case 'clear':
        this.clearChat();
        break;
      case 'export':
        this.exportChat();
        break;
      default:
        this.showNotification('Action not implemented yet', 'info');
    }
  }

  handleMenuAction(action) {
    switch(action) {
      case 'profile':
        window.location.href = '/template/profile.html';
        break;
      case 'settings':
        window.location.href = '/template/settings.html';
        break;
      case 'help':
        window.location.href = '/template/help.html';
        break;
      case 'logout':
        this.logout();
        break;
      default:
        this.showNotification('Feature coming soon!', 'info');
    }
  }

  // ============================================================================
  // POPUP DIALOGS
  // ============================================================================

  showEmojiPicker() {
    const commonEmojis = ['😊', '😂', '❤️', '👍', '👎', '😍', '🤔', '😢', '😡', '🎉', '🔥', '💯'];
    const emojiList = commonEmojis.map(emoji => `<span class="emoji-option" data-emoji="${emoji}">${emoji}</span>`).join('');
    
    const popup = document.createElement('div');
    popup.className = 'emoji-picker-popup';
    popup.innerHTML = `
      <div class="emoji-picker-content">
        <h4>Choose an emoji</h4>
        <div class="emoji-grid">
          ${emojiList}
        </div>
        <button class="close-popup">Close</button>
      </div>
    `;
    
    this.stylePopup(popup);
    document.body.appendChild(popup);
    
    // Handle emoji selection
    popup.querySelectorAll('.emoji-option').forEach(emoji => {
      emoji.addEventListener('click', () => {
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
          messageInput.value += emoji.dataset.emoji;
          messageInput.focus();
        }
        document.body.removeChild(popup);
      });
    });
    
    this.setupPopupClose(popup);
  }

  showAttachmentOptions() {
    const popup = document.createElement('div');
    popup.className = 'attachment-popup';
    popup.innerHTML = `
      <div class="attachment-content">
        <h4>Attach</h4>
        <div class="attachment-options">
          <button class="attachment-option" data-type="document">
            <i class="fas fa-file"></i>
            <span>Document</span>
          </button>
          <button class="attachment-option" data-type="photo">
            <i class="fas fa-image"></i>
            <span>Photo</span>
          </button>
          <button class="attachment-option" data-type="camera">
            <i class="fas fa-camera"></i>
            <span>Camera</span>
          </button>
          <button class="attachment-option" data-type="contact">
            <i class="fas fa-user"></i>
            <span>Contact</span>
          </button>
        </div>
        <button class="close-popup">Close</button>
      </div>
    `;
    
    this.stylePopup(popup);
    document.body.appendChild(popup);
    
    // Handle attachment selection
    popup.querySelectorAll('.attachment-option').forEach(option => {
      option.addEventListener('click', () => {
        const type = option.dataset.type;
        this.showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} attachment coming soon!`, 'info');
        document.body.removeChild(popup);
      });
    });
    
    this.setupPopupClose(popup);
  }

  showContactOptions() {
    const popup = document.createElement('div');
    popup.className = 'contact-options-popup';
    popup.innerHTML = `
      <div class="contact-options-content">
        <h4>${this.currentContact?.name || 'Contact'} Options</h4>
        <div class="contact-options">
          <button class="contact-option" data-action="block">
            <i class="fas fa-ban"></i>
            <span>Block Contact</span>
          </button>
          <button class="contact-option" data-action="mute">
            <i class="fas fa-volume-mute"></i>
            <span>Mute Notifications</span>
          </button>
          <button class="contact-option" data-action="clear">
            <i class="fas fa-trash"></i>
            <span>Clear Chat</span>
          </button>
          <button class="contact-option" data-action="export">
            <i class="fas fa-download"></i>
            <span>Export Chat</span>
          </button>
        </div>
        <button class="close-popup">Close</button>
      </div>
    `;
    
    this.stylePopup(popup);
    document.body.appendChild(popup);
    
    // Handle option selection
    popup.querySelectorAll('.contact-option').forEach(option => {
      option.addEventListener('click', () => {
        const action = option.dataset.action;
        this.handleContactAction(action);
        document.body.removeChild(popup);
      });
    });
    
    this.setupPopupClose(popup);
  }

  showNewChatDialog() {
    const popup = document.createElement('div');
    popup.className = 'new-chat-popup';
    popup.innerHTML = `
      <div class="new-chat-content">
        <h4>Start New Chat</h4>
        <div class="new-chat-options">
          <button class="new-chat-option" data-action="contact">
            <i class="fas fa-user"></i>
            <span>New Contact</span>
          </button>
          <button class="new-chat-option" data-action="group">
            <i class="fas fa-users"></i>
            <span>New Group</span>
          </button>
          <button class="new-chat-option" data-action="broadcast">
            <i class="fas fa-bullhorn"></i>
            <span>New Broadcast</span>
          </button>
        </div>
        <button class="close-popup">Close</button>
      </div>
    `;
    
    this.stylePopup(popup);
    document.body.appendChild(popup);
    
    // Handle option selection
    popup.querySelectorAll('.new-chat-option').forEach(option => {
      option.addEventListener('click', () => {
        const action = option.dataset.action;
        this.showNotification(`${action.charAt(0).toUpperCase() + action.slice(1)} feature coming soon!`, 'info');
        document.body.removeChild(popup);
      });
    });
    
    this.setupPopupClose(popup);
  }

  showMainMenu() {
    const popup = document.createElement('div');
    popup.className = 'main-menu-popup';
    popup.innerHTML = `
      <div class="main-menu-content">
        <h4>TranslaTalk Menu</h4>
        <div class="menu-options">
          <button class="menu-option" data-action="profile">
            <i class="fas fa-user"></i>
            <span>Profile</span>
          </button>
          <button class="menu-option" data-action="settings">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
          </button>
          <button class="menu-option" data-action="help">
            <i class="fas fa-question-circle"></i>
            <span>Help</span>
          </button>
          <button class="menu-option" data-action="logout">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
        <button class="close-popup">Close</button>
      </div>
    `;
    
    this.stylePopup(popup);
    document.body.appendChild(popup);
    
    // Handle option selection
    popup.querySelectorAll('.menu-option').forEach(option => {
      option.addEventListener('click', () => {
        const action = option.dataset.action;
        this.handleMenuAction(action);
        document.body.removeChild(popup);
      });
    });
    
    this.setupPopupClose(popup);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  stylePopup(popup) {
    Object.assign(popup.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '10000'
    });
  }

  setupPopupClose(popup) {
    // Handle close button
    const closeBtn = popup.querySelector('.close-popup');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(popup);
      });
    }
    
    // Handle click outside
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        document.body.removeChild(popup);
      }
    });
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 24px',
      borderRadius: '8px',
      color: 'white',
      backgroundColor: type === 'info' ? '#667eea' : '#ff4444',
      zIndex: '9999',
      fontSize: '14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      animation: 'slideInRight 0.3s ease'
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // ============================================================================
  // CHAT MANAGEMENT ACTIONS
  // ============================================================================

  clearChat() {
    if (this.currentContact) {
      this.messages[this.currentContact.id] = [];
      localStorage.setItem('translaTalkMessages', JSON.stringify(this.messages));
      this.loadContactMessages(this.currentContact);
      this.showNotification('Chat cleared', 'info');
    }
  }

  exportChat() {
    if (this.currentContact) {
      const messages = this.messages[this.currentContact.id] || [];
      const chatData = {
        contact: this.currentContact.name,
        messages: messages,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat_${this.currentContact.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      this.showNotification('Chat exported successfully', 'info');
    }
  }

  logout() {
    localStorage.removeItem('translaTalkMessages');
    this.showNotification('Logged out successfully', 'info');
    setTimeout(() => {
      window.location.href = '/template/login.html';
    }, 1000);
  }

  loadMessages() {
    // Messages are loaded when a contact is selected
    console.log('Chat messages loaded from localStorage');
  }

  simulateIncomingMessages() {
    // Simulate receiving messages every 30 seconds
    setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance
        this.simulateIncomingMessage();
      }
    }, 30000);
  }
}

// ============================================================================
// INITIALIZATION & STYLES
// ============================================================================

// Global function for toggling original text
function toggleOriginalText(messageId) {
  const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
  if (messageElement) {
    const textElement = messageElement.querySelector('.message-text');
    const originalText = textElement.getAttribute('data-original');
    const translatedText = textElement.getAttribute('data-translated');
    const currentText = textElement.textContent;
    
    if (currentText === translatedText) {
      textElement.textContent = originalText;
      const indicator = messageElement.querySelector('.translate-indicator span');
      if (indicator) indicator.textContent = 'Original';
    } else {
      textElement.textContent = translatedText;
      const indicator = messageElement.querySelector('.translate-indicator span');
      if (indicator) indicator.textContent = 'Translated';
    }
  }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.translaTalkChat = new TranslaTalkChatManager();
});

// Add CSS animations and styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .input-btn.recording {
    background: #ff4444 !important;
    animation: pulse 1s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Popup Styles */
  .emoji-picker-content, .attachment-content, .contact-options-content, .new-chat-content, .main-menu-content {
    background: var(--bg-glass, rgba(255,255,255,0.9));
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 24px;
    min-width: 300px;
    max-width: 90vw;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    border: 1px solid rgba(255,255,255,0.2);
  }

  .emoji-picker-content h4, .attachment-content h4, .contact-options-content h4, .new-chat-content h4, .main-menu-content h4 {
    margin: 0 0 16px 0;
    color: var(--text-primary, #333);
    font-size: 18px;
    font-weight: 600;
  }

  .emoji-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    margin-bottom: 16px;
  }

  .emoji-option {
    padding: 8px;
    font-size: 24px;
    cursor: pointer;
    border-radius: 8px;
    text-align: center;
    transition: all 0.2s ease;
  }

  .emoji-option:hover {
    background: var(--bg-secondary, rgba(0,0,0,0.05));
    transform: scale(1.1);
  }

  .attachment-options, .contact-options, .new-chat-options, .menu-options {
    display: grid;
    gap: 8px;
    margin-bottom: 16px;
  }

  .attachment-option, .contact-option, .new-chat-option, .menu-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--bg-secondary, rgba(0,0,0,0.05));
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-primary, #333);
  }

  .attachment-option:hover, .contact-option:hover, .new-chat-option:hover, .menu-option:hover {
    background: var(--primary-gradient, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
    color: white;
    transform: translateY(-2px);
  }

  .attachment-option i, .contact-option i, .new-chat-option i, .menu-option i {
    width: 20px;
    text-align: center;
  }

  .close-popup {
    width: 100%;
    padding: 12px;
    background: var(--bg-secondary, rgba(0,0,0,0.05));
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-primary, #333);
    font-weight: 500;
  }

  .close-popup:hover {
    background: var(--bg-tertiary, rgba(0,0,0,0.1));
  }
`;
document.head.appendChild(style);

console.log('Chat.js loaded successfully - Organized and optimized version');
