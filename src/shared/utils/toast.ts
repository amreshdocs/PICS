export const showToast = (message: string, duration = 3000) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, duration } }));
};

export default showToast;
