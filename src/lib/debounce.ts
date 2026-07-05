export default class Debounce {
  private timeoutIds: any;

  constructor() {
    this.timeoutIds = {};
  }

  prepare(key: string, callback: any, delay: number) {
    return (...args: any) => {
      clearTimeout(this.timeoutIds[key]);
      this.timeoutIds[key] = setTimeout(() => callback.apply(this, args), delay);
    };
  }
}
