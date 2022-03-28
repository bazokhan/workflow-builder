if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

export default (window as any).global;
