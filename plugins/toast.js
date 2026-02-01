export default (context, inject) => {
  const myToast = (type, message) => {
    console.log('Toast called with:', { type, message });
    // グローバルイベントバスでトーストを発火
    if (process.client && window.$nuxt) {
      window.$nuxt.$emit('show-toast', { type, message });
      console.log('Toast emitted:', { type, message });
    }
  };

  inject('myToast', myToast);
};
