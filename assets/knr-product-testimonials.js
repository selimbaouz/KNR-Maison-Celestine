class KnrProductTestimonials extends HTMLElement {
  connectedCallback() {
    this.viewport = this.querySelector('[data-ref="viewport"]');
    this.prevButton = this.querySelector('[data-ref="prev"]');
    this.nextButton = this.querySelector('[data-ref="next"]');
    this.onPrev = this.onPrev.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onSelect = this.updateNav.bind(this);

    if (!this.viewport || typeof EmblaCarousel !== 'function') return;

    this.embla = EmblaCarousel(this.viewport, {
      align: 'start',
      containScroll: 'trimSnaps',
      watchDrag: false,
    });
    this.embla.on('select', this.onSelect);
    this.embla.on('reInit', this.onSelect);
    this.prevButton?.addEventListener('click', this.onPrev);
    this.nextButton?.addEventListener('click', this.onNext);
    this.updateNav();
  }

  disconnectedCallback() {
    this.prevButton?.removeEventListener('click', this.onPrev);
    this.nextButton?.removeEventListener('click', this.onNext);
    this.embla?.destroy();
    this.embla = null;
  }

  onPrev() {
    this.embla?.scrollPrev();
  }

  onNext() {
    this.embla?.scrollNext();
  }

  updateNav() {
    if (!this.embla) return;

    if (this.prevButton) this.prevButton.disabled = !this.embla.canScrollPrev();
    if (this.nextButton) this.nextButton.disabled = !this.embla.canScrollNext();
  }
}

if (!customElements.get('knr-product-testimonials')) {
  customElements.define('knr-product-testimonials', KnrProductTestimonials);
}

class KnrBeforeAfter extends HTMLElement {
  connectedCallback() {
    this.frame = this.querySelector('[data-ref="frame"]');
    this.slider = this.querySelector('[data-ref="slider"]');
    this.handle = this.querySelector('[data-ref="handle"]');
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    if (!this.frame || !this.slider) return;

    this.slider.addEventListener('pointerdown', this.onPointerDown);
    this.slider.addEventListener('pointermove', this.onPointerMove);
    this.slider.addEventListener('pointerup', this.onPointerUp);
    this.slider.addEventListener('pointercancel', this.onPointerUp);
    this.handle?.addEventListener('keydown', this.onKeyDown);
    this.setPosition(50);
  }

  disconnectedCallback() {
    this.slider?.removeEventListener('pointerdown', this.onPointerDown);
    this.slider?.removeEventListener('pointermove', this.onPointerMove);
    this.slider?.removeEventListener('pointerup', this.onPointerUp);
    this.slider?.removeEventListener('pointercancel', this.onPointerUp);
    this.handle?.removeEventListener('keydown', this.onKeyDown);
  }

  onPointerDown(event) {
    if (!this.slider) return;

    this.dragging = true;
    this.slider.setPointerCapture(event.pointerId);
    this.moveTo(event);
  }

  onPointerMove(event) {
    if (!this.dragging) return;
    this.moveTo(event);
  }

  onPointerUp() {
    this.dragging = false;
  }

  onKeyDown(event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();
    const current = Number(this.handle?.getAttribute('aria-valuenow')) || 50;
    const next = event.key === 'ArrowLeft' ? current - 2 : current + 2;
    this.setPosition(next);
  }

  moveTo(event) {
    if (!this.frame) return;

    const rect = this.frame.getBoundingClientRect();
    if (!rect.width) return;

    const position = ((event.clientX - rect.left) / rect.width) * 100;
    this.setPosition(position);
  }

  setPosition(percent) {
    const value = Math.min(100, Math.max(0, percent));
    this.style.setProperty('--split-position', `${value}%`);
    this.handle?.setAttribute('aria-valuenow', String(Math.round(value)));
  }
}

if (!customElements.get('knr-before-after')) {
  customElements.define('knr-before-after', KnrBeforeAfter);
}
