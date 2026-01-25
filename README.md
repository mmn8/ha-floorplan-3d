# Ha Floorplan 3D

Ha Floorplan 3D is a digital twin of your home. It is a Home Assistant dashboard that allows you to control your smart home from a 3D view. It renders the floorplan based on your [Sweet Home 3D](https://www.sweethome3d.com) file. 

**Disclaimer 1:** currently the app is "mobile-first". Meaning there is not a desktop UI yet

**Disclaimer 2:** the software is in **beta** stage: a lot of features are missing and don't be suprised if you find a bug and please report it in issues tab.



## Table Of Contents
* [Features](#features)
* [Getting started](#getting-started)
* [Basic usage](#basic-usage)
* [All configuration options](#configuration-schemas)
* [Known missing things](#known-missing-things)

## Features
* **Rendering .sh3d file:** Rendering walls, rooms, doors and windows, basic furniture.
* **Simple config:** Simple config to configure floorplan
* **Simple mobile UI for cards:** Possible to render few basic cards
* **Furniture:** The base (about 100 pieces) furniture set of Sweet Home 3D is currently supported


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

#### 1. Upload your floorplan
Upload your Sweet Home 3D file (.sh3d) to the setup wizard. Once processed the floorplan editor will launch.

#### 2. How to configure?
Configuration files are stored in your ```/addon_configs``` folder. To manage these files you will need a file editor
* **Recommended:** [Visual Studio Code Server](https://github.com/hassio-addons/addon-vscode)
* **Alternative:** Any way to edit your /addon_configs, so ssh, samba, etc

#### 3. Hot reloading
Once you have the floorplan editor open and you make a change to the config the editor will automaticly reload.

## Basic usage

The folder sturcture under the ```/addon_configs``` is something like this:

```
/addon_configs/{SLUG}/
├── home.yml         # Entry point: Defines home name and links files.
├── home.xml         # Floorplan: Exported Sweet Home 3D data.
└── building.yml     # Logic: Room configs, entities to be displayed
```


The cards section of your building.yml is the foundation of your floorplan. All rooms of SweetHome 3D are listed there. Here you configure what is visible on the floorplan.

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
List of all the possible options to configure the app

## Table of Contents

* [Building](#building)
* [Room](#room)
* [Entity](#entity)
    * [IconEntity](#iconentity)
    * [TemperatureDisplayEntity](#temperaturedisplayentity)
* [Action](#action)
    * [CallServiceAction](#callserviceaction)
    * [MoreInfoAction](#moreinfoaction)
    * [MoreInfoHass](#moreinfohass)
* [HomeConfig](#homeconfig)
* [Position](#position)
* [UI](#ui)
    * [RoomCard](#roomcard)
    * [Scene](#scene)
    * [EntityCard](#entitycard)

## Action

_Union of the following possible types:_

- [MoreInfoAction](#moreinfoaction)
- [CallServiceAction](#callserviceaction)
- [MoreInfoHass](#moreinfohass)

## Building

_Object containing the following properties:_

| Property                  | Description                               | Type                           |
| :------------------------ | :---------------------------------------- | :----------------------------- |
| **`title`** (\*)          |                                           | `string`                       |
| **`floorplan_name`** (\*) | Path where buildings floorplan is loaded  | `string`                       |
| `default_rooms`           | What room to show first depending on user | [DefaultRooms](#defaultrooms)  |
| **`rooms`** (\*)          |                                           | _Array of [Room](#room) items_ |

_(\*) Required._

## CallServiceAction

_Object containing the following properties:_

| Property           | Type                                                                      |
| :----------------- | :------------------------------------------------------------------------ |
| **`action`** (\*)  | `'call-service'`                                                          |
| **`service`** (\*) | `string`                                                                  |
| **`target`** (\*)  | _Object with properties:_<ul><li>**`entity_id`** (\*): `string`</li></ul> |

_(\*) Required._

## DefaultRooms

_Array of objects containing the following properties:_

| Property             | Description             | Type     |
| :------------------- | :---------------------- | :------- |
| **`user_name`** (\*) | Home assistant username | `string` |
| **`room_id`** (\*)   | Sweet home 3D room uuid | `string` |

_(\*) Required._

## EntityCard

_Object containing the following properties:_

| Property             | Description                        | Type                     |
| :------------------- | :--------------------------------- | :----------------------- |
| **`entity_id`** (\*) |                                    | `string`                 |
| **`size`** (\*)      | Size of card shown on bottom sheet | `'md' \| 'sm' \| 'wide'` |
| `tap_action`         |                                    | [Action](#action)        |
| `double_tap_action`  |                                    | [Action](#action)        |
| `hold_action`        |                                    | [Action](#action)        |

_(\*) Required._

## Entity

_Union of the following possible types:_

- [IconEntity](#iconentity)
- [TemperatureDisplayEntity](#temperaturedisplayentity)

## HomeConfig

_Object containing the following properties:_

| Property             | Description               | Type            |
| :------------------- | :------------------------ | :-------------- |
| **`name`** (\*)      |                           | `string`        |
| **`buildings`** (\*) | Path to building.yml file | `Array<string>` |

_(\*) Required._

## IconEntity

_Object containing the following properties:_

| Property             | Description                                  | Type                  | Default |
| :------------------- | :------------------------------------------- | :-------------------- | :------ |
| **`type`** (\*)      |                                              | `'icon'`              |         |
| **`entity_id`** (\*) | Entity whose state is used                   | `string`              |         |
| `icon`               | A icon shown (Lucide Icons)                  | `string`              |         |
| `render_light`       | Is light rendered. False for example sockets | `boolean`             | `true`  |
| `visible_preview`    | Is shown on preview mode                     | `boolean`             | `false` |
| `tap_action`         |                                              | [Action](#action)     |         |
| `double_tap_action`  |                                              | [Action](#action)     |         |
| `hold_action`        |                                              | [Action](#action)     |         |
| **`position`** (\*)  | Position in 3d space                         | [Position](#position) |         |

_(\*) Required._

## MoreInfoAction

_Object containing the following properties:_

| Property          | Type          |
| :---------------- | :------------ |
| **`action`** (\*) | `'more-info'` |

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

Card with scene select and grid of entities displayed on bottom sheet

_Object containing the following properties:_

| Property            | Description                | Type                                                  |
| :------------------ | :------------------------- | :---------------------------------------------------- |
| **`type`** (\*)     |                            | `'room'`                                              |
| **`title`** (\*)    | Name shown on bottom sheet | `string` (_min length: 1_)                            |
| **`scenes`** (\*)   |                            | _Array of at least 1 [Scene](#scene) items_           |
| **`entities`** (\*) |                            | _Array of at least 1 [EntityCard](#entitycard) items_ |

_(\*) Required._

## Room

_Object containing the following properties:_

| Property            | Description                                   | Type                                                                 |
| :------------------ | :-------------------------------------------- | :------------------------------------------------------------------- |
| **`id`** (\*)       | Sweet Home 3D room uuid                       | `string`                                                             |
| **`alias`** (\*)    | Display name used e.g in bottom room selector | `string`                                                             |
| `tap_action`        |                                               | [Action](#action)                                                    |
| `ui`                | Path to where bottom sheet ui is loaded       | _Object with properties:_<ul><li>**`path`** (\*): `string`</li></ul> |
| `double_tap_action` |                                               | [Action](#action)                                                    |
| `entities`          | List of entities associated with room         | _Array of [Entity](#entity) items_                                   |

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

| Property                 | Description          | Type                   |
| :----------------------- | :------------------- | :--------------------- |
| **`type`** (\*)          |                      | `'temperatureDisplay'` |
| `font_size`              |                      | `number`               |
| `text_color`             |                      | `string`               |
| **`top_sensor_id`** (\*) |                      | `string`               |
| `bottom_sensor_id`       |                      | `string`               |
| `precision`              |                      | `number`               |
| **`position`** (\*)      | Position in 3d space | [Position](#position)  |
| `tap_action`             |                      | [Action](#action)      |

_(\*) Required._

## UI

_Object containing the following properties:_

| Property         | Type                           |
| :--------------- | :----------------------------- |
| **`cards`** (\*) | `Array<[RoomCard](#roomcard)>` |

_(\*) Required._

## Known missing things
* Multi floor support
* Support for more furniture
* Making it look actually **cool**
* Optimizations
* Multi building rendering
* Better documentation

