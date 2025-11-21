// Carousel functionality for Shopify theme sections
// Supports touch/swipe, auto-play, responsive breakpoints, and accessibility

class Carousel {
  constructor(element) {
    this.wrapper = element;
    this.track = element.querySelector('[data-carousel-track]');
    this.slides = Array.from(element.querySelectorAll('[data-carousel-slide]'));
    this.prevButton = element.querySelector('[data-carousel-prev]');
    this.nextButton = element.querySelector('[data-carousel-next]');
    this.dots = Array.from(element.querySelectorAll('[data-carousel-dot]'));
    
    // Settings
    this.carouselId = element.dataset.carouselId;
    this.itemsDesktop = parseInt(element.dataset.itemsDesktop) || 3;
    this.itemsMobile = parseInt(element.dataset.itemsMobile) || 1;
    this.autoplay = element.dataset.autoplay === 'true';
    this.autoplaySpeed = parseInt(element.dataset.autoplaySpeed) || 5000;
    this.gap = parseInt(element.dataset.gap) || 30;
    
    // State
    this.currentIndex = 0;
    this.isMobile = window.innerWidth < 768;
    this.itemsPerSlide = this.isMobile ? this.itemsMobile : this.itemsDesktop;
    this.totalSlides = Math.ceil(this.slides.length / this.itemsPerSlide);
    this.autoplayInterval = null;
    this.isTransitioning = false;
    
    // Touch/swipe
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.minSwipeDistance = 50;
    
    this.init();
  }

  init() {
    if (this.slides.length === 0) return;
    
    this.setupStyles();
    this.setupEventListeners();
    this.updateLayout();
    this.goToSlide(0, false);
    
    if (this.autoplay) {
      this.startAutoplay();
    }
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 768;
        this.itemsPerSlide = this.isMobile ? this.itemsMobile : this.itemsDesktop;
        this.totalSlides = Math.ceil(this.slides.length / this.itemsPerSlide);
        
        if (wasMobile !== this.isMobile) {
          this.updateLayout();
          this.goToSlide(0, false);
        }
      }, 250);
    });
  }

  setupStyles() {
    if (!this.track) return;
    
    // Set gap
    this.track.style.gap = `${this.gap}px`;
    
    // Set slide width
    const slideWidth = `calc((100% - (${this.itemsPerSlide - 1} * ${this.gap}px)) / ${this.itemsPerSlide})`;
    this.slides.forEach(slide => {
      slide.style.flex = `0 0 ${slideWidth}`;
      slide.style.minWidth = slideWidth;
    });
  }

  setupEventListeners() {
    // Navigation buttons
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.prev());
    }
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.next());
    }
    
    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Touch/swipe support
    this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    
    // Keyboard navigation
    this.wrapper.addEventListener('keydown', (e) => this.handleKeyDown(e));
    
    // Pause autoplay on hover
    if (this.autoplay) {
      this.wrapper.addEventListener('mouseenter', () => this.stopAutoplay());
      this.wrapper.addEventListener('mouseleave', () => this.startAutoplay());
    }
  }

  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeDistance = this.touchStartX - this.touchEndX;
    
    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (swipeDistance > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  handleKeyDown(e) {
    if (document.activeElement.closest('[data-carousel-id]') !== this.wrapper) return;
    
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.prev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.next();
        break;
      case 'Home':
        e.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        this.goToSlide(this.totalSlides - 1);
        break;
    }
  }

  updateLayout() {
    this.setupStyles();
    
    // Update dots if needed
    const expectedDots = Math.ceil(this.slides.length / this.itemsPerSlide);
    if (this.dots.length !== expectedDots && this.dots.length > 0) {
      // Dots will be regenerated on next render, just update active state
      this.updateDots();
    }
  }

  goToSlide(index, animate = true) {
    if (this.isTransitioning) return;
    if (index < 0) index = this.totalSlides - 1;
    if (index >= this.totalSlides) index = 0;
    
    this.currentIndex = index;
    this.isTransitioning = true;
    
    const translateX = -(index * (100 / this.itemsPerSlide));
    this.track.style.transform = `translateX(${translateX}%)`;
    this.track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
    
    this.updateDots();
    this.updateButtons();
    
    // Reset transitioning flag
    setTimeout(() => {
      this.isTransitioning = false;
    }, animate ? 500 : 0);
    
    // Restart autoplay if enabled
    if (this.autoplay) {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  next() {
    this.goToSlide(this.currentIndex + 1);
  }

  prev() {
    this.goToSlide(this.currentIndex - 1);
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('carousel__dot--active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('carousel__dot--active');
        dot.setAttribute('aria-selected', 'false');
      }
    });
  }

  updateButtons() {
    if (this.prevButton) {
      this.prevButton.disabled = this.totalSlides <= 1;
      this.prevButton.setAttribute('aria-disabled', this.totalSlides <= 1);
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.totalSlides <= 1;
      this.nextButton.setAttribute('aria-disabled', this.totalSlides <= 1);
    }
  }

  startAutoplay() {
    if (!this.autoplay || this.totalSlides <= 1) return;
    
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, this.autoplaySpeed);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  destroy() {
    this.stopAutoplay();
    // Remove event listeners and clean up
    if (this.prevButton) {
      this.prevButton.replaceWith(this.prevButton.cloneNode(true));
    }
    if (this.nextButton) {
      this.nextButton.replaceWith(this.nextButton.cloneNode(true));
    }
  }
}

// Initialize all carousels on page load
document.addEventListener('DOMContentLoaded', () => {
  const carouselElements = document.querySelectorAll('[data-carousel-id]');
  carouselElements.forEach(element => {
    new Carousel(element);
  });
});

// Re-initialize carousels when sections are loaded dynamically (Shopify theme editor)
if (typeof Shopify !== 'undefined' && Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    const carouselElements = event.detail.querySelectorAll('[data-carousel-id]');
    carouselElements.forEach(element => {
      new Carousel(element);
    });
  });
}

