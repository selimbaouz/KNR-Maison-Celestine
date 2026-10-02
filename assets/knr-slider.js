class KnrSlider extends HTMLElement {
  connectedCallback() {
    this.viewport = this.querySelector('[data-ref="viewport"]');
    this.progressBar = this.querySelector('[data-ref="progress-bar"]');
    this.onScroll = this.updateProgress.bind(this);
    if (this.classList.contains('knr-slider--carousel')) {
      this.initCarousel();
      return;
    }

    this.mediaQuery = window.matchMedia('(max-width: 989px)');
    this.onMediaChange = this.onMediaChange.bind(this);
    this.mediaQuery.addEventListener('change', this.onMediaChange);
    this.onMediaChange();
  }

  disconnectedCallback() {
    this.mediaQuery?.removeEventListener('change', this.onMediaChange);
    this.destroyCarousel();
  }

  onMediaChange() {
    if (!this.mediaQuery) return;

    if (this.mediaQuery.matches) {
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
    this.embla.on('scroll', this.onScroll);
    this.embla.on('select', this.onScroll);
    this.embla.on('reInit', this.onScroll);
    this.dashes = [...this.querySelectorAll('[data-ref="progress-dash"]')];
    this.onDashClick = this.onDashClick.bind(this);
    this.dashes.forEach((dash) => dash.addEventListener('click', this.onDashClick));
    this.updateProgress();
  }

  destroyCarousel() {
    this.dashes?.forEach((dash) => dash.removeEventListener('click', this.onDashClick));
    this.embla?.destroy();
    this.embla = null;
  }

  onDashClick(event) {
    const index = this.dashes.indexOf(event.currentTarget);
    if (index < 0) return;
    this.embla?.scrollTo(index);
  }

  updateProgress() {
    if (!this.embla) return;

    if (this.dashes?.length) {
      const index = this.embla.selectedScrollSnap();
      this.dashes.forEach((dash, dashIndex) => {
        const active = dashIndex === index;
        dash.classList.toggle('knr-slider__progress-dash--active', active);
        if (active) {
          dash.setAttribute('aria-current', 'true');
          return;
        }
        dash.removeAttribute('aria-current');
      });
      return;
    }

    if (!this.progressBar) return;

    const snaps = this.embla.scrollSnapList().length || 1;
    const progress = Math.max(0, Math.min(1, this.embla.scrollProgress()));
    const value = (1 + progress * (snaps - 1)) / snaps;
    this.progressBar.style.transform = `scaleX(${value})`;
  }
}

if (!customElements.get('knr-slider')) {
  customElements.define('knr-slider', KnrSlider);
}
