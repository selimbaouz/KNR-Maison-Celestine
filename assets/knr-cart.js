if (!customElements.get('cart-notification')) {
  customElements.define(
    'cart-notification',
    class extends HTMLElement {
      getSectionsToRender() {
        return [{ id: 'cart-icon-bubble' }];
      }

      setActiveElement() {}

      renderContents(parsedState) {
        const markup = parsedState.sections && parsedState.sections['cart-icon-bubble'];
        const bubble = document.getElementById('cart-icon-bubble');
        if (!markup || !bubble) return;

        const section = new DOMParser().parseFromString(markup, 'text/html').querySelector('.shopify-section');
        if (!section) return;

        bubble.innerHTML = section.innerHTML;
      }
    }
  );
}
