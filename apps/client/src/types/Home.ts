
export type Point = { x: number; y: number };
export interface Floorplan {
	camera: string;
	compass: Compass;
	dimensionLine: [];
	doorOrWindow: [];
	environment: Environment;
	furnitureSortedProperty: string;
	furnitureVisibleProperty: { name: string }[];
	label: Label;
	light: [];
	name: string;
	observerCamera: [];
	pieceOfFurniture: [];
	property: Property[];
	room: FRoom[];
	version: string;
	wall: [];
	wallHeight: string;
}

/* eslint-disable  @typescript-eslint/no-explicit-any */

interface Compass {
	x: string;
	y: string;
	diameter: string;
	northDirection: string;
	longitude: string;
	[key: string]: any;
}

export interface FRoom {
	id: string;
	name: string;
	point: Point[];
	areaVisible: 'true' | 'false' | string;
	ceilingVisible: 'true' | 'false' | string;
	ceilingFlat?: 'true' | 'false' | string;
}

interface Environment {
	groundColor: string;
	skyColor: string;
	lightColor: string;
	ceillingLightColor: string;
	photoWidth: string;
	[key: string]: any;
}

interface Label {
	textStyle: {
		fontSize: string;
		[key: string]: any;
	};
	text: string;
	id: string;
	x: string;
	y: string;
	[key: string]: any;
}

interface Property {
	name: string;
	value: string;
}


