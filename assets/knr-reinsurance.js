class KnrReinsurance extends HTMLElement {
  connectedCallback() {
    this.viewport = this.querySelector('[data-ref="viewport"]');
    this.dots = [...this.querySelectorAll('[data-ref="dot"]')];
    this.mediaQuery = window.matchMedia('(max-width: 989px)');
    this.onMediaChange = this.onMediaChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onDotClick = this.onDotClick.bind(this);
    this.dots.forEach((dot) => dot.addEventListener('click', this.onDotClick));
    this.mediaQuery.addEventListener('change', this.onMediaChange);
    this.onMediaChange();
  }

  disconnectedCallback() {
    this.mediaQuery?.removeEventListener('change', this.onMediaChange);
    this.dots?.forEach((dot) => dot.removeEventListener('click', this.onDotClick));
    this.destroyCarousel();
  }

  onMediaChange() {
    if (!this.mediaQuery) return;

    if (this.mediaQuery.matches && this.dots.length > 1) {
      this.initCarousel();
      return;
    }

    this.destroyCarousel();
  }

  initCarousel() {
    if (this.embla || !this.viewport || typeof EmblaCarousel !== 'function') return;

    this.embla = EmblaCarousel(this.viewport, {
      align: 'start',
      containScroll: 'trimSnaps',
    });
    this.embla.on('select', this.onSelect);
    this.embla.on('reInit', this.onSelect);
    this.onSelect();
  }

  destroyCarousel() {
    this.embla?.destroy();
    this.embla = null;
  }

  onSelect() {
    if (!this.embla) return;

    const index = this.embla.selectedScrollSnap();

    this.dots.forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.classList.toggle('knr-reinsurance__dot--active', active);

      if (active) {
        dot.setAttribute('aria-current', 'true');
        return;
      }

      dot.removeAttribute('aria-current');
    });
  }

  onDotClick(event) {
    const index = this.dots.indexOf(event.currentTarget);
    if (index < 0) return;
    this.embla?.scrollTo(index);
  }
}

if (!customElements.get('knr-reinsurance')) {
  customElements.define('knr-reinsurance', KnrReinsurance);
}
