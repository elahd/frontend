import {
  // css,
  // CSSResult,
  // internalProperty,
  html,
  LitElement,
  property,
  PropertyValues,
  TemplateResult,
  customElement,
} from "lit-element";
import { v4 as uuidv4 } from "uuid";
import { fireEvent } from "../common/dom/fire_event";
import type { PaperInputElement } from "@polymer/paper-input/paper-input";

@customElement("ha-passman-helper")
export class HaPassmanHelper extends LitElement {
  @property() public parentName!: string;

  @property() public type: string;

  createRenderRoot() {
    return this;
  }

  protected render(): TemplateResult {
    return html`
      <form id="passman-helper-${uuidv4()}" style="width:0; height:0">
        <!-- <input type="text" autocomplete="username" name="username" id="username" style="opacity:0; cursor: default; width:0; height:0;" tabindex="-1" data-com-onepassword-filled="light">
          <input type="password" id="ap_password" name="password" tabindex="-1" style="opacity:0; cursor: default; width:0; height:0" data-com-onepassword-filled="light"> -->
      </form>
      <input
        .type=${this.type}
        .autocomplete=${"current-password"}
        @value-changed=${this._valueChanged}
      />
    `;
  }

  protected firstUpdated(changedProps: PropertyValues) {
    super.firstUpdated(changedProps);
    this.type = this.parentName.includes("password") ? "password" : "text";
  }

  private _valueChanged(ev: Event): void {
    const value = (ev.target as PaperInputElement).value;
    fireEvent(this, "value-changed", {
      value,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-passman-helper": HaPassmanHelper;
  }
}
