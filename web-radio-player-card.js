import { LitElement, html, css } from "lit";

class WebRadioPlayerCard extends LitElement {
    static get properties() {
        return {
            hass: {},
            config: {},
            connections: { state: true },
            dragOverPlayer: { state: true },
        };
    }

    setConfig(config) {
        if (!config.media_players || !Array.isArray(config.media_players)) {
            throw new Error("media_players must be an array of entity_ids");
        }
        this.config = config;
        this.connections = {};
    }

    handleDragOver(e, entity_id) {
        e.preventDefault();
        this.dragOverPlayer = entity_id;
    }

    handleDragLeave() {
        this.dragOverPlayer = null;
    }

    handleDrop(entity_id) {
        this.dragOverPlayer = null;
        const station = this.draggedStation;
        if (!station) return;

        this.hass.callService("media_player", "play_media", {
            entity_id,
            media_content_id: station.url,
            media_content_type: "music",
        });

        this.connections = {
            ...this.connections,
            [entity_id]: station,
        };
    }

    render() {
        if (!this.hass || !this.config) return html``;

        return html`
      <div class="players">
        ${this.config.media_players.map(entity_id => {
            const stateObj = this.hass.states[entity_id];
            const name = stateObj?.attributes.friendly_name ?? entity_id;
            const unavailable =
                !stateObj || ["unavailable", "unknown"].includes(stateObj.state);

            const stationName =
                (stateObj?.state === "playing" || stateObj?.state === "paused")
                    ? this.connections[entity_id]?.name
                    : null;

            const classes = unavailable
                ? "player unavailable"
                : this.dragOverPlayer === entity_id
                    ? "player dragover"
                    : "player";

            return html`
            <div
              class="${classes}"
              id="${entity_id}"
              @dragover=${e => this.handleDragOver(e, entity_id)}
              @dragleave=${this.handleDragLeave}
              @drop=${() => this.handleDrop(entity_id)}
            >
              <strong>${name}</strong>
              ${stationName
                    ? html`<span class="playing-station">${stationName}</span>`
                    : ""}
            </div>
          `;
        })}
      </div>

      <div class="stations">
        ${this.config.stations.map(station => html`
          <div
            class="station"
            draggable="true"
            @dragstart=${() => (this.draggedStation = station)}
          >
            ${station.name}
          </div>
        `)}
      </div>
    `;
    }

    static get styles() {
        return css`
      .player {
        border: 1px solid var(--divider-color);
        padding: 8px;
        margin-bottom: 6px;
        border-radius: 6px;
      }
      .player.dragover {
        background: var(--primary-color);
        color: white;
      }
      .player.unavailable {
        opacity: 0.5;
      }
      .playing-station {
        display: block;
        font-size: 0.9em;
        opacity: 0.8;
      }
      .station {
        cursor: grab;
        padding: 6px;
      }
    `;
    }

    static getStubConfig() {
        return {
            stations: [
                {
                    name: "Radio 538",
                    url: "http://playerservices.streamtheworld.com/api/livestream-redirect/RADIO538.mp3",
                },
            ],
            media_players: [],
        };
    }
}

const includeDomains = ["media_player"];

class WebRadioPlayerCardEditor extends LitElement {
    static get properties() {
        return {
            hass: {},
            config: {},
        };
    }

    setConfig(config) {
        this.config = config;
    }

    configChanged(config) {
        this.dispatchEvent(
            new CustomEvent("config-changed", {
                detail: { config },
            })
        );
    }

    updateStation(index, field, value) {
        const stations = [...(this.config.stations || [])];
        stations[index] = { ...stations[index], [field]: value };
        this.configChanged({ ...this.config, stations });
    }

    addStation() {
        const stations = [...(this.config.stations || []), { name: "", url: "" }];
        this.configChanged({ ...this.config, stations });
    }

    removeStation(index) {
        const stations = [...(this.config.stations || [])];
        stations.splice(index, 1);
        this.configChanged({ ...this.config, stations });
    }

    updatePlayer(index, value) {
        const media_players = [...(this.config.media_players || [])];
        media_players[index] = value;
        this.configChanged({ ...this.config, media_players });
    }

    addPlayer() {
        const media_players = [...(this.config.media_players || []), ""];
        this.configChanged({ ...this.config, media_players });
    }

    removePlayer(index) {
        const media_players = [...(this.config.media_players || [])];
        media_players.splice(index, 1);
        this.configChanged({ ...this.config, media_players });
    }

    static get styles() {
        return css`
            .row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
            input { padding: 8px; width: 100%; box-sizing: border-box; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); }
            ha-entity-picker { width: 100%; }
            button { cursor: pointer; padding: 8px; background: var(--primary-color); color: var(--text-primary-color); border: none; border-radius: 4px; }
        `;
    }

    render() {
        if (!this.hass || !this.config) return html``;

        return html`
      <h3>Stations</h3>
      ${(this.config.stations || []).map((s, i) => html`
        <div class="row">
            <input type="text" placeholder="Name" .value="${s.name || ''}" @input="${e => this.updateStation(i, 'name', e.target.value)}">
            <input type="text" placeholder="URL" .value="${s.url || ''}" @input="${e => this.updateStation(i, 'url', e.target.value)}">
            <button @click="${() => this.removeStation(i)}">X</button>
        </div>
      `)}
      <button @click="${() => this.addStation()}">Add Station</button>

      <h3>Players</h3>
      ${(this.config.media_players || []).map((entity_id, i) => html`
        <div class="row">
          <ha-entity-picker
            .hass=${this.hass}
            .value=${entity_id}
            .includeDomains=${includeDomains}
            @value-changed=${e => this.updatePlayer(i, e.detail.value)}
          ></ha-entity-picker>
          <button @click=${() => this.removePlayer(i)}>✕</button>
        </div>
      `)}
      <button @click=${() => this.addPlayer()}>Add Player</button>
    `;
    }
}

customElements.define("web-radio-player-card", WebRadioPlayerCard);
customElements.define("web-radio-player-card-editor", WebRadioPlayerCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
    type: "web-radio-player-card",
    name: "Web Radio Player Card",
    description: "Drag radio stations onto media players",
});
