import React from "react";
import { Html } from "@react-three/drei";
import { useEntity } from "@/utils/HaConnect";
import { motion } from "framer-motion";
import type { Component } from "@/renderer/Components";
import { useEvaluateAction } from "@/utils/EvaluateAction";
import type { ITemperatureDisplay, IAction } from "@/types";

const TemperatureDisplayComponent: Component = {
  name: "LightComponent",
  component: (props: ITemperatureDisplay) => <TemperatureDisplay {...props} />,
  visibleOnPreview: true,
};

const default_action = (entity_id: string) => {
  return {
    action: "hass-more-info",
    target: {
      entity_id: entity_id,
    },
  } as IAction;
};

const roundWithDecimals = (number: number, precision: number) => {
  return Number(
    Math.round(Number(number + "e" + precision)) + "e-" + precision,
  );
};

//TODO: Add unit of measurement,
//TODO: add dynamicly sized boxes so click boxes arent fucked
const TemperatureDisplay: React.FC<ITemperatureDisplay> = ({
  top_sensor_id,
  bottom_sensor_id,
  position,
  font_size,
  tap_action,
  text_color = "#fffff",
  precision = 1,
}) => {
  const { evaluateAction } = useEvaluateAction();

  const topValue = String(
    roundWithDecimals(Number(useEntity(top_sensor_id)?.state ?? 0), precision),
  );

  const bottomValue = String(
    roundWithDecimals(
      Number(useEntity(bottom_sensor_id)?.state ?? 0),
      precision,
    ),
  );

  const fontSizeWithPixels = (factor: number) => {
    return font_size * factor + "px";
  };

  function handleClick() {
    evaluateAction(
      tap_action ?? default_action(top_sensor_id ?? bottom_sensor_id ?? ""),
    );
  }

  return (
    <>
      <Html
        position={[position.x / 100, position.z / 100, position.y / 100]}
        rotation={[-Math.PI / 2, 0, 0]}
        distanceFactor={1}
        transform
        zIndexRange={[10, 0]}
        style={{
          userSelect: "none",
        }}
      >
        <motion.div
          style={{
            color: "white",
            userSelect: "none",
            cursor: "default",
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          transition={{
            duration: 0.2,
            scale: { type: "spring", visualDuration: 0.2, bounce: 0.5 },
          }}
          onClick={handleClick}
        >
          <div
            className={`flex flex-col items-center  ${bottom_sensor_id ? "w-150 h-140" : "w-140 h-85"}`}
            style={{
              fontSize: fontSizeWithPixels(1),
              color: text_color,
            }}
          >
            {top_sensor_id && (
              <div>
                <span className={"font-bold"}>{topValue}</span>
                <span
                  className="align-text-top"
                  style={{ fontSize: fontSizeWithPixels(0.4) }}
                >
                  °C
                </span>
              </div>
            )}

            {bottom_sensor_id && (
              <div className=" -mt-30 text-center ">
                <span
                  style={{
                    fontSize: fontSizeWithPixels(0.75),
                    color: text_color,
                  }}
                >
                  {bottomValue}
                </span>
                <span
                  className="font-bold"
                  style={{ fontSize: fontSizeWithPixels(0.4) }}
                >
                  %
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </Html>
    </>
  );
};
export default TemperatureDisplayComponent;
