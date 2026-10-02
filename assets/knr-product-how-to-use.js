class KnrProductHowToUse extends HTMLElement {
  connectedCallback() {
    this.mediaQuery = window.matchMedia('(max-width: 989px)');
    this.onMediaChange = this.onMediaChange.bind(this);
    this.onMoreClick = this.onMoreClick.bind(this);
    this.mediaQuery.addEventListener('change', this.onMediaChange);
    this.initReadMore();
    this.onMediaChange();
  }

  disconnectedCallback() {
    this.mediaQuery?.removeEventListener('change', this.onMediaChange);
    this.moreButtons?.forEach((button) => button.removeEventListener('click', this.onMoreClick));
  }

  onMediaChange() {
    requestAnimationFrame(() => this.syncReadMore());
  }

  initReadMore() {
    this.moreButtons = [...this.querySelectorAll('[data-ref="more"]')];
    this.moreButtons.forEach((button) => button.addEventListener('click', this.onMoreClick));
  }

  syncReadMore() {
    if (!this.isConnected) return;

    const mobile = this.mediaQuery?.matches;

    this.moreButtons?.forEach((button) => {
      if (!mobile) {
        button.hidden = true;
        return;
      }

      const text = button.previousElementSibling;
      if (!text || text.dataset.ref !== 'text') return;

      button.hidden = text.scrollHeight <= text.clientHeight + 1;
    });
  }

  onMoreClick(event) {
    const button = event.currentTarget;
    const slide = button.closest('[data-ref="slide"]');
    if (!slide) return;

    const expanded = slide.classList.toggle('knr-product-how-to-use__slide--expanded');
    button.textContent = expanded ? button.dataset.labelLess : button.dataset.labelMore;
    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }
}

if (!customElements.get('knr-product-how-to-use')) {
  customElements.define('knr-product-how-to-use', KnrProductHowToUse);
}
