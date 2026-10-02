class KnrProductReviews extends HTMLElement {
  connectedCallback() {
    this.perPage = Number(this.dataset.perPage) || 3;
    this.visible = this.perPage;
    this.filter = 'all';
    this.items = [...this.querySelectorAll('[data-ref="item"]')];
    this.moreButton = this.querySelector('[data-ref="load-more"]');
    this.filterSelect = this.querySelector('[data-ref="filter"]');
    this.emptyFilter = this.querySelector('[data-ref="empty-filter"]');
    this.openButtons = [...this.querySelectorAll('[data-ref="open"]')];
    this.dialogs = [...this.querySelectorAll('[data-ref="dialog"]')];
    this.onMore = this.onMore.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onBackdrop = this.onBackdrop.bind(this);

    this.moreButton?.addEventListener('click', this.onMore);
    this.filterSelect?.addEventListener('change', this.onFilter);
    this.openButtons.forEach((button) => button.addEventListener('click', this.onOpen));
    this.dialogs.forEach((dialog) => {
      dialog.querySelector('[data-ref="close"]')?.addEventListener('click', this.onClose);
      dialog.addEventListener('click', this.onBackdrop);
      if (dialog.querySelector('[data-ref="errors"]')) dialog.showModal();
    });

    this.update();

    if (new URLSearchParams(window.location.search).get('contact_posted') === 'true') {
      const message = this.querySelector('[data-ref="success"]');
      if (!message) return;
      message.hidden = false;
      message.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  disconnectedCallback() {
    this.moreButton?.removeEventListener('click', this.onMore);
    this.filterSelect?.removeEventListener('change', this.onFilter);
    this.openButtons?.forEach((button) => button.removeEventListener('click', this.onOpen));
    this.dialogs?.forEach((dialog) => {
      dialog.querySelector('[data-ref="close"]')?.removeEventListener('click', this.onClose);
      dialog.removeEventListener('click', this.onBackdrop);
    });
  }

  onMore() {
    this.visible += this.perPage;
    this.update();
  }

  onFilter() {
    this.filter = this.filterSelect?.value || 'all';
    this.visible = this.perPage;
    this.update();
  }

  onOpen(event) {
    const dialogId = event.currentTarget.dataset.dialog;
    if (!dialogId) return;
    this.querySelector(`#${CSS.escape(dialogId)}`)?.showModal();
  }

  onClose(event) {
    event.currentTarget.closest('dialog')?.close();
  }

  onBackdrop(event) {
    if (event.target === event.currentTarget) event.currentTarget.close();
  }

  update() {
    let matched = 0;

    this.items.forEach((item) => {
      const matches = this.filter === 'all' || item.dataset.note === this.filter;
      if (!matches) {
        item.hidden = true;
        return;
      }

      matched += 1;
      item.hidden = matched > this.visible;
    });

    if (this.moreButton) this.moreButton.hidden = matched <= this.visible;
    if (this.emptyFilter) this.emptyFilter.hidden = this.items.length === 0 || matched !== 0;
  }
}

if (!customElements.get('knr-product-reviews')) {
  customElements.define('knr-product-reviews', KnrProductReviews);
}
