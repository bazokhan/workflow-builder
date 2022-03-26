let global;

if (typeof (window as any).global === "undefined") {
  (window as any).global = window;
  global = window;
}

export default global;
