// loading.js - Loading Screen Controller for Jharkhand Eco-Culture Explorer

// Loading screen configuration
const LoadingConfig = {
    duration: 2000, // 2 seconds
    messages: [
        "Loading eco trails and heritage sites...",
        "Connecting with local communities...",
        "Preparing your sustainable journey...",
        "Discovering Jharkhand's hidden gems..."
    ],
    stages: [
        { name: "Initializing", progress: 0 },
        { name: "Loading Resources", progress: 25 },
        { name: "Connecting APIs", progress: 50 },
        { name: "Setting up Features", progress: 75 },
        { name: "Ready to Explore", progress: 100 }
    ]
};

// Initialize loading screen
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressFill = document.getElementById('progressFill');
    const loadingPercentage = document.getElementById('loadingPercentage');
    
    if (!loadingScreen || !progressFill || !loadingPercentage) {
        console.error('Loading screen elements not found');
        return;
    }
    
    // Add loading messages
    addLoadingMessages();
    
    // Start loading animation
    startLoadingAnimation();
    
    console.log('🔄 Loading screen initialized');
}

// Add dynamic loading messages
function addLoadingMessages() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Create messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'loading-messages';
    messagesContainer.innerHTML = LoadingConfig.messages.map(message => 
        `<div class="loading-message">${message}</div>`
    ).join('');
    
    loadingScreen.appendChild(messagesContainer);
}

// Start loading animation sequence
function startLoadingAnimation() {
    const progressFill = document.getElementById('progressFill');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const startTime = Date.now();
    
    // Animate progress bar
    function updateProgress() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / LoadingConfig.duration) * 100, 100);
        
        // Update progress bar
        progressFill.style.width = `${progress}%`;
        loadingPercentage.textContent = `${Math.floor(progress)}%`;
        
        // Update loading stage
        updateLoadingStage(progress);
        
        // Continue animation if not complete
        if (progress < 100) {
            requestAnimationFrame(updateProgress);
        } else {
            onLoadingComplete();
        }
    }
    
    // Start the animation
    requestAnimationFrame(updateProgress);
    
    // Add sound effects (if enabled)
    addLoadingSoundEffects();
}

// Update loading stage indicator
function updateLoadingStage(progress) {
    const currentStage = LoadingConfig.stages.find(stage => 
        progress >= stage.progress - 20 && progress < stage.progress + 5
    );
    
    if (currentStage) {
        updateLoadingText(currentStage.name);
    }
}

// Update loading text
function updateLoadingText(stageName) {
    const loadingText = document.querySelector('.loading-text p');
    if (loadingText && loadingText.textContent !== stageName) {
        loadingText.style.opacity = '0';
        setTimeout(() => {
            loadingText.textContent = stageName;
            loadingText.style.opacity = '1';
        }, 200);
    }
}

// Add loading sound effects (optional)
function addLoadingSoundEffects() {
    // This would add subtle sound effects for loading
    // Implementation would depend on audio requirements
    console.log('🔊 Loading sound effects initialized');
}

// Handle loading completion
function onLoadingComplete() {
    console.log('✅ Loading sequence completed');
    
    // Add completion effect
    addCompletionEffect();
    
    // Trigger completion after short delay
    setTimeout(() => {
        if (typeof completeLoading === 'function') {
            completeLoading();
        }
    }, 300);
}

// Add completion effect
function addCompletionEffect() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressFill = document.getElementById('progressFill');
    
    // Add completion glow effect
    if (progressFill) {
        progressFill.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.8)';
    }
    
    // Add completion animation to mountain icon
    const mountainIcon = document.querySelector('.mountain-icon');
    if (mountainIcon) {
        mountainIcon.style.animation = 'mountainPulse 0.5s ease-in-out 3';
    }
    
    // Update final message
    const loadingText = document.querySelector('.loading-text p');
    if (loadingText) {
        loadingText.textContent = 'Welcome to Jharkhand!';
        loadingText.style.color = '#FFB74D';
        loadingText.style.fontWeight = '600';
    }
}

// Preload critical resources
function preloadResources() {
    const resources = [
        // Images that would be loaded
        '/images/hero-background.jpg',
        '/images/eco-trails.jpg',
        '/images/tribal-culture.jpg',
        '/images/waterfalls.jpg',
        '/images/wildlife.jpg'
    ];
    
    let loadedCount = 0;
    const totalResources = resources.length;
    
    resources.forEach(resource => {
        const img = new Image();
        img.onload = img.onerror = () => {
            loadedCount++;
            updateResourceProgress(loadedCount, totalResources);
        };
        // In real implementation, these would be actual image URLs
        // img.src = resource;
        
        // Simulate loading for demo
        setTimeout(() => {
            loadedCount++;
            updateResourceProgress(loadedCount, totalResources);
        }, Math.random() * 1000);
    });
}

// Update resource loading progress
function updateResourceProgress(loaded, total) {
    const resourceProgress = (loaded / total) * 20; // Resources account for 20% of progress
    console.log(`📁 Resources loaded: ${loaded}/${total} (${resourceProgress}%)`);
}

// Initialize API connections
function initializeAPIs() {
    return new Promise((resolve) => {
        // Simulate API initialization
        const apis = ['Maps API', 'Weather API', 'Places API', 'User API'];
        let initializedCount = 0;
        
        apis.forEach((api, index) => {
            setTimeout(() => {
                initializedCount++;
                console.log(`🔗 ${api} initialized`);
                
                if (initializedCount === apis.length) {
                    resolve();
                }
            }, (index + 1) * 300);
        });
    });
}

// Loading screen error handling
function handleLoadingError(error) {
    console.error('❌ Loading error:', error);
    
    const loadingText = document.querySelector('.loading-text p');
    if (loadingText) {
        loadingText.textContent = 'Loading failed. Please refresh.';
        loadingText.style.color = '#f44336';
    }
    
    // Show retry option
    addRetryOption();
}

// Add retry option for failed loading
function addRetryOption() {
    const loadingScreen = document.getElementById('loadingScreen');
    const retryButton = document.createElement('button');
    retryButton.className = 'retry-button';
    retryButton.innerHTML = '<i class="fas fa-refresh"></i> Retry';
    retryButton.onclick = () => location.reload();
    
    retryButton.style.cssText = `
        margin-top: 20px;
        padding: 10px 20px;
        background: #ff7043;
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    `;
    
    loadingScreen.appendChild(retryButton);
}

// Check loading performance
function checkLoadingPerformance() {
    const startTime = performance.now();
    
    window.addEventListener('load', () => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        console.log(`⚡ Total load time: ${Math.round(loadTime)}ms`);
        
        // Track performance metrics
        if (loadTime > 5000) {
            console.warn('⚠️ Slow loading detected');
            // Could implement performance optimization hints
        }
    });
}

// Accessibility features for loading screen
function setupLoadingAccessibility() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (loadingScreen) {
        // Add ARIA labels
        loadingScreen.setAttribute('aria-label', 'Application loading');
        loadingScreen.setAttribute('role', 'progressbar');
        loadingScreen.setAttribute('aria-live', 'polite');
        
        // Update aria-valuenow as progress changes
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const width = progressFill.style.width;
                        const percentage = parseInt(width);
                        loadingScreen.setAttribute('aria-valuenow', percentage);
                    }
                });
            });
            
            observer.observe(progressFill, { attributes: true });
        }
    }
}

// Reduced motion support
function setupReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Disable animations for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            .loading-screen * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
        console.log('♿ Reduced motion mode enabled');
    }
}

// Mobile-specific loading optimizations
function optimizeForMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Reduce animation complexity on mobile
        const tribalElements = document.querySelectorAll('.element');
        tribalElements.forEach(element => {
            element.style.animationDuration = '6s'; // Slower for better performance
        });
        
        // Optimize progress bar updates
        LoadingConfig.duration = 1500; // Slightly faster on mobile
        
        console.log('📱 Mobile optimizations applied');
    }
}

// Initialize loading screen with all features
function initializeCompleteLoadingScreen() {
    try {
        // Setup accessibility
        setupLoadingAccessibility();
        
        // Setup reduced motion
        setupReducedMotion();
        
        // Mobile optimizations
        optimizeForMobile();
        
        // Check performance
        checkLoadingPerformance();
        
        // Preload resources
        preloadResources();
        
        // Initialize APIs
        initializeAPIs().then(() => {
            console.log('🚀 All systems initialized');
        }).catch(handleLoadingError);
        
    } catch (error) {
        handleLoadingError(error);
    }
}

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', () => {
    initializeCompleteLoadingScreen();
});