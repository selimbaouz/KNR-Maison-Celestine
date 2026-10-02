if (!customElements.get('knr-newsletter')) {
  customElements.define(
    'knr-newsletter',
    class extends HTMLElement {
      connectedCallback() {
        this.form = this.querySelector('form');
        this.button = this.querySelector('.knr-newsletter__submit');
        this.form?.addEventListener('submit', this.onSubmit.bind(this));
      }

      onSubmit(event) {
        if (!this.button || this.button.classList.contains('loading')) {
          event.preventDefault();
          return;
        }

        this.button.classList.add('loading');
        this.button.setAttribute('aria-disabled', 'true');
        this.button.querySelector('.loading__spinner')?.classList.remove('hidden');
      }
    }
  );
}
