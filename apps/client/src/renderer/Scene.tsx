import { useMemo } from "react";
import { useBuilding } from "@/hooks";
import ErrorBoundary from "@/utils/3DErrorBoundary";
import { renderComponent } from "@/renderer/Components";
import { useErrorStore, ErrorType } from "@/store/ErrorStore";

interface BuildingProps {
  building_id: number;
}

function Building({ building_id }: BuildingProps) {
  const building = useBuilding(building_id);
  const { addError } = useErrorStore();

  const objectsToRender = useMemo(() => {
    if (!building.floorplan) return [];

    return Object.entries(building.floorplan).flatMap(([key, items]) => {
      if (!Array.isArray(items)) return [];

      return items.map((item, index) => {
        return { key: key, data: item, index: index };
      });
    });
  }, [building.floorplan]);

  return (
    <>
      {objectsToRender.map((item, index) => {
        const Comp = renderComponent(item.key);
        if (!Comp) return null;

        function onError(error) {
          addError({
            type: ErrorType.FATAL,
            title: error,
            description: item.key,
          });
        }

        return (
          <ErrorBoundary key={`${item.key}-${index}`} onError={onError}>
            <Comp {...item.data} building={building} />
          </ErrorBoundary>
        );
      })}
    </>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.5} color="#f4fffa" />
      <Building building_id={0} />
    </>
  );
}
export default Scene;
