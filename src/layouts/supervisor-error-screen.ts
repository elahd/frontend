import "../components/ha-card";
import "@material/mwc-button";
import {
  css,
  CSSResultArray,
  customElement,
  html,
  LitElement,
  property,
  PropertyValues,
  TemplateResult,
} from "lit-element";
import { HomeAssistant } from "../types";
import "../resources/ha-style";
import { haStyle } from "../resources/styles";
import { applyThemesOnElement } from "../common/dom/apply_themes_on_element";
import { atLeastVersion } from "../common/config/version";
import "./hass-subpage";

@customElement("supervisor-error-screen")
class SupervisorErrorScreen extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  protected firstUpdated(changedProps: PropertyValues) {
    super.firstUpdated(changedProps);

    this._applyTheme();
  }

  protected updated(changedProps: PropertyValues) {
    super.updated(changedProps);
    const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
    if (!oldHass) {
      return;
    }
    if (oldHass.themes !== this.hass.themes) {
      this._applyTheme();
    }
  }

  protected render(): TemplateResult {
    return html`
      <hass-subpage
        .hass=${this.hass}
        .header=${this.hass.localize("ui.errors.supervisor.title")}
      >
        <ha-card header="Troubleshooting">
          <div class="card-content">
            <ol>
              <li>
                ${this.hass.localize("ui.errors.supervisor.wait")}
              </li>
              <li>
                <a
                  class="supervisor_error-link"
                  href="http://homeassistant.local:4357"
                  target="_blank"
                  rel="noreferrer"
                >
                  ${this.hass.localize("ui.errors.supervisor.observer")}
                </a>
              </li>
              <li>
                ${this.hass.localize("ui.errors.supervisor.reboot")}
              </li>
              <li>
                <a href="/config/info" target="_parent">
                  ${this.hass.localize("ui.errors.supervisor.system_health")}
                </a>
              </li>
              <li>
                <a
                  href="https://www.home-assistant.io/help/"
                  target="_blank"
                  rel="noreferrer"
                >
                  ${this.hass.localize("ui.errors.supervisor.ask")}
                </a>
              </li>
            </ol>
          </div>
        </ha-card>
      </hass-subpage>
    `;
  }

  private _applyTheme() {
    let themeName: string;
    let options: Partial<HomeAssistant["selectedTheme"]> | undefined;

    if (atLeastVersion(this.hass.config.version, 0, 114)) {
      themeName =
        this.hass.selectedTheme?.theme ||
        (this.hass.themes.darkMode && this.hass.themes.default_dark_theme
          ? this.hass.themes.default_dark_theme!
          : this.hass.themes.default_theme);

      options = this.hass.selectedTheme;
      if (themeName === "default" && options?.dark === undefined) {
        options = {
          ...this.hass.selectedTheme,
          dark: this.hass.themes.darkMode,
        };
      }
    } else {
      themeName =
        ((this.hass.selectedTheme as unknown) as string) ||
        this.hass.themes.default_theme;
    }

    applyThemesOnElement(
      this.parentElement,
      this.hass.themes,
      themeName,
      options
    );
  }

  static get styles(): CSSResultArray {
    return [
      haStyle,
      css`
        a {
          color: var(--mdc-theme-primary);
        }

        ha-card {
          width: 600px;
          margin: auto;
          padding: 8px;
        }
        @media all and (max-width: 500px) {
          ha-card {
            width: calc(100vw - 32px);
          }
        }
      `,
    ];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "supervisor-error-screen": SupervisorErrorScreen;
  }
}
