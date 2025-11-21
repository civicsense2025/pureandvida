// Global JavaScript for Shopify theme

class MenuDrawer extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.querySelector('.header__menu-item');
  }

  connectedCallback() {
    this.mainDetailsToggle.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;
    const openDetailsElement = event.target.closest('details[open]');
    if (!openDetailsElement) return;
    openDetailsElement === this.mainDetailsToggle
      ? this.closeMenuDrawer(event, this.mainDetailsToggle.querySelector('summary'))
      : this.closeSubmenu(openDetailsElement);
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event === undefined) return;
    this.mainDetailsToggle.classList.remove('menu-opening');
    this.mainDetailsToggle.querySelectorAll('details').forEach((details) => {
      details.removeAttribute('open');
      details.classList.remove('menu-opening');
    });
    this.mainDetailsToggle.querySelectorAll('.submenu-open').forEach((submenu) => {
      submenu.classList.remove('submenu-open');
    });
    removeTrapFocus(elementToFocus);
    this.closeAnimation(this.mainDetailsToggle);
  }

  closeSubmenu(detailsElement) {
    const parentMenu = detailsElement.closest('.submenu-open');
    parentMenu && parentMenu.classList.remove('submenu-open');
    detailsElement.classList.remove('menu-opening');
    removeTrapFocus(detailsElement.querySelector('summary'));
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;
    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }
      const elapsedTime = time - animationStart;
      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute('open');
        if (detailsElement.closest('details[open]')) {
          trapFocus(detailsElement.closest('details[open]'), detailsElement.querySelector('summary'));
        }
      }
    };
    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define('menu-drawer', MenuDrawer);

class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;
    this.mainDetailsToggle.addEventListener('keyup', (event) => this.onKeyUp(event));
    this.mainDetailsToggle.addEventListener('toggle', () => this.onToggle());
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;
    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.mainDetailsToggle.setAttribute('open', '');
      this.mainDetailsToggle.querySelector('summary').focus();
    }
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();
    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.reverse());
    }
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.pickerStyle = this.dataset.pickerStyle || 'dropdown';
    this.init();
  }

  init() {
    // Handle different picker styles
    if (this.pickerStyle === 'buttons' || this.pickerStyle === 'swatches' || this.pickerStyle === 'images') {
      this.initButtonPickers();
    } else {
      // Default dropdown behavior
      this.addEventListener('change', this.onVariantChange);
    }
  }

  initButtonPickers() {
    // Handle button/swatch/image variant selection
    const buttons = this.querySelectorAll('.variant-picker-button, .variant-picker-swatch, .variant-picker-image');
    const hiddenInputs = this.querySelectorAll('[data-option-input]');

    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const value = button.dataset.value;
        const optionIndex = parseInt(button.dataset.optionIndex);

        // Update hidden input
        const input = Array.from(hiddenInputs).find(inp => parseInt(inp.dataset.optionInput) === optionIndex);
        if (input) {
          input.value = value;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Update button states
        const optionGroup = button.closest('.product-form__input');
        if (optionGroup) {
          optionGroup.querySelectorAll('.variant-picker-button, .variant-picker-swatch, .variant-picker-image').forEach(btn => {
            btn.classList.remove('variant-picker-button--selected', 'variant-picker-swatch--selected', 'variant-picker-image--selected');
          });
          button.classList.add('variant-picker-button--selected', 'variant-picker-swatch--selected', 'variant-picker-image--selected');
        }

        // Trigger variant change
        this.onVariantChange();
      });
    });

    // Listen for changes on hidden inputs
    hiddenInputs.forEach(input => {
      input.addEventListener('change', () => this.onVariantChange());
    });
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();
    this.removeErrorMessage();

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
      this.updateButtonStates();
    }
  }

  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }

  updateMedia() {
    if (!this.currentVariant) return;
    if (!this.currentVariant.featured_media) return;

    const mediaGallery = document.getElementById(`ProductSection-${this.dataset.section}`);
    if (!mediaGallery) return;
    const newMedia = mediaGallery.querySelector(`[data-media-id="${this.currentVariant.featured_media.id}"]`);
    if (!newMedia) return;

    const modalContent = document.querySelector(`#ProductModal-${this.dataset.section}`);
    const newMediaModal = modalContent?.querySelector(`[data-media-id="${this.currentVariant.featured_media.id}"]`);
    const mediaId = this.currentVariant.featured_media.id;

    mediaGallery.setAttribute('aria-current', mediaId);
    mediaGallery.scrollTo({ left: newMedia.offsetLeft, behavior: 'smooth' });

    if (newMediaModal) {
      const selectedMedia = modalContent.querySelector('[aria-current]');
      selectedMedia?.removeAttribute('aria-current');
      newMediaModal.setAttribute('aria-current', mediaId);
    }
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector('pickup-availability');
    if (!pickUpAvailability) return;

    if (this.currentVariant?.available) {
      pickUpAvailability.updateAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute('available');
      pickUpAvailability.innerHTML = '';
    }
  }

  removeErrorMessage() {
    const section = this.closest('section');
    if (!section) return;

    const productForm = section.querySelector('product-form');
    if (productForm) productForm.handleErrorMessage();
  }

  renderProductInfo() {
    // Debounce variant change to prevent excessive API calls
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
    }
    this.renderTimeout = setTimeout(() => {
      fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const destination = document.getElementById(`price-${this.dataset.section}`);
          const source = html.getElementById(`price-${this.dataset.section}`);
          const skuSource = html.getElementById(`Sku-${this.dataset.section}`);
          const skuDestination = document.getElementById(`Sku-${this.dataset.section}`);
          const inventorySource = html.getElementById(`Inventory-${this.dataset.section}`);
          const inventoryDestination = document.getElementById(`Inventory-${this.dataset.section}`);

          if (source && destination) destination.innerHTML = source.innerHTML;
          if (document.getElementById(`price-${this.dataset.section}`)) {
            document.getElementById(`price-${this.dataset.section}`).classList.remove('visibility-hidden');
          }
          if (skuSource && skuDestination) {
            skuDestination.innerHTML = skuSource.innerHTML;
          }
          if (inventorySource && inventoryDestination) {
            inventoryDestination.innerHTML = inventorySource.innerHTML;
          }
        })
        .catch((error) => {
          console.error('Error updating product info:', error);
        });
    }, 150);
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.section}`);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');

    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.section}`)?.querySelector('[name="add"]');
    if (!button) return;
    button.setAttribute('disabled', 'disabled');
    const buttonText = button.querySelector('span');
    if (buttonText) buttonText.textContent = window.variantStrings.unavailable;
  }

  updateShareUrl() {
    const shareButton = document.getElementById(`Share-${this.dataset.section}`);
    const updateUrl = shareButton?.dataset.url;
    if (!updateUrl) return;
    shareButton.setAttribute('data-url', `${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateButtonStates() {
    // Update visual state of variant picker buttons/swatches
    if (this.pickerStyle === 'buttons' || this.pickerStyle === 'swatches' || this.pickerStyle === 'images') {
      const variantData = this.getVariantData();
      const currentOptions = this.options;

      // Update availability states
      variantData.forEach(variant => {
        const isMatching = !variant.options.map((option, index) => {
          return currentOptions[index] === option;
        }).includes(false);

        if (isMatching) {
          // Update buttons for this variant's options
          variant.options.forEach((optionValue, optionIndex) => {
            const buttons = this.querySelectorAll(`[data-option-index="${optionIndex}"][data-value="${optionValue}"]`);
            buttons.forEach(button => {
              if (variant.available) {
                button.classList.remove('variant-picker-button--unavailable', 'variant-picker-swatch--unavailable', 'variant-picker-image--unavailable');
                button.removeAttribute('disabled');
              } else {
                button.classList.add('variant-picker-button--unavailable', 'variant-picker-swatch--unavailable', 'variant-picker-image--unavailable');
                button.setAttribute('disabled', 'disabled');
              }
            });
          });
        }
      });
    }
  }
}

customElements.define('variant-selects', VariantSelects);

class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    if (this.form) {
      const idInput = this.form.querySelector('[name=id]');
      if (idInput) idInput.disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    }
    this.cartNotification = document.querySelector('cart-notification');
    this.cartDrawer = document.querySelector('cart-drawer');
    this.initQuantitySelector();
  }

  initQuantitySelector() {
    // Handle quantity selector buttons
    const quantityButtons = this.querySelectorAll('.quantity-btn');
    const quantityInput = this.querySelector('.quantity-input');

    quantityButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const action = button.dataset.action;
        if (!quantityInput) return;

        let currentValue = parseInt(quantityInput.value) || 1;
        const min = parseInt(quantityInput.min) || 1;
        const max = parseInt(quantityInput.max) || 99;

        if (action === 'increase' && currentValue < max) {
          currentValue++;
        } else if (action === 'decrease' && currentValue > min) {
          currentValue--;
        }

        quantityInput.value = currentValue;
        quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  }

  onSubmitHandler(evt) {
    evt.preventDefault();
    const submitButton = this.querySelector('[type="submit"]');
    if (submitButton && submitButton.classList.contains('loading')) return;

    this.handleErrorMessage();
    this.cartNotification?.setActiveElement(document.activeElement);

    const config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];

    const formData = new FormData(this.form);
    
    // Get quantity from quantity input if exists
    const quantityInput = document.querySelector('.quantity-input');
    if (quantityInput && formData.get('quantity') === null) {
      formData.set('quantity', quantityInput.value || 1);
    }

    // Add sections for cart drawer/notification
    const sectionsToRender = [];
    if (this.cartNotification) {
      sectionsToRender.push(...this.cartNotification.getSectionsToRender().map((section) => section.id));
    }
    if (this.cartDrawer) {
      sectionsToRender.push(...this.cartDrawer.getSectionsToRender().map((section) => section.id));
    }
    if (sectionsToRender.length > 0) {
      formData.append('sections', sectionsToRender.join(','));
    }
    formData.append('sections_url', window.location.pathname);
    config.body = formData;

    if (submitButton) {
      submitButton.classList.add('loading');
      const spinner = this.querySelector('.loading-overlay__spinner');
      if (spinner) spinner.classList.remove('hidden');
    }

    fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          this.handleErrorMessage(response.description);
          return;
        }

        // Update cart notification
        if (this.cartNotification) {
          this.cartNotification.renderContents(response);
        }

        // Update cart drawer if exists
        if (this.cartDrawer) {
          this.cartDrawer.renderContents(response);
        }

        // Update cart count
        this.updateCartCount(response);

        // Show success animation
        this.showSuccessAnimation(submitButton);
      })
      .catch((e) => {
        console.error(e);
        this.handleErrorMessage('An error occurred. Please try again.');
      })
      .finally(() => {
        if (submitButton) {
          submitButton.classList.remove('loading');
          const spinner = this.querySelector('.loading-overlay__spinner');
          if (spinner) spinner.classList.add('hidden');
        }
      });
  }

  updateCartCount(response) {
    // Update cart count in header
    const cartCountElements = document.querySelectorAll('[data-cart-count]');
    const itemCount = response.item_count || 0;
    cartCountElements.forEach(element => {
      element.textContent = itemCount;
      element.setAttribute('aria-label', `${itemCount} items in cart`);
    });
  }

  showSuccessAnimation(button) {
    if (!button) return;
    button.classList.add('product-form__submit--success');
    setTimeout(() => {
      button.classList.remove('product-form__submit--success');
    }, 2000);
  }

  handleErrorMessage(errorMessage = false) {
    this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
    this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

    this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }
}

customElements.define('product-form', ProductForm);

class CartNotification extends HTMLElement {
  constructor() {
    super();
    this.notification = this.querySelector('.cart-notification');
    this.activeElement = null;
  }

  setActiveElement(element) {
    this.activeElement = element;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-notification-product',
        section: 'cart-notification-product',
        selector: '.cart-notification-product'
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      }
    ];
  }

  renderContents(parsedState) {
    this.getSectionsToRender().forEach((section => {
      const sectionElement = document.getElementById(section.id);
      if (sectionElement) {
        const sectionHTML = new DOMParser().parseFromString(parsedState.sections[section.id], 'text/html');
        const sourceElement = sectionHTML.querySelector(section.selector);
        if (sourceElement) {
          sectionElement.innerHTML = sourceElement.innerHTML;
        }
      }
    }));

    this.open();
  }

  open() {
    this.notification?.setAttribute('aria-hidden', 'false');
    this.notification?.classList.add('cart-notification--active');
    document.body.style.overflow = 'hidden';

    // Close button handler
    const closeButton = this.querySelector('.cart-notification__close');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
    }

    // Close on overlay click
    this.addEventListener('click', (e) => {
      if (e.target === this) {
        this.close();
      }
    });

    // Focus management
    trapFocus(this.notification, this.activeElement);
  }

  close() {
    this.notification?.setAttribute('aria-hidden', 'true');
    this.notification?.classList.remove('cart-notification--active');
    document.body.style.overflow = '';
    removeTrapFocus(this.activeElement);
  }
}

customElements.define('cart-notification', CartNotification);

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: `application/${type}`,
    },
  };
}

function trapFocus(container, elementToFocus = container) {
  const elements = getFocusableElements(container);
  const first = elements[0];
  const last = elements[elements.length - 1];

  removeTrapFocus();

  container.setAttribute('inert', '');
  elementToFocus.focus();

  function handleKeyDown(event) {
    if (event.code !== 'Tab') return;

    if (event.shiftKey) {
      if (event.target === first || event.target === container) {
        event.preventDefault();
        last.focus();
      }
    } else if (event.target === last) {
      event.preventDefault();
      first.focus();
    }

    container.addEventListener('keydown', handleKeyDown);
  }

  container.addEventListener('keydown', handleKeyDown);
}

function removeTrapFocus(elementToFocus = null) {
  document.querySelectorAll('[inert]').forEach((element) => {
    element.removeAttribute('inert');
  });

  if (elementToFocus) elementToFocus.focus();
}

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:not([disabled]), [tabindex]:not([tabindex^='-']), [draggable], area, input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea:not([disabled]), object, embed, [contenteditable='true']"
    )
  );
}
