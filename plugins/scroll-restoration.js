export default ({ app }) => {
  if (process.client) {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    app.router.afterEach(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    });
  }
};
