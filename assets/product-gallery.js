/**
 * Product Gallery Enhancement
 * Features: Image zoom, lightbox, 360° rotation, touch support
 */

class ProductGallery {
  constructor(container) {
    this.container = container;
    this.mediaList = container.querySelector('[data-product-gallery]');
    this.mediaItems = container.querySelectorAll('.product__media-item');
    this.currentIndex = 0;
    this.isZoomed = false;
    this.isLightboxOpen = false;
    
    this.init();
  }

  init() {
    if (!this.mediaList || this.mediaItems.length === 0) return;

    // Initialize zoom on images
    this.mediaItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img) {
        this.initImageZoom(img, index);
        this.initLightbox(img, index);
      }
    });

    // Initialize 360° viewer if model exists
    this.init360Viewer();

    // Initialize touch/swipe support
    this.initTouchSupport();

    // Initialize thumbnail navigation if exists
    this.initThumbnails();
  }

  initImageZoom(img, index) {
    img.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) { // Desktop only
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => this.zoomImage(img, index));
      }
    });

    img.addEventListener('mousemove', (e) => {
      if (this.isZoomed && window.innerWidth > 768) {
        this.handleZoomMove(e, img);
      }
    });

    img.addEventListener('mouseleave', () => {
      if (this.isZoomed) {
        this.resetZoom(img);
      }
    });
  }

  zoomImage(img, index) {
    if (this.isZoomed) {
      this.resetZoom(img);
      return;
    }

    this.isZoomed = true;
    img.style.cursor = 'zoom-out';
    img.style.transform = 'scale(2)';
    img.style.transition = 'transform 0.3s ease';
    img.style.transformOrigin = 'center center';
    img.classList.add('product-image--zoomed');
  }

  handleZoomMove(e, img) {
    // Debounce zoom move for performance
    if (this.zoomMoveTimeout) {
      cancelAnimationFrame(this.zoomMoveTimeout);
    }
    this.zoomMoveTimeout = requestAnimationFrame(() => {
      const rect = img.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
    });
  }

  resetZoom(img) {
    this.isZoomed = false;
    img.style.cursor = 'zoom-in';
    img.style.transform = 'scale(1)';
    img.style.transformOrigin = 'center center';
    img.classList.remove('product-image--zoomed');
  }

  initLightbox(img, index) {
    img.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) { // Mobile: open lightbox
        e.preventDefault();
        this.openLightbox(index);
      }
    });
  }

  openLightbox(index) {
    this.isLightboxOpen = true;
    this.currentIndex = index;

    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'product-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-label', 'Product image gallery');
    lightbox.setAttribute('aria-modal', 'true');

    // Create lightbox content
    const content = document.createElement('div');
    content.className = 'product-lightbox__content';

    // Clone current image
    const currentImg = this.mediaItems[index].cloneNode(true);
    currentImg.classList.add('product-lightbox__image');
    content.appendChild(currentImg);

    // Navigation buttons
    if (this.mediaItems.length > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'product-lightbox__prev';
      prevBtn.setAttribute('aria-label', 'Previous image');
      prevBtn.innerHTML = '‹';
      prevBtn.addEventListener('click', () => this.navigateLightbox(-1));
      content.appendChild(prevBtn);

      const nextBtn = document.createElement('button');
      nextBtn.className = 'product-lightbox__next';
      nextBtn.setAttribute('aria-label', 'Next image');
      nextBtn.innerHTML = '›';
      nextBtn.addEventListener('click', () => this.navigateLightbox(1));
      content.appendChild(nextBtn);

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'product-lightbox__close';
      closeBtn.setAttribute('aria-label', 'Close lightbox');
      closeBtn.innerHTML = '×';
      closeBtn.addEventListener('click', () => this.closeLightbox());
      content.appendChild(closeBtn);

      // Thumbnail navigation
      const thumbnails = document.createElement('div');
      thumbnails.className = 'product-lightbox__thumbnails';
      this.mediaItems.forEach((item, i) => {
        const thumb = document.createElement('button');
        thumb.className = `product-lightbox__thumbnail${i === index ? ' product-lightbox__thumbnail--active' : ''}`;
        const thumbImg = item.querySelector('img');
        if (thumbImg) {
          thumb.innerHTML = `<img src="${thumbImg.src}" alt="Thumbnail ${i + 1}" loading="lazy">`;
          thumb.addEventListener('click', () => this.navigateLightbox(i - this.currentIndex));
        }
        thumbnails.appendChild(thumb);
      });
      content.appendChild(thumbnails);
    }

    lightbox.appendChild(content);
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        this.closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', this.handleLightboxKeyboard = (e) => {
      if (e.key === 'Escape') {
        this.closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        this.navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        this.navigateLightbox(1);
      }
    });
  }

  navigateLightbox(direction) {
    if (typeof direction === 'number') {
      this.currentIndex = direction;
    } else {
      this.currentIndex += direction;
      if (this.currentIndex < 0) {
        this.currentIndex = this.mediaItems.length - 1;
      } else if (this.currentIndex >= this.mediaItems.length) {
        this.currentIndex = 0;
      }
    }

    const lightbox = document.querySelector('.product-lightbox');
    if (lightbox) {
      const image = lightbox.querySelector('.product-lightbox__image');
      const newImg = this.mediaItems[this.currentIndex].cloneNode(true);
      newImg.classList.add('product-lightbox__image');
      image.replaceWith(newImg);

      // Update active thumbnail
      const thumbnails = lightbox.querySelectorAll('.product-lightbox__thumbnail');
      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('product-lightbox__thumbnail--active', i === this.currentIndex);
      });
    }
  }

  closeLightbox() {
    const lightbox = document.querySelector('.product-lightbox');
    if (lightbox) {
      lightbox.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', this.handleLightboxKeyboard);
      this.isLightboxOpen = false;
    }
  }

  init360Viewer() {
    const modelViewer = this.container.querySelector('model-viewer');
    if (modelViewer) {
      // 360° rotation controls
      let isRotating = false;
      let startX = 0;
      let currentRotation = 0;

      modelViewer.addEventListener('mousedown', (e) => {
        isRotating = true;
        startX = e.clientX;
      });

      document.addEventListener('mousemove', (e) => {
        if (isRotating) {
          const deltaX = e.clientX - startX;
          currentRotation += deltaX * 0.5;
          modelViewer.setAttribute('camera-orbit', `${currentRotation}deg 75deg auto`);
          startX = e.clientX;
        }
      });

      document.addEventListener('mouseup', () => {
        isRotating = false;
      });

      // Touch support for 360°
      let touchStartX = 0;
      modelViewer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      });

      modelViewer.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
          const deltaX = e.touches[0].clientX - touchStartX;
          currentRotation += deltaX * 0.5;
          modelViewer.setAttribute('camera-orbit', `${currentRotation}deg 75deg auto`);
          touchStartX = e.touches[0].clientX;
        }
      });
    }
  }

  initTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    let swipeTimeout = null;

    this.mediaList.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.mediaList.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      // Debounce swipe handling
      if (swipeTimeout) clearTimeout(swipeTimeout);
      swipeTimeout = setTimeout(() => this.handleSwipe(), 50);
    }, { passive: true });
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next image
        this.navigateToImage(this.currentIndex + 1);
      } else {
        // Swipe right - previous image
        this.navigateToImage(this.currentIndex - 1);
      }
    }
  }

  navigateToImage(index) {
    if (index < 0) index = this.mediaItems.length - 1;
    if (index >= this.mediaItems.length) index = 0;

    this.currentIndex = index;
    this.mediaItems[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  initThumbnails() {
    const thumbnails = this.container.querySelectorAll('[data-thumbnail]');
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        this.navigateToImage(index);
        this.updateActiveThumbnail(index);
      });
    });
  }

  updateActiveThumbnail(index) {
    const thumbnails = this.container.querySelectorAll('[data-thumbnail]');
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('thumbnail--active', i === index);
    });
  }
}

// Initialize product gallery on page load
document.addEventListener('DOMContentLoaded', () => {
  const productSection = document.querySelector('#ProductSection');
  if (productSection) {
    new ProductGallery(productSection);
  }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductGallery;
}

