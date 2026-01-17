import { useMemo } from "react";
import { useBuilding, useFloorplan } from "@/hooks/useBuilding";
import ErrorBoundary from "@/utils/3DErrorBoundary";
import { renderComponent } from "@/renderer/Components";
import { useErrorStore, ErrorType } from "@/store/ErrorStore";

function Building({ building_id }) {
  const building = useBuilding(building_id);
  const floorplan = useFloorplan(building);
  const { addError } = useErrorStore();

  const comps = useMemo(() => {
    if (!floorplan) return null;

    return Object.entries(floorplan).flatMap(([key, items]) => {
      if (!Array.isArray(items)) return [];

      const Comp = renderComponent(key);
      if (!Comp) return [];

      return items.map((item, index) => {
        function onError(error) {
          addError({
            type: ErrorType.FATAL,
            title: error,
            description: key,
          });
        }

        return (
          <ErrorBoundary key={`${key}-${index}`} onError={onError}>
            <Comp key={`${key}-${index}`} {...item} building={building} />
          </ErrorBoundary>
        );
      });
    });
  }, [floorplan, building, addError]);

  return <>{comps}</>;
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
