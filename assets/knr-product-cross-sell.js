class KnrProductCrossSell extends HTMLElement {
  connectedCallback() {
    const data = this.querySelector('[data-ref="variants"]');
    if (!data) return;

    const variants = JSON.parse(data.textContent);
    this.querySelectorAll('[data-ref="size"]').forEach((button) => {
      button.addEventListener('click', () => {
        button.closest('[data-ref="option"]')?.querySelectorAll('[data-ref="size"]').forEach((item) => {
          const current = item === button;
          item.classList.toggle('knr-product-cross-sell__size--current', current);
          item.setAttribute('aria-pressed', current ? 'true' : 'false');
        });

        const selected = [...this.querySelectorAll('[data-ref="option"]')].map((group) => {
          return group.querySelector('[data-ref="size"][aria-pressed="true"]')?.dataset.value;
        });
        const variant = variants.find((item) => item.options.every((option, index) => option === selected[index]));
        if (!variant) return;

        const input = this.querySelector('[data-ref="variant-id"]');
        if (input) input.value = variant.id;

        const price = this.querySelector('[data-ref="price"]');
        if (price) price.textContent = variant.price;

        const add = this.querySelector('[data-ref="add"]');
        if (!add) return;
        add.disabled = !variant.available;
        add.setAttribute('aria-disabled', variant.available ? 'false' : 'true');
        add.textContent = variant.available ? add.dataset.label : add.dataset.soldOut;
      });
    });
  }
}

if (!customElements.get('knr-product-cross-sell')) {
  customElements.define('knr-product-cross-sell', KnrProductCrossSell);
}
