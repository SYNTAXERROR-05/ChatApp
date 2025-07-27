// Help Page JavaScript

class HelpPageManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupFAQInteractions();
        this.setupSearchFunctionality();
        this.setupAnimations();
        this.addRippleEffects();
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add animation to the toggle
            themeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1)';
            }, 100);
        });
    }

    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const headerNav = document.querySelector('.header-nav');
        
        if (!mobileMenuToggle || !headerNav) return;

        mobileMenuToggle.addEventListener('click', () => {
            headerNav.classList.toggle('active');
            
            // Update hamburger icon
            const icon = mobileMenuToggle.querySelector('i');
            if (headerNav.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !headerNav.contains(e.target)) {
                headerNav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });

        // Close menu when clicking on nav links
        const navLinks = headerNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                headerNav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            });
        });
    }

    setupFAQInteractions() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                // Add accessibility attributes
                question.setAttribute('role', 'button');
                question.setAttribute('aria-expanded', 'false');
                question.setAttribute('tabindex', '0');
                
                // Add keyboard support
                question.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        question.click();
                    }
                });

                question.addEventListener('click', (event) => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all other FAQ items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                        }
                    });
                    
                    // Toggle current item
                    if (isActive) {
                        item.classList.remove('active');
                        question.setAttribute('aria-expanded', 'false');
                    } else {
                        item.classList.add('active');
                        question.setAttribute('aria-expanded', 'true');
                    }
                    
                    // Add ripple effect
                    this.createRipple(question, event);
                });
            }
        });
    }

    setupSearchFunctionality() {
        const searchInput = document.getElementById('helpSearch');
        const searchBtn = document.querySelector('.search-btn');
        
        if (!searchInput || !searchBtn) return;

        const performSearch = () => {
            const query = searchInput.value.toLowerCase().trim();
            
            if (!query) {
                this.showSearchMessage('Please enter a search term');
                return;
            }
            
            // Search through FAQ items
            const faqItems = document.querySelectorAll('.faq-item');
            let foundResults = [];
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question span');
                const answer = item.querySelector('.faq-answer');
                
                if (question && answer) {
                    const questionText = question.textContent.toLowerCase();
                    const answerText = answer.textContent.toLowerCase();
                    
                    if (questionText.includes(query) || answerText.includes(query)) {
                        foundResults.push(item);
                    }
                }
            });
            
            this.displaySearchResults(foundResults, query);
        };

        searchBtn.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Real-time search as user types
        searchInput.addEventListener('input', () => {
            if (searchInput.value.length > 2) {
                this.debounce(performSearch, 300)();
            }
        });
    }

    displaySearchResults(results, query) {
        // Close all FAQ items first
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            item.classList.remove('active');
            item.style.display = 'block';
        });
        
        if (results.length === 0) {
            this.showSearchMessage(`No results found for "${query}"`);
            return;
        }
        
        // Hide non-matching items and show matching ones
        faqItems.forEach(item => {
            if (!results.includes(item)) {
                item.style.display = 'none';
            } else {
                item.style.display = 'block';
                // Highlight matching text
                this.highlightText(item, query);
            }
        });
        
        // Scroll to first result
        if (results.length > 0) {
            results[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        this.showSearchMessage(`Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`);
    }

    highlightText(element, query) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        textNodes.forEach(textNode => {
            const parent = textNode.parentElement;
            if (parent.tagName.toLowerCase() === 'script' || parent.tagName.toLowerCase() === 'style') {
                return;
            }
            
            const text = textNode.textContent;
            const regex = new RegExp(`(${query})`, 'gi');
            
            if (regex.test(text)) {
                const highlightedText = text.replace(regex, '<mark>$1</mark>');
                const wrapper = document.createElement('span');
                wrapper.innerHTML = highlightedText;
                parent.replaceChild(wrapper, textNode);
            }
        });
    }

    showSearchMessage(message) {
        // Remove existing message
        const existingMessage = document.querySelector('.search-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'search-message';
        messageDiv.innerHTML = `
            <div style="
                background: var(--bg-glass);
                backdrop-filter: blur(20px);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 1rem 2rem;
                margin: 2rem auto;
                max-width: 600px;
                text-align: center;
                color: var(--text-secondary);
                animation: fadeInUp 0.3s ease;
            ">
                <i class="fas fa-search" style="margin-right: 0.5rem; color: var(--text-primary);"></i>
                ${message}
            </div>
        `;
        
        const faqSection = document.querySelector('.faq-section');
        if (faqSection) {
            faqSection.insertBefore(messageDiv, faqSection.querySelector('.faq-container'));
        }
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentElement) {
                messageDiv.remove();
            }
        }, 5000);
    }

    setupAnimations() {
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll(
            '.help-card, .faq-item, .support-option, .bot-container'
        );
        
        animatableElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            observer.observe(element);
        });

        // Animate floating icons
        const floatingIcons = document.querySelectorAll('.floating-icon');
        floatingIcons.forEach((icon, index) => {
            icon.style.animationDelay = `${index * 0.5}s`;
        });
    }

    addRippleEffects() {
        const interactiveElements = document.querySelectorAll(
            '.btn-primary, .btn-secondary, .help-link, .faq-question, .help-card'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRipple(element, e);
            });
        });
    }

    createRipple(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Support functions
function startLiveChat() {
    alert('Live chat feature coming soon! For now, please use email support.');
}

function openEmailSupport() {
    window.location.href = 'mailto:support@translatalk.com?subject=Help Request';
}

function openDocs() {
    alert('Documentation section coming soon!');
}

function startBotChat() {
    alert('TranslaBot AI assistant coming soon! For now, please browse our FAQ section.');
}

// Navigation function
function navigateTo(page) {
    window.location.href = page;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HelpPageManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HelpPageManager };
}
