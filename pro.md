# test

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

| Property             | Type                  | Default |
| :------------------- | :-------------------- | :------ |
| **`type`** (\*)      | `'icon'`              |         |
| **`entity_id`** (\*) | `string`              |         |
| `icon`               | `string`              |         |
| `render_light`       | `boolean`             | `true`  |
| `visible_preview`    | `boolean`             | `false` |
| `tap_action`         | [Action](#action)     |         |
| `double_tap_action`  | [Action](#action)     |         |
| `hold_action`        | [Action](#action)     |         |
| `position`           | [Position](#position) |         |

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

| Property            | Type                                                                 |
| :------------------ | :------------------------------------------------------------------- |
| **`id`** (\*)       | `string`                                                             |
| `alias`             | `string`                                                             |
| `tap_action`        | [Action](#action)                                                    |
| `ui`                | _Object with properties:_<ul><li>**`path`** (\*): `string`</li></ul> |
| `double_tap_action` | [Action](#action)                                                    |
| `entities`          | _Array of [Entity](#entity) items_                                   |

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

| Property                    | Type                   |
| :-------------------------- | :--------------------- |
| **`type`** (\*)             | `'temperatureDisplay'` |
| `font_size`                 | `number`               |
| `text_color`                | `string`               |
| **`top_sensor_id`** (\*)    | `string`               |
| **`bottom_sensor_id`** (\*) | `string`               |
| `precision`                 | `number`               |
| `position`                  | [Position](#position)  |
| `tap_action`                | [Action](#action)      |

_(\*) Required._

## UI

_Object containing the following properties:_

| Property         | Type                           |
| :--------------- | :----------------------------- |
| **`cards`** (\*) | `Array<[RoomCard](#roomcard)>` |

_(\*) Required._
