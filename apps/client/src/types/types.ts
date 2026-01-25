import * as z from "zod"
import { Floorplan } from "./Home";


export const PositionSchema = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number(),
});

export const MoreInfoActionSchema = z.object({
	action: z.literal("more-info"),
})

export const MoreInfoHass = z.object({
	action: z.literal("hass-more-info"),
	target: z.object({
		entity_id: z.string()
	})

});

export const CallServiceActionSchema = z.object({
	action: z.literal("call-service"),
	service: z.string(),
	target: z.object({
		entity_id: z.string()
	})
});

export const ActionSchema = z.discriminatedUnion("action", [
	MoreInfoActionSchema.describe("Action to show current room's bottom sheet"),
	CallServiceActionSchema.describe("Call Home Assistant service"),
	MoreInfoHass.describe("Show Home Assistant more info dialog")
]);

export const IconEntitySchema = z.object({
	type: z.literal("icon"),
	entity_id: z.string().describe("Entity whose state is used"),
	icon: z.string().optional().describe("A icon shown (Lucide Icons)"),
	render_light: z.boolean().optional().default(true).describe("Is light rendered. False for example sockets"),
	visible_preview: z.boolean().optional().default(false).describe("Is shown on preview mode"),
	tap_action: ActionSchema.optional(),
	double_tap_action: ActionSchema.optional(),
	hold_action: ActionSchema.optional(),
	position: PositionSchema.describe("Position in 3d space"),
});

export const TemperatureDisplayEntitySchema = z.object({
	type: z.literal("temperatureDisplay"),
	font_size: z.number().optional(),
	text_color: z.string().optional(),
	top_sensor_id: z.string(),
	bottom_sensor_id: z.string().optional(),
	precision: z.number().optional(),
	position: PositionSchema.describe("Position in 3d space"),
	tap_action: ActionSchema.optional(),
});

export const EntitySchema = z.discriminatedUnion("type", [
	IconEntitySchema,
	TemperatureDisplayEntitySchema,
]);

export const RoomSchema = z.object({
	id: z.string().describe("Sweet Home 3D room uuid"),
	alias: z.string().describe("Display name used e.g in bottom room selector"),
	tap_action: ActionSchema.optional(),
	ui: z.object({
		path: z.string()
	}).optional().describe("Path to where bottom sheet ui is loaded"),
	double_tap_action: ActionSchema.optional(),
	entities: z.array(EntitySchema).optional().describe("List of entities associated with room"),
});

export const HomeConfigSchema = z.object({
	name: z.string(),
	buildings: z.array(z.string()).describe("Path to building.yml file")
})

export const DefaultRoomsSchema = z.array(z.object({
	user_name: z.string().describe("Home assistant username"),
	room_id: z.string().describe("Sweet home 3D room uuid"),
}))


export const BuildingSchema = z.object({
	title: z.string(),
	floorplan_name: z.string().describe("Path where buildings floorplan is loaded"),
	default_rooms: DefaultRoomsSchema.optional().describe("What room to show first depending on user"),
	rooms: z.array(RoomSchema),
});


export const SceneSchema = z.object({
	icon: z.string().min(1, "Icon shown. (Lucide icons)"),
	title: z.string().min(1, "Title shown"),
	tap_action: ActionSchema.optional(),
	double_tap_action: ActionSchema.optional(),
	hold_action: ActionSchema.optional()

}).strict();

export const EntityCard = z.object({
	entity_id: z.string(),
	size: z.enum(["md", "sm", "wide"]).describe("Size of card shown on bottom sheet"),
	tap_action: ActionSchema.optional(),
	double_tap_action: ActionSchema.optional(),
	hold_action: ActionSchema.optional()
})

export const RoomCardSchema = z.object({
	type: z.literal("room"),
	title: z.string().min(1).describe("Name shown on bottom sheet"),
	scenes: z.array(SceneSchema).min(1),
	entities: z.array(EntityCard).min(1),
}).describe("Card with scene select and grid of entities displayed on bottom sheet")

export const UISchema = z.object({
	cards: z.array(z.discriminatedUnion("type", [RoomCardSchema]))
})

export interface IBuildingData extends IBuilding {
	floorplan: Floorplan;
}

export interface IHomeData {
	title: string;
	buildings: IBuildingData[];
}


export type IBuilding = z.infer<typeof BuildingSchema>;
export type IEntity = z.infer<typeof EntitySchema>
export type IRoom = z.infer<typeof RoomSchema>
export type IAction = z.infer<typeof ActionSchema>
export type IPosition = z.infer<typeof PositionSchema>
export type IHomeConfig = z.infer<typeof HomeConfigSchema>
export type IIcon = z.infer<typeof IconEntitySchema>
export type ISceneIcon = z.infer<typeof SceneSchema>
export type IRoomCard = z.infer<typeof RoomCardSchema>
export type IDeviceCard = z.infer<typeof EntityCard>
export type IUISchema = z.infer<typeof UISchema>
export type IMoreInfoAction = z.infer<typeof MoreInfoActionSchema>
export type ITemperatureDisplay = z.infer<typeof TemperatureDisplayEntitySchema>
export type IDefaultRoomConfig = z.infer<typeof DefaultRoomsSchema>






