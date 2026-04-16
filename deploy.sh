#!/bin/bash
set -e

USERNAME="bonheur15"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMP_DIRS=()

cleanup() {
    local temp_dir
    for temp_dir in "${TEMP_DIRS[@]}"; do
        [ -n "$temp_dir" ] && rm -rf "$temp_dir"
    done
}

trap cleanup EXIT

build_and_push() {
    local dir_name="$1"
    local tag_name="$2"
    local build_context="$3"
    local image_name="hubfly-template-$dir_name"
    local full_image_name="$USERNAME/$image_name:$tag_name"

    echo "Building $image_name:$tag_name..."
    docker build -t "$image_name:$tag_name" "$build_context"

    echo "Tagging as $full_image_name..."
    docker tag "$image_name:$tag_name" "$full_image_name"

    echo "Pushing $full_image_name..."
    docker push "$full_image_name"
}

prepare_context() {
    local template_dir="$1"
    local variant_dir="${2:-}"
    local temp_dir

    temp_dir="$(mktemp -d)"
    TEMP_DIRS+=("$temp_dir")

    while IFS= read -r path; do
        cp -a "$path" "$temp_dir/"
    done < <(find "$template_dir" -mindepth 1 -maxdepth 1 ! -name tags)

    if [ -n "$variant_dir" ]; then
        while IFS= read -r path; do
            cp -a "$path" "$temp_dir/"
        done < <(find "$variant_dir" -mindepth 1 -maxdepth 1)
    fi

    echo "$temp_dir"
}

echo "Scanning templates..."
mapfile -t TEMPLATE_DIRS < <(find "$SCRIPT_DIR" -maxdepth 2 -mindepth 2 -name Dockerfile -printf '%P\n' | sed 's#/Dockerfile$##' | sort)

if [ ${#TEMPLATE_DIRS[@]} -eq 0 ]; then
    echo "No templates found (no Dockerfiles present)."
    exit 1
fi

echo "Templates detected:"
for DIR_NAME in "${TEMPLATE_DIRS[@]}"; do
    IMAGE_NAME="hubfly-template-$DIR_NAME"
    FULL_IMAGE_NAME="$USERNAME/$IMAGE_NAME:latest"
    echo "- $DIR_NAME -> $FULL_IMAGE_NAME"

    TAGS_DIR="$SCRIPT_DIR/$DIR_NAME/tags"
    if [ -d "$TAGS_DIR" ]; then
        while IFS= read -r TAG_DIR; do
            TAG_NAME="$(basename "$TAG_DIR")"
            echo "  $DIR_NAME/tags/$TAG_NAME -> $USERNAME/$IMAGE_NAME:$TAG_NAME"
        done < <(find "$TAGS_DIR" -mindepth 1 -maxdepth 1 -type d | sort)
    fi
done

for DIR_NAME in "${TEMPLATE_DIRS[@]}"; do
    TEMPLATE_PATH="$SCRIPT_DIR/$DIR_NAME"
    TAGS_DIR="$TEMPLATE_PATH/tags"

    echo "----------------------------------------------------"
    echo "Processing $DIR_NAME..."

    BASE_CONTEXT="$(prepare_context "$TEMPLATE_PATH")"
    build_and_push "$DIR_NAME" "latest" "$BASE_CONTEXT"

    if [ -d "$TAGS_DIR" ]; then
        while IFS= read -r TAG_DIR; do
            TAG_NAME="$(basename "$TAG_DIR")"
            TAG_CONTEXT="$(prepare_context "$TEMPLATE_PATH" "$TAG_DIR")"
            build_and_push "$DIR_NAME" "$TAG_NAME" "$TAG_CONTEXT"
        done < <(find "$TAGS_DIR" -mindepth 1 -maxdepth 1 -type d | sort)
    fi

    echo "Done with $DIR_NAME!"
done

echo "----------------------------------------------------"
echo "All deployments completed successfully."
