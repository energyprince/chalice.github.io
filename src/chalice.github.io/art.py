from PIL import Image
import numpy as np
import random
from rembg import remove

def pixel_sort_row(pixels, threshold=100, reverse=False):
    """Sort a row of pixels based on brightness"""
    intervals = []
    start = None
    
    for i, pixel in enumerate(pixels):
        # Calculate brightness
        brightness = sum(pixel[:3]) / 3
        
        # Find intervals to sort
        if brightness < threshold and start is None:
            start = i
        elif brightness >= threshold and start is not None:
            intervals.append((start, i))
            start = None
    
    # Handle case where interval extends to end
    if start is not None:
        intervals.append((start, len(pixels)))
    
    # Sort each interval
    result = list(pixels)
    for start, end in intervals:
        segment = result[start:end]
        # Sort by brightness
        segment.sort(key=lambda p: sum(p[:3]) / 3, reverse=reverse)
        result[start:end] = segment
    
    return result

def glitch_effect(image_path, output_path, mode='horizontal', intensity=0.7):
    """
    Apply glitch effect to an image
    
    Args:
        image_path: Path to input image
        output_path: Path to save output
        mode: 'horizontal', 'vertical', or 'both'
        intensity: 0.0 to 1.0, controls glitch threshold
    """
    # Open image
    img = Image.open(image_path)
    img = img.convert('RGB')
    pixels = np.array(img)
    
    threshold = int(255 * intensity)
    
    # Horizontal sorting (scan line effect)
    if mode in ['horizontal', 'both']:
        for i in range(len(pixels)):
            # Randomly skip some rows for variation
            if random.random() > 0.3:
                pixels[i] = pixel_sort_row(pixels[i], threshold=threshold)
    
    # Vertical sorting
    if mode in ['vertical', 'both']:
        pixels = pixels.transpose(1, 0, 2)
        for i in range(len(pixels)):
            if random.random() > 0.3:
                pixels[i] = pixel_sort_row(pixels[i], threshold=threshold)
        pixels = pixels.transpose(1, 0, 2)
    
    # Save result
    result_img = Image.fromarray(pixels.astype('uint8'))
    result_img.save(output_path)
    print(f"Glitch art saved to {output_path}")

def rgb_shift(image_path, output_path, shift_amount=20):
    """Create RGB channel shift effect"""
    img = Image.open(image_path)
    img = img.convert('RGB')
    
    r, g, b = img.split()
    
    # Shift each channel
    r = r.transform(r.size, Image.AFFINE, (1, 0, shift_amount, 0, 1, 0))
    b = b.transform(b.size, Image.AFFINE, (1, 0, -shift_amount, 0, 1, 0))
    
    # Merge channels
    result = Image.merge('RGB', (r, g, b))
    result.save(output_path)
    print(f"RGB shift saved to {output_path}")

def displacement_glitch(image_path, output_path, segments=50, max_displacement=100):
    """Create displacement/datamosh effect"""
    img = Image.open(image_path)
    img = img.convert('RGB')
    pixels = np.array(img)
    height, width = pixels.shape[:2]

    # Randomly displace horizontal segments
    for _ in range(segments):
        y = random.randint(0, height - 1)
        segment_height = random.randint(1, 10)
        displacement = random.randint(-max_displacement, max_displacement)

        if y + segment_height < height:
            segment = pixels[y:y+segment_height].copy()
            # Shift segment
            if displacement > 0:
                pixels[y:y+segment_height, displacement:] = segment[:, :-displacement]
            elif displacement < 0:
                pixels[y:y+segment_height, :displacement] = segment[:, -displacement:]

    result_img = Image.fromarray(pixels.astype('uint8'))
    result_img.save(output_path)
    print(f"Displacement glitch saved to {output_path}")

def remove_background(image_path, output_path):
    """Remove background from image"""
    with open(image_path, 'rb') as input_file:
        input_data = input_file.read()
        output_data = remove(input_data)

    with open(output_path, 'wb') as output_file:
        output_file.write(output_data)

    print(f"Background removed, saved to {output_path}")

def remove_white_pixels(image_path, output_path, threshold=250):
    """Remove pure white pixels by making them transparent"""
    img = Image.open(image_path)
    img = img.convert('RGBA')
    pixels = np.array(img)

    # Create mask for white pixels (all RGB values above threshold)
    white_mask = (pixels[:, :, 0] >= threshold) & \
                 (pixels[:, :, 1] >= threshold) & \
                 (pixels[:, :, 2] >= threshold)

    # Set alpha channel to 0 for white pixels
    pixels[white_mask, 3] = 0

    result_img = Image.fromarray(pixels.astype('uint8'))
    result_img.save(output_path)
    print(f"White pixels removed, saved to {output_path}")

# Example usage
if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python art.py <input_image>")
        sys.exit(1)

    input_image = sys.argv[1]

    # Different glitch effects
    glitch_effect(input_image, "output_horizontal.jpg", mode='horizontal', intensity=0.7)
    glitch_effect(input_image, "output_both.jpg", mode='both', intensity=0.5)
    rgb_shift(input_image, "output_rgb_shift.jpg", shift_amount=30)
    displacement_glitch(input_image, "output_displacement.jpg", segments=100, max_displacement=150)

    print("\nAll glitch effects applied!")
    print("Tip: Try adjusting intensity, shift_amount, and displacement parameters for different effects")