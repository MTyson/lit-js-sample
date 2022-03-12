/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import {until} from 'lit/directives/until.js';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class MyElement extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 800px;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * The name to say "Hello" to.
       * @type {string}
       */
      name: {type: String},

      /**
       * The number of times the button has been clicked.
       * @type {number}
       */
      count: {type: Number},
      hobbits: []
    };
  }

  constructor() {
    super();
//    this.name = 'World';
    this.count = 0;
    this.hobbits = ["Frodo","Sam","Merry","Pippin"]; 
    this.remoteHobbits = getRemoteHobbits();
  }

  render() {
    return html`
      <h1>${this.sayHello(this.name)}!</h1>
      <div ?hidden=${this.count<5}>Not hidden</div>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
      <p>Hobbits: ${this.hobbits}</p>
      <ul>
        ${this.hobbits.map((color) =>
          html`<li style="color: ${color}">${color}</li>`
        )}
      </ul>
      <h2>Remote Hobbits:</h2>
      ${until(this.remoteHobbits, html`<span>Awaiting remote hobbits...</span>`)}
      <slot></slot>
    `;
  }

  _onClick() {
    this.count++;
    this.dispatchEvent(new CustomEvent('count-changed'));
  }

  /**
   * Formats a greeting
   * @param name {string} The name to say "Hello" to
   * @returns {string} A greeting directed at `name`
   */
  sayHello(name) {
    return `Hello, ${name}`;
  }
}
const getRemoteHobbits = async () => {
  const response = await fetch("https://the-one-api.dev/v2/character?race=Hobbit",
    {
      "headers": {
        "Authorization":"Bearer RDk2w8DTksWw6Y9yDzwx"
      }
    }
  );
  const json = await response.json();
  const hobbits = [];
  for (const h of json.docs){
    hobbits.push(html`<li>${(h.name)}</li>`);
  }
  console.log("HOBBITS: " + hobbits);
  return hobbits;
}

window.customElements.define('my-element', MyElement);
