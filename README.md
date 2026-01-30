# Web Radio Player Card

A custom Lovelace card for Home Assistant that allows you to play radio streams on your media players using a simple drag-and-drop interface.

## Features

- **Drag & Drop:** Drag a radio station and drop it onto a media player to start playback immediately.
- **Status Display:** Shows which station is currently linked to a player when it is playing.
- **Player Status:** Visually indicates if a player is unavailable.
- **More Info:** Long-press (or click and hold) a player to open the standard Home Assistant more-info dialog for that entity.

## Installation
### HACS (Recommended)
1. This card is available in the Home Assistant Community Store (HACS). If you don't have HACS, you can install it from [hacs.xyz](https://hacs.xyz/).
2. Open HACS, go to the "Frontend" section, and click the "Explore & Add Repositories" button.
3. Search for "Web Radio Player Card" and add it.
4. HACS will automatically manage the installation and add the required resource to your Lovelace configuration.

### Manual Installation
1. Download `web-radio-player-card.js` from the latest release of this repository.
2. Place the downloaded file in your Home Assistant `config/www` folder.
3. Add the resource to your dashboard configuration:
   - Go to **Settings** > **Dashboards**.
   - Click the 3-dots menu in the top right and select **Resources**.
   - Click **Add Resource**.
   - Set the URL to `/local/web-radio-player-card.js` and the Resource Type to `JavaScript Module`.
4. Refresh your browser.

## Configuration

Add the card to your dashboard view via YAML.

### Options

| Name | Type | Requirement | Description |
|---|---|---|---|
| `type` | string | **Required** | Must be `custom:web-radio-player-card`. |
| `stations` | list | **Required** | A list of radio station objects. |
| `media_players` | list | **Required** | A list of objects containing `entity_id`. |

### Finding Radio Streams

A great resource for finding radio stream URLs is Radio Browser, a community-driven database of internet radio stations.

To find a stream URL:
1.  Go to www.radio-browser.info.
2.  Use the search bar to find your desired station.
3.  In the results table, locate the station you want.
4.  Hover over the station name to see the stream URL. A copy icon will appear next to it. Click the icon to copy the URL.
5.  It's recommended to test the URL by pasting it into your browser's address bar to ensure it's a direct, working stream. MP3 streams are generally well-supported by most media players.

### Station Object

| Name | Type | Description |
|---|---|---|
| `name` | string | The display name of the station. |
| `url` | string | The stream URL for the radio station. |

### Example Configuration

```yaml
type: custom:web-radio-player-card
stations:
  - name: "Radio 538"
    url: "http://playerservices.streamtheworld.com/api/livestream-redirect/RADIO538.mp3"
  - name: "Sky Radio"
    url: "http://playerservices.streamtheworld.com/api/livestream-redirect/SKYRADIO.mp3"
  - name: "Q-Music"
    url: "https://icecast-qmusicnl-cdp.triple-it.nl/Qmusic_nl_live_96.mp3"
media_players:
  - entity_id: media_player.living_room_speaker
  - entity_id: media_player.office_google_home
```

## Usage

1. The card displays your configured **Stations** at the top and **Players** at the bottom.
2. Click and drag a **Station** box.
3. Drop it onto a **Player** box.
4. The stream will start playing on that device.