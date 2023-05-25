import LM from "opentok-layout-js";

export default class LayoutManager {
  constructor(container, manager) {
    this.container = container;
    this.manager = manager;
  }

  init() {
    const element = document.getElementById(this.container);
    if (element) this.manager = LM(element, {
      // fixedRatio: false, 
      // scaleLastRow: false,
      // bigFirst: false,
      // bigFixedRatio: true,
      // bigAlignItems: "left"
    });
    else throw new Error("Cannot find container");
  }

  layout() {
    if (!this.manager) this.init();
    this.manager.layout();
    // console.log(`Layouting ${this.container}`);
  }

  clearBig(el) {
    if (!this.manager) this.init();

    let _els = document.querySelectorAll('.OT_big');
    _els.forEach(_el => {
      if (_el.id !== el.id) _el.classList.remove('.OT_big');
    });
  }

}
