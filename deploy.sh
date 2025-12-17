#!/bin/bash
set -e

USERNAME="bonheur15"

# Loop through all directories
for d in */ ; do
    # Remove trailing slash
    DIR_NAME="${d%/}"
    
    # Check if Dockerfile exists in the directory
    if [ -f "$DIR_NAME/Dockerfile" ]; then
        IMAGE_NAME="hubfly-template-$DIR_NAME"
        FULL_IMAGE_NAME="$USERNAME/$IMAGE_NAME:latest"

        echo "----------------------------------------------------"
        echo "Processing $DIR_NAME..."
        echo "Building $IMAGE_NAME..."
        
        # Build
        docker build -t "$IMAGE_NAME" "./$DIR_NAME"
        
        # Tag
        echo "Tagging as $FULL_IMAGE_NAME..."
        docker tag "$IMAGE_NAME" "$FULL_IMAGE_NAME"
        
        # Push
        echo "Pushing $FULL_IMAGE_NAME..."
        docker push "$FULL_IMAGE_NAME"
        
        echo "Done with $DIR_NAME!"
    else
        echo "Skipping $DIR_NAME (no Dockerfile found)"
    fi
done

echo "----------------------------------------------------"
echo "All deployments completed successfully."
