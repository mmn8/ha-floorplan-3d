import type { Component, Card } from "@/renderer/Components";
import Room from "./Room";
import _RoomCard from "./HassRoom";

export const RoomComponent: Component = {
  name: "LightComponent",
  component: (props) => <Room {...props} />,
  visibleOnPreview: true,
};

export const RoomCard: Card = {
  name: "RoomCard",
  card: (props) => <_RoomCard {...props} />,
};
