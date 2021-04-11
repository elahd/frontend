// import {
//   // css,
//   // CSSResult,
//   internalProperty,
//   html,
//   LitElement,
//   property,
//   PropertyValues,
//   TemplateResult,
//   customElement,
// } from "lit-element";
// import {
//   AuthProvider,
//   // AuthUrlSearchParams,
//   fetchAuthProviders,
// } from "../data/auth";
// import("./ha-pick-auth-provider");

// @customElement("ha-passman-helper")
// export class HaPassmanHelper extends LitElement {
//   @property() public clientId?: string;

//   @property() public redirectUri?: string;

//   @property() public oauth2State?: string;

//   @internalProperty() private _authProvider?: AuthProvider;

//   @internalProperty() private _authProviders?: AuthProvider[];

//   connectedCallback() {
//     super.connectedCallback();
//     window.addEventListener("pick-auth-provider", this._handleResize);
//   }

//   disconnectedCallback() {
//     window.removeEventListener("pick-auth-provider", this._handleResize);
//     super.disconnectedCallback();
//   }

//   // connectedCallback() {}

//   // createRenderRoot() {
//   //   return this;
//   // }

//   // MODIFY TO ACCEPT AUTH PROVIDER LIST

//   protected render(): TemplateResult {
//     // Make sure the selected auth provider isn't inactive.
//     // const inactiveProviders = this._authProviders.filter(
//     //   (prv) => prv !== this._authProvider
//     // );

//     return html`
//       <div id="passman-test">
//         <span>Hello</span>
//       </div>
//     `;
//   }

//   protected _handleResize() {
//     console.log(this._handleAuthProviderPick());
//   }

//   protected firstUpdated(changedProps: PropertyValues) {
//     super.firstUpdated(changedProps);
//     this._fetchAuthProviders();

//     // if (!this.redirectUri) {
//     //   return;
//     // }

//     // // If we are logging into the instance that is hosting this auth form
//     // // we will register the service worker to start preloading.
//     // const tempA = document.createElement("a");
//     // tempA.href = this.redirectUri!;
//     // if (tempA.host === location.host) {
//     //   registerServiceWorker(this, false);
//     // }
//   }

//   private async _handleAuthProviderPick(ev) {
//     this._authProvider = ev.detail;
//   }

//   // protected updated(changedProps: PropertyValues) {
//   //   super.updated(changedProps);
//   //   if (changedProps.has("language")) {
//   //     document.querySelector("html")!.setAttribute("lang", this.language!);
//   //   }
//   // }

//   private async _fetchAuthProviders() {
//     // Fetch auth providers
//     try {
//       // We prefetch this data on page load in authorize.html.template for modern builds
//       const response = await ((window as any).providersPromise ||
//         fetchAuthProviders());
//       const authProviders = await response.clone().json();

//       if (authProviders.length === 0) {
//         return;
//       }

//       this._authProviders = authProviders;
//       this._authProvider = authProviders[0];
//     } catch (err) {
//       // eslint-disable-next-line
//       console.error("Error loading auth providers", err);
//     }
//   }
// }
// // customElements.define("ha-pass-mgr-support", HaPassMgrSupport);

// declare global {
//   interface HTMLElementTagNameMap {
//     "ha-passman-helper": HaPassmanHelper;
//   }
// }
