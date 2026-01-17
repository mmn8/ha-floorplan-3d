ZIP_URL="https://sf-eu-introserv-1.dl.sourceforge.net/project/sweethome3d/SweetHome3D-source/SweetHome3D-7.5-src/SweetHome3D-7.5-src.zip?viasf=1"

DOWNLOAD_PATH=download.zip

TEMP_PATH=tmp
FINAL_DESTINATION=resources

download_models() {
    echo "Starting download and unzip process..."

    echo "--- Step 1: Downloading file ---"
    curl --progress-bar -L -o "$DOWNLOAD_PATH" "$ZIP_URL"
    DOWNLOAD_STATUS=$?

    if [ $DOWNLOAD_STATUS -ne 0 ]; then
        echo "Error: Download failed (status code $DOWNLOAD_STATUS)."
        exit 1
    fi

    echo "Download done"
}


unzip_download() {
    unzip -q -o $DOWNLOAD_PATH -d $TEMP_PATH
    echo "unzip finished"
}

convert() {
    echo "creating $TEMP_PATH/models/obj"
    mkdir -p $TEMP_PATH/models/obj

    cp -r $TEMP_PATH/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/io/resources/* $TEMP_PATH/models/obj
    cp $TEMP_PATH/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/io/DefaultFurnitureCatalog.properties $FINAL_DESTINATION

    mkdir -p $TEMP_PATH/models/gltf

    for file in "$TEMP_PATH/models/obj"/*.obj; do
        if [ -f "$file" ]; then
            just_the_name=$(basename "$file")
            echo $just_the_name
            obj2gltf -i "$TEMP_PATH/models/obj/$just_the_name" -o "$TEMP_PATH/models/gltf/$just_the_name"
        fi
    done

}

mkdir -p $FINAL_DESTINATION/models

download_models
unzip_download
convert

cp -r $TEMP_PATH/models/gltf/* $FINAL_DESTINATION/models


