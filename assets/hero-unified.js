/**
 * Hero Unified Section - JavaScript
 * Quantity selector Web Component
 */

class HeroQuantitySelector extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="number"]');
    this.decreaseBtn = this.querySelector('[data-action="decrease"]');
    this.increaseBtn = this.querySelector('[data-action="increase"]');
    this.form = this.closest('form');
    this.cartInput = this.form?.querySelector('[data-cart-quantity]');
  }

  connectedCallback() {
    this.bindEvents();
  }

  bindEvents() {
    this.decreaseBtn?.addEventListener('click', () => this.updateQuantity(-1));
    this.increaseBtn?.addEventListener('click', () => this.updateQuantity(1));
    this.input?.addEventListener('change', () => this.syncCartInput());
  }

  updateQuantity(delta) {
    if (!this.input) return;

    const min = parseInt(this.input.min) || 1;
    const max = parseInt(this.input.max) || 999;
    let value = parseInt(this.input.value) || min;

    value = Math.max(min, Math.min(max, value + delta));
    this.input.value = value;
    this.syncCartInput();
  }

  syncCartInput() {
    if (this.cartInput && this.input) {
      this.cartInput.value = this.input.value;
    }
  }
}

// Register the custom element
if (!customElements.get('hero-quantity-selector')) {
  customElements.define('hero-quantity-selector', HeroQuantitySelector);
}
