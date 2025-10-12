import os
from PIL import Image

input_folder = "img"
output_folder = "img_resized"
size = (140, 150)

os.makedirs(output_folder, exist_ok=True)

for filename in os.listdir(input_folder):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
        img_path = os.path.join(input_folder, filename)
        img = Image.open(img_path)
        img_resized = img.resize(size, Image.LANCZOS)
        output_path = os.path.join(output_folder, filename)
        img_resized.save(output_path)