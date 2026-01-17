<h1 align="center"> Ha floorplan 3d  </h1>
<h3 align="center">
  Interactive 3d floorplan for controlling your Home Assistant
</h3>


## Table of Contents

- [ Getting started](#-features)
- [ Getting started](#-installation)
- [ Configuring](#-usage)


## About the project
A small dashboard for Home Assistant that renders your floorplan based on [Sweet Home 3D](https://www.sweethome3d.com) file.


## Features

- Rendering floorplan based on Swet Home 3D file (.sh3d)

## Getting started 

### 1. Install the addon
Add the Addon repository to Home Assistant by clicking the button below or manually entering the repository url
```
https://github.com/mmn8/ha-floorplan-3d
```

[![Open your Home Assistant instance and show the add add-on repository dialog with a specific repository URL pre-filled.](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fmmn8%2Fha-floorplan-3d)

and then install addon from the addon store.

[![Open your Home Assistant instance and show the add-on store.](https://my.home-assistant.io/badges/supervisor_store.svg)](https://my.home-assistant.io/redirect/supervisor_store/)

### 2. Open the Addon's web interface
Upload your Sweet Home 3D file (.sh3d) to the setup wizard and if no errors occur you are prompted with the floorplan editor. Now you will need a way to edit your /addon_configs folder. I recommend the [Visual Studio Code Server](https://github.com/hassio-addons/addon-vscode) addon but any way to edit the folder works. All the addon configuration lives under /addon_configs. When you have the floorplan editor open and you edit the configuration the floorplan editor will automaticly hot-reload.


## Configuring the addon

The folder sturcture under the addon configuration is something like this:

```
/addon_configs/{SLUG}/
├── home.yml         # Entry point: Defines home name and links files.
├── home.xml         # Floorplan: Exported Sweet Home 3D data.
└── building.yml     # Logic: Room configs, entities to be displayed
```
The building.yml file's most important fields are members of the card array. Each of your room SweetHome ID and aliases are listed there. Here you configure where you want to display your entities, what [action](##Action) happens when something is clicked etc.

### Example of a building.yml file
```yaml
/addon_configs/{SLUG}/
└── building.yml 

title: "Home"
foorplan_name: "home.xml" # What floorplan to load

rooms:
  - id: room-ae706306-67b2-4bf3-a5aa-b14c97cde769 # Sweet Home 3D room uuid
    alias: My Room # Display name. Automaticly generated from sh3d file if present
    tap_action: # When you click on a room
      action: more-info 
      target:
          path: "room.yml"
    entities: # List of the entities displayed
      - type: icon # Type of the entity
        icon: plug-2 
        entity_id: light.hue_lightstrip_plus_1
        tap_action: # Action when you click on a icon
           action: call-service
           service: light.toggle
           target:
              entity_id: light.hue_lightstrip_plus_1
        position: 
            x: 700 
            y: 1260
            z: 150
      - type: temperatureDisplay
        font_size: 220 
        top_sensor_id: sensor.atc_efaf_temperature
        bottom_sensor_id: sensor.atc_efaf_humidity
        position:
          x: 700 
          y: 1195 
          z: 0
```

## Configuration schemas

## Action

_Union of the following possible types:_

- [MoreInfoAction](#moreinfoaction)
- [CallServiceAction](#callserviceaction)
- [MoreInfoHass](#moreinfohass)

## Building

_Object containing the following properties:_

| Property                  | Description                              | Type                           |
| :------------------------ | :--------------------------------------- | :----------------------------- |
| **`title`** (\*)          |                                          | `string`                       |
| **`floorplan_name`** (\*) | Path where buildings floorplan is loaded | `string`                       |
| **`rooms`** (\*)          |                                          | _Array of [Room](#room) items_ |

_(\*) Required._

## CallServiceAction

_Object containing the following properties:_

| Property           | Type                                                                      |
| :----------------- | :------------------------------------------------------------------------ |
| **`action`** (\*)  | `'call-service'`                                                          |
| **`service`** (\*) | `string`                                                                  |
| **`target`** (\*)  | _Object with properties:_<ul><li>**`entity_id`** (\*): `string`</li></ul> |

_(\*) Required._

## EntityCard

_Object containing the following properties:_

| Property             | Type                     |
| :------------------- | :----------------------- |
| **`entity_id`** (\*) | `string`                 |
| **`size`** (\*)      | `'md' \| 'sm' \| 'wide'` |
| `tap_action`         | [Action](#action)        |
| `double_tap_action`  | [Action](#action)        |
| `hold_action`        | [Action](#action)        |

_(\*) Required._

## Entity

_Union of the following possible types:_

- [IconEntity](#iconentity)
- [TemperatureDisplayEntity](#temperaturedisplayentity)

## HomeConfig

_Object containing the following properties:_

| Property             | Type            |
| :------------------- | :-------------- |
| **`title`** (\*)     | `string`        |
| **`buildings`** (\*) | `Array<string>` |

_(\*) Required._

## IconEntity

_Object containing the following properties:_

| Property             | Type                  |
| :------------------- | :-------------------- |
| **`type`** (\*)      | `'icon'`              |
| **`entity_id`** (\*) | `string`              |
| **`icon`** (\*)      | `string`              |
| `tap_action`         | [Action](#action)     |
| `double_tap_action`  | [Action](#action)     |
| `hold_action`        | [Action](#action)     |
| `position`           | [Position](#position) |

_(\*) Required._

## MoreInfoAction

_Object containing the following properties:_

| Property          | Type                                                                                                                                                                                     |
| :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`action`** (\*) | `'more-info'`                                                                                                                                                                            |
| **`target`** (\*) | _Object with properties:_<ul><li>**`path`** (\*): `string`</li></ul> _or_ _Object with properties:_<ul><li>**`cards`** (\*): `string`</li><li>**`bottomSheet`** (\*): `string`</li></ul> |

_(\*) Required._

## MoreInfoHass

_Object containing the following properties:_

| Property          | Type                                                                      |
| :---------------- | :------------------------------------------------------------------------ |
| **`action`** (\*) | `'hass-more-info'`                                                        |
| **`target`** (\*) | _Object with properties:_<ul><li>**`entity_id`** (\*): `string`</li></ul> |

_(\*) Required._

## Position

_Object containing the following properties:_

| Property     | Type     |
| :----------- | :------- |
| **`x`** (\*) | `number` |
| **`y`** (\*) | `number` |
| **`z`** (\*) | `number` |

_(\*) Required._

## RoomCard

_Object containing the following properties:_

| Property            | Description | Type                                                  |
| :------------------ | :---------- | :---------------------------------------------------- |
| **`type`** (\*)     |             | `'room'`                                              |
| **`title`** (\*)    | testi3ng    | `string` (_min length: 1_)                            |
| **`scenes`** (\*)   |             | _Array of at least 1 [Scene](#scene) items_           |
| **`entities`** (\*) |             | _Array of at least 1 [EntityCard](#entitycard) items_ |

_(\*) Required._

## Room

_Object containing the following properties:_

| Property            | Type                               |
| :------------------ | :--------------------------------- |
| **`id`** (\*)       | `string`                           |
| `alias`             | `string`                           |
| `tap_action`        | [Action](#action)                  |
| `double_tap_action` | [Action](#action)                  |
| `entities`          | _Array of [Entity](#entity) items_ |

_(\*) Required._

## Scene

_Object containing the following properties:_

| Property            | Type                       |
| :------------------ | :------------------------- |
| **`icon`** (\*)     | `string` (_min length: 1_) |
| **`title`** (\*)    | `string` (_min length: 1_) |
| `tap_action`        | [Action](#action)          |
| `double_tap_action` | [Action](#action)          |
| `hold_action`       | [Action](#action)          |

_(\*) Required._

## TemperatureDisplayEntity

_Object containing the following properties:_

| Property                    | Type                    |
| :-------------------------- | :---------------------- |
| **`type`** (\*)             | `'temperature_display'` |
| `font_size`                 | `number`                |
| **`top_sensor_id`** (\*)    | `string`                |
| **`bottom_sensor_id`** (\*) | `string`                |
| `position`                  | [Position](#position)   |
| `tap_action`                | [Action](#action)       |

_(\*) Required._


