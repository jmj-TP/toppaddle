import colorsys
from PIL import Image

def recolor_orange_to_blue(src, dest):
    img = Image.open(src).convert("RGBA")
    pixdata = img.load()
    width, height = img.size
    
    # Target blue is HSL(221, 83%, 53%) => Hue = 221 / 360 = 0.6138
    target_h = 221 / 360.0
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixdata[x, y]
            if a > 0:
                # Convert to HLS
                h, l, s = colorsys.rgb_to_hls(r/255.0, g/255.0, b/255.0)
                
                # Only shift pixels that actually have color (ignore white, gray, black)
                # s > 0.1 usually means it's visibly colored.
                if s > 0.1:
                    # Shift hue to blue, keep its native lightness and saturation
                    nr, ng, nb = colorsys.hls_to_rgb(target_h, l, s)
                    pixdata[x, y] = (int(nr*255), int(ng*255), int(nb*255), a)

    # Resize cleanly to 256x256 to fit as a nice crisp logo
    img.thumbnail((256, 256), Image.Resampling.LANCZOS)
    img.save(dest)

if __name__ == "__main__":
    # We use the original icon.png from public as our clean source
    src_path = "public/icon.png"
    dest_path = "src/assets/logo.png"
    
    recolor_orange_to_blue(src_path, dest_path)
    print("Logo smartly recolored!")
