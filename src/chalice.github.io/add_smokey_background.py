from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import random

def add_smoke_trails(foreground_path, output_path, smoke_density=100):
    """Add smoke pixels protruding from the body edges"""
    # Load foreground image
    img = Image.open(foreground_path).convert('RGBA')
    pixels = np.array(img)

    # Find edge pixels (non-transparent pixels adjacent to transparent ones)
    alpha = pixels[:, :, 3]
    height, width = alpha.shape

    # Create output array
    result = pixels.copy()

    # Find edges by checking neighbors
    for y in range(1, height - 1):
        for x in range(1, width - 1):
            # If pixel is opaque
            if alpha[y, x] > 0:
                # Check if any neighbor is transparent (edge detection)
                neighbors_transparent = (
                    alpha[y-1, x] == 0 or alpha[y+1, x] == 0 or
                    alpha[y, x-1] == 0 or alpha[y, x+1] == 0
                )

                if neighbors_transparent and random.random() < 0.5:
                    # Add smoke trails extending outward
                    for i in range(random.randint(5, 20)):
                        # Random direction from this edge pixel
                        dx = random.randint(-2, 2)
                        dy = random.randint(-2, 2)

                        new_x = x + dx * i
                        new_y = y + dy * i

                        if 0 <= new_x < width and 0 <= new_y < height:
                            # Fade out smoke
                            fade = max(0, 255 - (i * 20))
                            gray = random.randint(40, 100)

                            # Only add smoke to transparent areas
                            if result[new_y, new_x, 3] < 128:
                                result[new_y, new_x] = [gray, gray, gray, fade]

    result_img = Image.fromarray(result.astype('uint8'))
    result_img = result_img.filter(ImageFilter.GaussianBlur(radius=1))
    result_img.save(output_path)
    print(f"Smoke trails added, saved to {output_path}")

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python add_smokey_background.py <input_image> [output_image]")
        sys.exit(1)

    input_image = sys.argv[1]
    output_image = sys.argv[2] if len(sys.argv) > 2 else "output_with_smoke.png"

    add_smoke_trails(input_image, output_image)
