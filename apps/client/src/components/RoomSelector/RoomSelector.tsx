import { useState, useRef, useEffect, useEffectEvent } from "react";
import { motion, useMotionValue, animate, MotionValue } from "framer-motion";
import { useRooms, useCurrentRoom, useBuilding } from "@/hooks/";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import type { IRoom } from "@/types";
import { useHassUser } from "@/utils/HaConnect";

const calculateCurrentItem = (x, itemWidth) => {
  const currentScroll = x.get();
  return Math.floor(Math.abs(currentScroll) / itemWidth);
};

//TODO: Allow for actual free scrolling
export const RoomSelector = () => {
  const x = useMotionValue<number>(0);
  const { vibrate } = useHapticFeedback();
  const [currentItem, setCurrentItem] = useState(0);
  const { setCurrentRoom, currentRoom } = useCurrentRoom();
  const ref = useRef(null);
  const real_rooms = useRooms();
  const isMounted = useRef(false);

  const building = useBuilding(0);
  const user = useHassUser();

  const itemWidth = (96 + 40) * -1;
  const dragConstraints = {
    left: real_rooms.length * itemWidth,
    right: 0,
  };

  const onLoad = useEffectEvent((user) => {
    if (!user) return;
    if (!building.default_rooms) return;
    const default_room = building?.default_rooms.find(
      (entry) => entry.user_name === user?.name,
    );

    if (default_room) {
      setCurrentRoom(default_room.room_id);
    }
  });

  useEffect(() => {
    onLoad(user);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onRoomChange = useEffectEvent((currentRoom) => {
    const currentRoomIndex: number = real_rooms.findIndex((room: IRoom) => {
      return room.id === currentRoom;
    });

    setCurrentItem(currentRoomIndex);
    x.set(currentRoomIndex * itemWidth);
    if (isMounted.current) {
      vibrate("light");
    }
    isMounted.current = true;
  });

  useEffect(() => {
    onRoomChange(currentRoom);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom]);

  const onItemChange = useEffectEvent((currentItem: number) => {
    if (!real_rooms[currentItem]) return;

    setCurrentRoom(real_rooms[currentItem].id);
  });
  useEffect(() => {
    onItemChange(currentItem);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItem]);

  function handleDragEnd() {
    const newSelection = calculateCurrentItem(x, itemWidth * -1);
    setCurrentItem(newSelection);

    const moveTo = newSelection * itemWidth;

    animate(x, moveTo);
  }

  function handleOnDrag() {
    const newSelection = calculateCurrentItem(x, itemWidth * -1);
    setCurrentItem(newSelection);
  }

  function handleClick(index) {
    setCurrentItem(index);

    const to = index * itemWidth;
    animate(x, to, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  }

  return (
    <>
      <div className="inset-x-1">
        <motion.div
          drag="x"
          dragDirectionLock
          ref={ref}
          onDragEnd={handleDragEnd}
          style={{ x }}
          dragConstraints={dragConstraints}
          onDrag={handleOnDrag}
          dragElastic={0.2}
          whileDrag={{ cursor: "grabbing" }}
          className="relative flex items-center  h-12 w-24 bottom-0 gap-10 "
        >
          {real_rooms.map((room, index: number) => {
            return (
              <motion.div
                ref={ref}
                key={index}
                className={`flex-shrink-0 w-24 cursor-pointer select-none  ${
                  index === currentItem - 1 ||
                  index === currentItem + 1 ||
                  index === currentItem
                    ? ""
                    : "opacity-0"
                }`}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
                initial={true}
                onClick={() => handleClick(index)}
              >
                <div
                  className={`text-sm text-center font-medium whitespace-nowrap ${
                    index === currentItem
                      ? "text-[hsl(0,0%,90%)] bg-none"
                      : index === currentItem + 1
                        ? "bg-clip-text text-transparent bg-[linear-gradient(to_right,_#ffffff,_#000000)]"
                        : index === currentItem - 1
                          ? "bg-clip-text text-transparent bg-[linear-gradient(to_left,_#ffffff,_#000000)]"
                          : ""
                  }`}
                >
                  {room.alias ?? "Not named"}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </>
  );
};
