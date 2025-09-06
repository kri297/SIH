// main.js - Main JavaScript for Jharkhand Eco-Culture Explorer

// Application state
const AppState = {
    userPoints: 0,
    badgesEarned: [],
    currentLanguage: 'en',
    userLocation: null,
    visitedPlaces: [],
    ecoFootprint: 0,
    isLoading: true
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    console.log('🌿 Initializing Jharkhand Eco-Culture Explorer...');
    
    // Start loading sequence
    initializeLoadingScreen();
    
    // Initialize components after loading
    setTimeout(() => {
        initializeNavigation();
        initializeScrollAnimations();
        initializeQuickCards();
        initializeRewards();
        initializeInteractiveElements();
        initializeLanguageSupport();
        
        // Complete loading after 2 seconds
        setTimeout(() => {
            completeLoading();
        }, 2000);
    }, 100);
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle scroll effects
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for navbar styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Auto-hide navbar on scroll down (mobile)
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.querySelector('i').classList.toggle('fa-bars');
            navToggle.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.querySelector('i').classList.add('fa-bars');
                    navToggle.querySelector('i').classList.remove('fa-times');
                }
            }
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && 
            window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Add animation classes to elements
    const animateElements = document.querySelectorAll('.feature-card, .quick-card, .stat-item');
    animateElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// Initialize quick access cards
function initializeQuickCards() {
    const quickCards = document.querySelectorAll('.quick-card');
    
    quickCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            handleCategorySelection(category);
        });
        
        // Add hover sound effect (if audio is enabled)
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Handle category selection
function handleCategorySelection(category) {
    console.log(`🎯 Selected category: ${category}`);
    
    // Update points for exploration
    updateUserPoints(10);
    
    // Show category-specific content
    showCategoryContent(category);
    
    // Track user interaction
    trackUserInteraction('category_selection', category);
}

// Show category-specific content
function showCategoryContent(category) {
    const categories = {
        eco: {
            title: 'Eco Trails',
            description: 'Discover sustainable forest walks and nature trails',
            places: ['Netarhat Hills', 'Betla National Park', 'Palamau Tiger Reserve']
        },
        culture: {
            title: 'Tribal Heritage',
            description: 'Experience rich tribal culture and traditions',
            places: ['Tribal Museum', 'Traditional Villages', 'Cultural Centers']
        },
        wildlife: {
            title: 'Wildlife Sanctuaries',
            description: 'Explore protected wildlife habitats',
            places: ['Hazaribagh Wildlife Sanctuary', 'Koderma Wildlife Sanctuary']
        },
        waterfalls: {
            title: 'Pristine Waterfalls',
            description: 'Visit breathtaking natural waterfalls',
            places: ['Hundru Falls', 'Dassam Falls', 'Jonha Falls']
        }
    };
    
    const categoryData = categories[category];
    if (categoryData) {
        // Create modal or update content section
        showCategoryModal(categoryData);
    }
}

// Show category modal
function showCategoryModal(categoryData) {
    // Create modal element if it doesn't exist
    let modal = document.getElementById('categoryModal');
    if (!modal) {
        modal = createCategoryModal();
        document.body.appendChild(modal);
    }
    
    // Update modal content
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    const placesList = modal.querySelector('.places-list');
    
    modalTitle.textContent = categoryData.title;
    modalDescription.textContent = categoryData.description;
    
    placesList.innerHTML = '';
    categoryData.places.forEach(place => {
        const placeElement = document.createElement('div');
        placeElement.className = 'place-item';
        placeElement.innerHTML = `
            <i class="fas fa-map-marker-alt"></i>
            <span>${place}</span>
            <button class="btn btn-sm btn-primary" onclick="planTrip('${place}')">Plan Trip</button>
        `;
        placesList.appendChild(placeElement);
    });
    
    // Show modal
    modal.style.display = 'flex';
    modal.classList.add('show');
}

// Create category modal
function createCategoryModal() {
    const modal = document.createElement('div');
    modal.id = 'categoryModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title"></h3>
                <button class="modal-close" onclick="closeCategoryModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p class="modal-description"></p>
                <div class="places-list"></div>
            </div>
        </div>
    `;
    return modal;
}

// Close category modal
function closeCategoryModal() {
    const modal = document.getElementById('categoryModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Plan trip functionality
function planTrip(place) {
    console.log(`🗺️ Planning trip to: ${place}`);
    updateUserPoints(25);
    
    // Show trip planning interface
    showTripPlanner(place);
    
    // Track trip planning
    trackUserInteraction('trip_planning', place);
}

// Show trip planner
function showTripPlanner(destination) {
    // Close category modal first
    closeCategoryModal();
    
    // Create or update trip planner
    let planner = document.getElementById('tripPlanner');
    if (!planner) {
        planner = createTripPlanner();
        document.body.appendChild(planner);
    }
    
    // Update destination
    planner.querySelector('.destination-name').textContent = destination;
    
    // Show planner
    planner.style.display = 'flex';
    planner.classList.add('show');
}

// Create trip planner
function createTripPlanner() {
    const planner = document.createElement('div');
    planner.id = 'tripPlanner';
    planner.className = 'modal trip-planner';
    planner.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h3>Plan Your Eco Trip</h3>
                <span class="destination-name"></span>
                <button class="modal-close" onclick="closeTripPlanner()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="trip-options">
                    <div class="option-group">
                        <h4><i class="fas fa-calendar"></i> Travel Date</h4>
                        <input type="date" id="travelDate" class="form-input">
                    </div>
                    <div class="option-group">
                        <h4><i class="fas fa-users"></i> Group Size</h4>
                        <select id="groupSize" class="form-input">
                            <option value="1">Solo Traveler</option>
                            <option value="2">Couple</option>
                            <option value="3-5">Small Group (3-5)</option>
                            <option value="6+">Large Group (6+)</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <h4><i class="fas fa-car"></i> Transport</h4>
                        <div class="transport-options">
                            <label class="transport-option eco">
                                <input type="radio" name="transport" value="bus">
                                <span><i class="fas fa-bus"></i> Eco Bus</span>
                                <small>Low carbon footprint</small>
                            </label>
                            <label class="transport-option">
                                <input type="radio" name="transport" value="train">
                                <span><i class="fas fa-train"></i> Train</span>
                                <small>Eco-friendly option</small>
                            </label>
                            <label class="transport-option">
                                <input type="radio" name="transport" value="car">
                                <span><i class="fas fa-car"></i> Shared Car</span>
                                <small>Moderate impact</small>
                            </label>
                        </div>
                    </div>
                    <div class="option-group">
                        <h4><i class="fas fa-home"></i> Accommodation</h4>
                        <div class="accommodation-options">
                            <label class="accommodation-option recommended">
                                <input type="radio" name="accommodation" value="homestay">
                                <span><i class="fas fa-home-heart"></i> Tribal Homestay</span>
                                <small>Support local community</small>
                            </label>
                            <label class="accommodation-option eco">
                                <input type="radio" name="accommodation" value="eco-lodge">
                                <span><i class="fas fa-tree"></i> Eco Lodge</span>
                                <small>Sustainable accommodation</small>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="trip-summary">
                    <h4>Trip Summary</h4>
                    <div class="summary-content">
                        <div class="carbon-footprint">
                            <i class="fas fa-leaf"></i>
                            <span>Carbon Footprint: <strong id="carbonFootprint">0 kg CO₂</strong></span>
                        </div>
                        <div class="eco-points">
                            <i class="fas fa-coins"></i>
                            <span>Eco Points: <strong id="tripPoints">0</strong></span>
                        </div>
                    </div>
                    <button class="btn btn-primary full-width" onclick="confirmTrip()">
                        <i class="fas fa-check"></i> Confirm Eco Trip
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for real-time updates
    setTimeout(() => {
        addTripPlannerListeners();
    }, 100);
    
    return planner;
}

// Add trip planner event listeners
function addTripPlannerListeners() {
    const transportOptions = document.querySelectorAll('input[name="transport"]');
    const accommodationOptions = document.querySelectorAll('input[name="accommodation"]');
    
    [...transportOptions, ...accommodationOptions].forEach(option => {
        option.addEventListener('change', updateTripSummary);
    });
}

// Update trip summary
function updateTripSummary() {
    const transport = document.querySelector('input[name="transport"]:checked')?.value;
    const accommodation = document.querySelector('input[name="accommodation"]:checked')?.value;
    
    let carbonFootprint = 0;
    let ecoPoints = 0;
    
    // Calculate carbon footprint
    const carbonValues = {
        bus: 2.5,
        train: 1.8,
        car: 4.2
    };
    
    if (transport) {
        carbonFootprint = carbonValues[transport] || 0;
    }
    
    // Calculate eco points
    const pointValues = {
        bus: 50,
        train: 60,
        car: 30,
        homestay: 100,
        'eco-lodge': 80
    };
    
    ecoPoints += pointValues[transport] || 0;
    ecoPoints += pointValues[accommodation] || 0;
    
    // Update display
    document.getElementById('carbonFootprint').textContent = `${carbonFootprint} kg CO₂`;
    document.getElementById('tripPoints').textContent = ecoPoints;
    
    // Add visual feedback for eco-friendly choices
    updateEcoFeedback(transport, accommodation);
}

// Update eco feedback
function updateEcoFeedback(transport, accommodation) {
    const ecoChoices = ['bus', 'train', 'homestay', 'eco-lodge'];
    const summary = document.querySelector('.trip-summary');
    
    if (ecoChoices.includes(transport) || ecoChoices.includes(accommodation)) {
        summary.classList.add('eco-friendly');
    } else {
        summary.classList.remove('eco-friendly');
    }
}

// Close trip planner
function closeTripPlanner() {
    const planner = document.getElementById('tripPlanner');
    if (planner) {
        planner.classList.remove('show');
        setTimeout(() => {
            planner.style.display = 'none';
        }, 300);
    }
}

// Confirm trip
function confirmTrip() {
    const transport = document.querySelector('input[name="transport"]:checked')?.value;
    const accommodation = document.querySelector('input[name="accommodation"]:checked')?.value;
    const travelDate = document.getElementById('travelDate').value;
    const groupSize = document.getElementById('groupSize').value;
    
    if (!transport || !accommodation || !travelDate) {
        showNotification('Please complete all trip details', 'warning');
        return;
    }
    
    // Calculate final points
    const tripPoints = parseInt(document.getElementById('tripPoints').textContent);
    updateUserPoints(tripPoints);
    
    // Award badges if applicable
    checkForBadges();
    
    // Show confirmation
    showNotification(`Trip confirmed! You earned ${tripPoints} eco points!`, 'success');
    
    // Close planner
    closeTripPlanner();
    
    // Track completed trip planning
    trackUserInteraction('trip_confirmed', {
        transport,
        accommodation,
        travelDate,
        groupSize,
        points: tripPoints
    });
}

// Initialize rewards system
function initializeRewards() {
    loadUserProgress();
    setupBadges();
    updateRewardsDisplay();
}

// Load user progress (from localStorage or API)
function loadUserProgress() {
    const savedProgress = localStorage.getItem('jharkhandExplorerProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        AppState.userPoints = progress.userPoints || 0;
        AppState.badgesEarned = progress.badgesEarned || [];
        AppState.visitedPlaces = progress.visitedPlaces || [];
        AppState.ecoFootprint = progress.ecoFootprint || 0;
    }
}

// Save user progress
function saveUserProgress() {
    const progress = {
        userPoints: AppState.userPoints,
        badgesEarned: AppState.badgesEarned,
        visitedPlaces: AppState.visitedPlaces,
        ecoFootprint: AppState.ecoFootprint,
        lastUpdated: Date.now()
    };
    localStorage.setItem('jharkhandExplorerProgress', JSON.stringify(progress));
}

// Update user points
function updateUserPoints(points) {
    AppState.userPoints += points;
    
    // Update display
    const pointsElements = document.querySelectorAll('#userPoints, #ecoPoints');
    pointsElements.forEach(element => {
        element.textContent = AppState.userPoints;
    });
    
    // Save progress
    saveUserProgress();
    
    // Show points animation
    animatePointsIncrease(points);
}

// Animate points increase
function animatePointsIncrease(points) {
    const pointsElement = document.getElementById('userPoints');
    if (pointsElement) {
        const notification = document.createElement('div');
        notification.className = 'points-notification';
        notification.textContent = `+${points}`;
        notification.style.cssText = `
            position: absolute;
            top: -30px;
            right: 0;
            background: #4CAF50;
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
            animation: pointsFloat 2s ease-out forwards;
            z-index: 1000;
        `;
        
        pointsElement.style.position = 'relative';
        pointsElement.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
}

// Setup badges system
function setupBadges() {
    const badges = [
        { id: 'first-explorer', name: 'First Explorer', icon: '🗺️', requirement: 'points', value: 50 },
        { id: 'eco-warrior', name: 'Eco Warrior', icon: '🌱', requirement: 'points', value: 200 },
        { id: 'culture-enthusiast', name: 'Culture Enthusiast', icon: '🎭', requirement: 'category', value: 'culture' },
        { id: 'nature-lover', name: 'Nature Lover', icon: '🌿', requirement: 'category', value: 'eco' },
        { id: 'wildlife-protector', name: 'Wildlife Protector', icon: '🐅', requirement: 'category', value: 'wildlife' },
        { id: 'waterfall-seeker', name: 'Waterfall Seeker', icon: '💧', requirement: 'category', value: 'waterfalls' },
        { id: 'community-supporter', name: 'Community Supporter', icon: '🤝', requirement: 'homestay', value: 1 },
        { id: 'carbon-saver', name: 'Carbon Saver', icon: '♻️', requirement: 'carbon', value: 50 }
    ];
    
    AppState.availableBadges = badges;
    displayBadges();
}

// Display badges
function displayBadges() {
    const badgesGrid = document.querySelector('.badges-grid');
    if (!badgesGrid) return;
    
    badgesGrid.innerHTML = '';
    AppState.availableBadges.forEach(badge => {
        const isEarned = AppState.badgesEarned.includes(badge.id);
        const badgeElement = document.createElement('div');
        badgeElement.className = `badge-item ${isEarned ? 'earned' : ''}`;
        badgeElement.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
        `;
        
        if (isEarned) {
            badgeElement.addEventListener('click', () => {
                showBadgeDetails(badge);
            });
        }
        
        badgesGrid.appendChild(badgeElement);
    });
}

// Check for new badges
function checkForBadges() {
    AppState.availableBadges.forEach(badge => {
        if (AppState.badgesEarned.includes(badge.id)) return;
        
        let earned = false;
        
        switch (badge.requirement) {
            case 'points':
                earned = AppState.userPoints >= badge.value;
                break;
            case 'category':
                // Check if user explored this category (simplified)
                earned = true; // Would check actual category exploration
                break;
            case 'homestay':
                // Check if user booked homestay
                earned = true; // Would check actual booking
                break;
            case 'carbon':
                earned = AppState.ecoFootprint >= badge.value;
                break;
        }
        
        if (earned) {
            awardBadge(badge);
        }
    });
}

// Award badge
function awardBadge(badge) {
    AppState.badgesEarned.push(badge.id);
    updateBadgesDisplay();
    showBadgeNotification(badge);
    saveUserProgress();
}

// Show badge notification
function showBadgeNotification(badge) {
    const notification = document.createElement('div');
    notification.className = 'badge-notification';
    notification.innerHTML = `
        <div class="badge-notification-content">
            <div class="badge-notification-icon">${badge.icon}</div>
            <div class="badge-notification-text">
                <h4>Badge Earned!</h4>
                <p>${badge.name}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Update rewards display
function updateRewardsDisplay() {
    document.getElementById('badgesEarned').textContent = AppState.badgesEarned.length;
    document.getElementById('carbonSaved').textContent = AppState.ecoFootprint;
    displayBadges();
}

// Update badges display
function updateBadgesDisplay() {
    document.getElementById('badgesEarned').textContent = AppState.badgesEarned.length;
    displayBadges();
}

// Initialize interactive elements
function initializeInteractiveElements() {
    // Hero buttons
    const startExploringBtn = document.getElementById('startExploring');
    const watchVideoBtn = document.getElementById('watchVideo');
    
    if (startExploringBtn) {
        startExploringBtn.addEventListener('click', () => {
            document.getElementById('explore').scrollIntoView({ behavior: 'smooth' });
            updateUserPoints(5);
        });
    }
    
    if (watchVideoBtn) {
        watchVideoBtn.addEventListener('click', () => {
            showVideoModal();
        });
    }
    
    // Language switcher
    const langSwitcher = document.getElementById('langSwitcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('click', toggleLanguage);
    }
    
    // Map controls
    const mapBtns = document.querySelectorAll('.map-btn');
    mapBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            mapBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterMapContent(btn.dataset.filter);
        });
    });
}

// Show video modal (Local MP4)
function showVideoModal() {
    // Remove any existing video modal
    document.querySelectorAll('.modal.video-modal').forEach(modal => modal.remove());

    // Create fullscreen overlay modal
    const modal = document.createElement('div');
    modal.className = 'modal video-modal';
    modal.style.display = 'flex';
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.background = 'rgba(0,0,0,0.95)';
    modal.style.zIndex = 9999;

    modal.innerHTML = `
        <div class="modal-content" style="background:none; box-shadow:none; width:100vw; height:100vh; display:flex; justify-content:center; align-items:center; position:relative;">
            <button class="modal-close" style="position:absolute; top:30px; right:40px; background:rgba(0,0,0,0.6); color:white; font-size:2rem; border:none; border-radius:50%; z-index:100;" onclick="document.body.removeChild(this.closest('.modal'))">
                <i class="fas fa-times"></i>
            </button>
            <video
                src="jk.mp4"
                controls
                autoplay
                style="border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.35); width:80vw; height:80vh; background:#000;"
            >
                Your browser does not support the video tag.
            </video>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => modal.classList.add('show'), 100);
}
// Filter map content
function filterMapContent(filter) {
    console.log(`🗺️ Filtering map by: ${filter}`);
    // This would integrate with actual map API
    updateUserPoints(5);
}

function toggleLanguage() {
    const langs = ['en', 'hi', 'bho']; // All lowercase!
    const currentIndex = langs.indexOf(AppState.currentLanguage);
    const nextIndex = (currentIndex + 1) % langs.length;
    const nextLang = langs[nextIndex];

    AppState.currentLanguage = nextLang;
    window.LanguageSupport.setLanguage(nextLang); // This updates the UI!
    console.log(`🌐 Language switched to: ${nextLang}`);
}
// Track user interactions
function trackUserInteraction(action, data) {
    const interaction = {
        timestamp: Date.now(),
        action: action,
        data: data,
        userAgent: navigator.userAgent
    };
    
    console.log('📊 User Interaction:', interaction);
    
    // Here you would send to analytics service
    // Analytics.track(interaction);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Complete loading
function completeLoading() {
    AppState.isLoading = false;
    const loadingScreen = document.getElementById('loadingScreen');
    const mainApp = document.getElementById('mainApp');
    
    if (loadingScreen && mainApp) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainApp.style.display = 'block';
        }, 500);
    }
    
    console.log('✅ Jharkhand Eco-Culture Explorer loaded successfully!');
}
