class KnrFooter extends HTMLElement {
  connectedCallback() {
    this.columns = [...this.querySelectorAll('[data-ref="column"]')];
    this.locales = [...this.querySelectorAll('[data-ref="locale"]')];
    this.mediaQuery = window.matchMedia('(max-width: 989px)');
    this.onToggle = this.onToggle.bind(this);
    this.onMediaChange = this.onMediaChange.bind(this);
    this.onLocaleToggle = this.onLocaleToggle.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onDocumentKey = this.onDocumentKey.bind(this);
    this.columns.forEach((column) => {
      column.querySelector('[data-ref="toggle"]')?.addEventListener('click', this.onToggle);
    });
    this.locales.forEach((locale) => {
      locale.querySelector('[data-ref="locale-toggle"]')?.addEventListener('click', this.onLocaleToggle);
    });
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onDocumentKey);
    this.mediaQuery.addEventListener('change', this.onMediaChange);
    this.onMediaChange();
  }

  disconnectedCallback() {
    this.mediaQuery?.removeEventListener('change', this.onMediaChange);
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keydown', this.onDocumentKey);
    this.columns?.forEach((column) => {
      column.querySelector('[data-ref="toggle"]')?.removeEventListener('click', this.onToggle);
    });
    this.locales?.forEach((locale) => {
      locale.querySelector('[data-ref="locale-toggle"]')?.removeEventListener('click', this.onLocaleToggle);
    });
  }

  onMediaChange() {
    const mobile = this.mediaQuery.matches;

    this.columns.forEach((column) => {
      const toggle = column.querySelector('[data-ref="toggle"]');
      if (!toggle) return;

      if (!mobile) {
        toggle.setAttribute('aria-expanded', 'true');
        return;
      }

      const open = column.classList.contains('knr-footer__column--open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  onToggle(event) {
    if (!this.mediaQuery.matches) return;

    const column = event.currentTarget.closest('[data-ref="column"]');
    if (!column) return;

    const open = column.classList.toggle('knr-footer__column--open');
    event.currentTarget.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  onLocaleToggle(event) {
    event.stopPropagation();
    const locale = event.currentTarget.closest('[data-ref="locale"]');
    if (!locale) return;

    const willOpen = !locale.classList.contains('knr-footer__locale--open');
    this.closeLocales();
    if (!willOpen) return;

    locale.classList.add('knr-footer__locale--open');
    event.currentTarget.setAttribute('aria-expanded', 'true');
    locale.querySelector('[data-ref="locale-panel"]')?.removeAttribute('hidden');
  }

  onDocumentClick(event) {
    if (event.target.closest('[data-ref="locale"]')) return;
    this.closeLocales();
  }

  onDocumentKey(event) {
    if (event.key !== 'Escape') return;
    this.closeLocales();
  }

  closeLocales() {
    this.locales?.forEach((locale) => {
      locale.classList.remove('knr-footer__locale--open');
      locale.querySelector('[data-ref="locale-toggle"]')?.setAttribute('aria-expanded', 'false');
      locale.querySelector('[data-ref="locale-panel"]')?.setAttribute('hidden', '');
    });
  }
}

if (!customElements.get('knr-footer')) {
  customElements.define('knr-footer', KnrFooter);
}
