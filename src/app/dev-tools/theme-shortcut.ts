export const initThemeShortcut = (): void => {
  document.addEventListener('keydown', ev => {
    if (!ev.altKey || ev.key.toLowerCase() !== 'z') return;

    const html = document.documentElement;
    const datasetThemeValue = html.dataset['theme'];

    const isDarkMode = datasetThemeValue
      ? datasetThemeValue === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;

    html.dataset['theme'] = isDarkMode ? 'light' : 'dark';
  });
};
