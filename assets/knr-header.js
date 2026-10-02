class KnrHeader extends HTMLElement {
  connectedCallback() {
    this.button = this.querySelector('[data-ref="menu"]');
    this.nav = this.querySelector('[data-ref="nav"]');
    this.onClick = this.toggle.bind(this);
    this.button?.addEventListener('click', this.onClick);
  }

  disconnectedCallback() {
    this.button?.removeEventListener('click', this.onClick);
  }

  toggle() {
    if (!this.button || !this.nav) return;

    const open = this.button.getAttribute('aria-expanded') !== 'true';
    this.button.setAttribute('aria-expanded', open ? 'true' : 'false');
    this.classList.toggle('knr-header--open', open);
  }
}

if (!customElements.get('knr-header')) {
  customElements.define('knr-header', KnrHeader);
}
