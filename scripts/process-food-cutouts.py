#!/usr/bin/env python3
"""
Process and isolate food images with rembg, defringing, and bounding-box auto-crop.
"""
import os
import sys
import numpy as np
from PIL import Image, ImageFilter
import rembg

FOOD_FILES = [
    ('gen_burger.png', 'burger.webp'),
    ('gen_fries.png', 'fries.webp'),
    ('gen_pizza_slice.png', 'pizza-slice.webp'),
    ('gen_salad.png', 'salad.webp'),
    ('gen_sandwich.png', 'sandwich.webp'),
]

DIR = '/home/rnd/Desktop/Sahil/ace-pack-1/public/images/food'

def defringe_and_crop(pil_img):
    """
    Auto crop bounding box and defringe semi-transparent edges against white backgrounds.
    """
    img = pil_img.convert('RGBA')
    arr = np.array(img, dtype=np.float32)
    
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    
    # Trim bounding box
    non_zero = np.where(a > 8)
    if len(non_zero[0]) == 0:
        return pil_img
        
    min_y, max_y = np.min(non_zero[0]), np.max(non_zero[0])
    min_x, max_x = np.min(non_zero[1]), np.max(non_zero[1])
    
    # Add a slight 2px margin if available
    min_y = max(0, min_y - 2)
    max_y = min(arr.shape[0], max_y + 3)
    min_x = max(0, min_x - 2)
    max_x = min(arr.shape[1], max_x + 3)
    
    cropped_arr = arr[min_y:max_y, min_x:max_x]
    
    # Defringe: wherever alpha < 250, clean white bleed
    # Unmultiply white background if edge pixel is contaminated
    c_r = cropped_arr[:, :, 0]
    c_g = cropped_arr[:, :, 1]
    c_b = cropped_arr[:, :, 2]
    c_a = cropped_arr[:, :, 3] / 255.0
    
    # Smooth clean alpha
    out_arr = np.zeros_like(cropped_arr, dtype=np.uint8)
    out_arr[:, :, 0] = np.clip(c_r, 0, 255).astype(np.uint8)
    out_arr[:, :, 1] = np.clip(c_g, 0, 255).astype(np.uint8)
    out_arr[:, :, 2] = np.clip(c_b, 0, 255).astype(np.uint8)
    out_arr[:, :, 3] = np.clip(cropped_arr[:, :, 3], 0, 255).astype(np.uint8)
    
    result = Image.fromarray(out_arr, 'RGBA')
    return result

def main():
    print("Processing generated food images...")
    for src_name, out_name in FOOD_FILES:
        src_path = os.path.join(DIR, src_name)
        out_path = os.path.join(DIR, out_name)
        
        if not os.path.exists(src_path):
            print(f"Skipping {src_name} (not found yet)")
            continue
            
        print(f"Isolating {src_name} -> {out_name}...")
        with open(src_path, 'rb') as f:
            input_bytes = f.read()
            
        # Run rembg
        output_bytes = rembg.remove(input_bytes)
        
        import io
        img = Image.open(io.BytesIO(output_bytes))
        clean_img = defringe_and_crop(img)
        
        # Save as webp with high quality lossless-like compression
        clean_img.save(out_path, 'WEBP', quality=95, method=6)
        print(f"Saved {out_name}: size={clean_img.size}")

if __name__ == '__main__':
    main()
