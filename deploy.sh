#!/bin/bash
set -e

USERNAME="bonheur15"

echo "Scanning templates..."
mapfile -t TEMPLATE_DIRS < <(find . -maxdepth 2 -mindepth 2 -name Dockerfile -printf '%h\n' | sed 's#^\./##' | sort)

if [ ${#TEMPLATE_DIRS[@]} -eq 0 ]; then
    echo "No templates found (no Dockerfiles present)."
    exit 1
fi

echo "Templates detected:"
for DIR_NAME in "${TEMPLATE_DIRS[@]}"; do
    IMAGE_NAME="hubfly-template-$DIR_NAME"
    FULL_IMAGE_NAME="$USERNAME/$IMAGE_NAME:latest"
    echo "- $DIR_NAME -> $FULL_IMAGE_NAME"
done

for DIR_NAME in "${TEMPLATE_DIRS[@]}"; do
    IMAGE_NAME="hubfly-template-$DIR_NAME"
    FULL_IMAGE_NAME="$USERNAME/$IMAGE_NAME:latest"

    echo "----------------------------------------------------"
    echo "Processing $DIR_NAME..."
    echo "Building $IMAGE_NAME..."

    docker build -t "$IMAGE_NAME" "./$DIR_NAME"

    echo "Tagging as $FULL_IMAGE_NAME..."
    docker tag "$IMAGE_NAME" "$FULL_IMAGE_NAME"

    echo "Pushing $FULL_IMAGE_NAME..."
    docker push "$FULL_IMAGE_NAME"

    echo "Done with $DIR_NAME!"
done

echo "----------------------------------------------------"
echo "All deployments completed successfully."
