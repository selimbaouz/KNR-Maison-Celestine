class KnrProductFaq extends HTMLElement {
  connectedCallback() {
    this.items = [...this.querySelectorAll('[data-ref="item"]')];
    this.onToggle = this.onToggle.bind(this);
    this.items.forEach((item) => {
      item.querySelector('[data-ref="toggle"]')?.addEventListener('click', this.onToggle);
    });
  }

  disconnectedCallback() {
    this.items?.forEach((item) => {
      item.querySelector('[data-ref="toggle"]')?.removeEventListener('click', this.onToggle);
    });
  }

  onToggle(event) {
    const item = event.currentTarget.closest('[data-ref="item"]');
    if (!item) return;

    const willOpen = !item.classList.contains('knr-product-faq__item--open');

    this.items.forEach((entry) => this.setOpen(entry, false));

    if (willOpen) this.setOpen(item, true);
  }

  setOpen(item, open) {
    const toggle = item.querySelector('[data-ref="toggle"]');
    const panel = item.querySelector('[data-ref="panel"]');

    item.classList.toggle('knr-product-faq__item--open', open);
    toggle?.setAttribute('aria-expanded', open ? 'true' : 'false');

    if (panel) panel.hidden = !open;
  }
}

if (!customElements.get('knr-product-faq')) {
  customElements.define('knr-product-faq', KnrProductFaq);
}
