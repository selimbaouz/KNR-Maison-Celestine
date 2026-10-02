class KnrProduct extends HTMLElement {
  connectedCallback() {
    this.initGallery();
    this.initVariants();
    this.initShipping();
    this.initUpsell();
  }

  disconnectedCallback() {
    this.galleryQuery?.removeEventListener('change', this.onGalleryChange);
    this.upsellNext?.removeEventListener('click', this.onUpsellNext);
    this.upsellEmbla?.destroy();
    this.upsellEmbla = null;
  }

  initGallery() {
    this.slider = this.querySelector('knr-slider');
    this.prev = this.querySelector('[data-ref="gallery-prev"]');
    this.next = this.querySelector('[data-ref="gallery-next"]');
    this.onSelect = this.updateArrows.bind(this);
    this.prev?.addEventListener('click', () => this.slider?.embla?.scrollPrev());
    this.next?.addEventListener('click', () => this.slider?.embla?.scrollNext());
    this.galleryQuery = window.matchMedia('(max-width: 989px)');
    this.onGalleryChange = this.bindArrows.bind(this);
    this.galleryQuery.addEventListener('change', this.onGalleryChange);
    this.bindArrows();
  }

  bindArrows() {
    const embla = this.slider?.embla;
    if (!embla) {
      this.updateArrows();
      return;
    }

    embla.on('select', this.onSelect);
    embla.on('reInit', this.onSelect);
    this.updateArrows();
  }

  updateArrows() {
    const embla = this.slider?.embla;
    if (this.prev) this.prev.hidden = !embla?.canScrollPrev();
    if (this.next) this.next.hidden = !embla?.canScrollNext();
  }

  initVariants() {
    const data = this.querySelector('[data-ref="variants"]');
    if (!data) return;

    this.variants = JSON.parse(data.textContent);
    this.querySelectorAll('[data-ref="size"]').forEach((button) => {
      button.addEventListener('click', () => {
        button.closest('[data-ref="option"]')?.querySelectorAll('[data-ref="size"]').forEach((item) => {
          const current = item === button;
          item.classList.toggle('knr-product__size--current', current);
          item.setAttribute('aria-pressed', current ? 'true' : 'false');
        });
        this.syncVariant();
      });
    });
  }

  syncVariant() {
    const selected = [...this.querySelectorAll('[data-ref="option"]')].map((group) => {
      return group.querySelector('[data-ref="size"][aria-pressed="true"]')?.dataset.value;
    });
    const variant = this.variants.find((item) => item.options.every((option, index) => option === selected[index]));
    if (!variant) return;

    const input = this.querySelector('[data-ref="variant-id"]');
    if (input) input.value = variant.id;

    const price = this.querySelector('[data-ref="price"]');
    if (price) price.textContent = variant.price;

    const unit = this.querySelector('[data-ref="unit-price"]');
    if (unit) unit.textContent = variant.price;

    const compare = this.querySelector('[data-ref="compare"]');
    if (compare) {
      compare.hidden = !variant.compare;
      compare.textContent = variant.compare;
    }

    const button = this.querySelector('[data-ref="add"]');
    const label = this.querySelector('[data-ref="add-label"]');
    if (!button || !label) return;

    button.disabled = !variant.available;
    button.setAttribute('aria-disabled', variant.available ? 'false' : 'true');
    label.textContent = variant.available ? button.dataset.label : button.dataset.soldOut;
  }

  initShipping() {
    this.querySelectorAll('[data-ref="shipping-slide"]').forEach((slide) => {
      const source = slide.dataset.text || '';
      if (!source.includes('#estimated_date#')) return;

      const delay = Number.parseInt(slide.dataset.delay, 10);
      const cutoff = Number.parseInt(slide.dataset.cutoff, 10);
      const label = this.formatDate(this.addDays(Number.isNaN(delay) ? 0 : delay, cutoff));
      slide.textContent = source.split('#estimated_date#').join(label);
    });
  }

  formatDate(date) {
    const formatted = new Intl.DateTimeFormat(document.documentElement.lang || 'fr', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  addDays(days, cutoffHour) {
    const date = new Date();
    const hour = Number.isNaN(cutoffHour) ? 24 : cutoffHour;
    const pastCutoff = date.getHours() >= hour;
    date.setHours(12, 0, 0, 0);
    if (pastCutoff) date.setDate(date.getDate() + 1);

    let remaining = days;
    while (remaining > 0) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0) remaining -= 1;
    }

    while (date.getDay() === 0) date.setDate(date.getDate() + 1);

    return date;
  }

  initUpsell() {
    this.upsellViewport = this.querySelector('[data-ref="upsell-viewport"]');
    this.upsellNext = this.querySelector('[data-ref="upsell-next"]');
    this.onUpsellNext = () => this.upsellEmbla?.scrollNext();
    this.upsellNext?.addEventListener('click', this.onUpsellNext);

    if (!this.upsellViewport || typeof EmblaCarousel !== 'function') return;

    this.upsellEmbla = EmblaCarousel(this.upsellViewport, {
      align: 'start',
      containScroll: 'trimSnaps',
      watchDrag: (_embla, event) => !event.target.closest('button'),
    });
    this.upsellEmbla.on('pointerDown', () => {
      this.upsellViewport?.classList.add('knr-product__upsell-viewport--grabbing');
    });
    this.upsellEmbla.on('pointerUp', () => {
      this.upsellViewport?.classList.remove('knr-product__upsell-viewport--grabbing');
    });
  }
}

customElements.define('knr-product', KnrProduct);
