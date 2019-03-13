export class WebComponent extends HTMLElement {
  constructor() {
    super()
  }
  set htmlContent (content) {
    this.innerHTML = content
  }
}
