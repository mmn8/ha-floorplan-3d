#!/bin/sh

echo STARTING APP

TEMP_PATH=/tmp/ha-floorplan
FINAL_DESTINATION=/app/resources

mkdir -p $TEMP_PATH
mkdir -p $CONFIG_PATH/external
mkdir -p $CONFIG_PATH/internal
mkdir -p /zips
mkdir -p $FINAL_DESTINATION/models

# cp $TEMP_PATH/models/gltf/* $FINAL_DESTINATION/models/

#clean up
# rm -r "$TEMP_PATH"

# echo "Script finished."

echo "Bash script running pre-checks with config: $CONFIG_PATH"

export CONFIG_DIR=$CONFIG_PATH
export MODE=prod

exec /app/backend-exec
