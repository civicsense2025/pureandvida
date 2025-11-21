/**
 * Product Tabs System
 * Features: Smooth tab transitions, lazy loading, URL hash navigation
 */

class ProductTabs {
  constructor(container) {
    this.container = container;
    this.tabs = container.querySelectorAll('[data-tab]');
    this.panels = container.querySelectorAll('[data-tab-panel]');
    this.activeTab = null;
    this.activePanel = null;

    this.init();
  }

  init() {
    if (!this.container || this.tabs.length === 0) return;

    // Set initial active tab
    const initialTab = this.getInitialTab();
    this.activateTab(initialTab);

    // Add click handlers
    this.tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = tab.getAttribute('data-tab');
        this.activateTab(tabName);
        this.updateURL(tabName);
      });

      // Keyboard navigation
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const tabName = tab.getAttribute('data-tab');
          this.activateTab(tabName);
          this.updateURL(tabName);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.navigateTabs(1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.navigateTabs(-1);
        }
      });
    });

    // Handle URL hash changes
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        this.activateTab(hash);
      }
    });

    // Check for initial hash
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      this.activateTab(hash);
    }
  }

  getInitialTab() {
    // Check URL hash first
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const tab = Array.from(this.tabs).find(t => t.getAttribute('data-tab') === hash);
      if (tab) return hash;
    }

    // Otherwise use first active tab or first tab
    const activeTab = Array.from(this.tabs).find(t => t.classList.contains('product-tabs__tab--active'));
    if (activeTab) {
      return activeTab.getAttribute('data-tab');
    }

    return this.tabs[0]?.getAttribute('data-tab');
  }

  activateTab(tabName) {
    // Find tab and panel
    const tab = Array.from(this.tabs).find(t => t.getAttribute('data-tab') === tabName);
    const panel = Array.from(this.panels).find(p => p.getAttribute('data-tab-panel') === tabName);

    if (!tab || !panel) return;

    // Deactivate all tabs and panels
    this.tabs.forEach(t => {
      t.classList.remove('product-tabs__tab--active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });

    this.panels.forEach(p => {
      p.classList.remove('product-tabs__panel--active');
      p.hidden = true;
    });

    // Activate selected tab and panel
    tab.classList.add('product-tabs__tab--active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tab.focus();

    panel.classList.add('product-tabs__panel--active');
    panel.hidden = false;

    // Lazy load panel content if needed
    if (panel.hasAttribute('data-lazy-load') && !panel.dataset.loaded) {
      this.lazyLoadPanel(panel);
    }

    // Scroll to tab on mobile
    if (window.innerWidth <= 768) {
      this.scrollToTab(tab);
    }

    this.activeTab = tab;
    this.activePanel = panel;
  }

  lazyLoadPanel(panel) {
    // Mark as loaded
    panel.dataset.loaded = 'true';

    // If panel has lazy content, load it
    const lazyContent = panel.querySelector('[data-lazy-content]');
    if (lazyContent) {
      // Load content via AJAX or reveal hidden content
      const hiddenContent = panel.querySelector('[data-lazy-source]');
      if (hiddenContent) {
        lazyContent.innerHTML = hiddenContent.innerHTML;
        hiddenContent.remove();
      }
    }
  }

  navigateTabs(direction) {
    const currentIndex = Array.from(this.tabs).indexOf(this.activeTab);
    let newIndex = currentIndex + direction;

    if (newIndex < 0) {
      newIndex = this.tabs.length - 1;
    } else if (newIndex >= this.tabs.length) {
      newIndex = 0;
    }

    const newTab = this.tabs[newIndex];
    const tabName = newTab.getAttribute('data-tab');
    this.activateTab(tabName);
    this.updateURL(tabName);
  }

  updateURL(tabName) {
    if (history.pushState) {
      const newURL = `${window.location.pathname}${window.location.search}#${tabName}`;
      history.pushState(null, '', newURL);
    }
  }

  scrollToTab(tab) {
    const container = this.container;
    const tabRect = tab.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
      tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }
}

// Initialize product tabs on page load
document.addEventListener('DOMContentLoaded', () => {
  const tabsContainers = document.querySelectorAll('[data-product-tabs]');
  tabsContainers.forEach(container => {
    new ProductTabs(container);
  });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductTabs;
}

