"""Draws Raju's LAPATA poster (and the MIL GAYA copy for Room 6) the way the
game renders it, so the photo arrives on WhatsApp as a real poster.
Usage: python3 make-poster.py <photo.jpg> <out-dir>"""
import sys
from PIL import Image, ImageDraw, ImageFont

photo, out = sys.argv[1], sys.argv[2]
F = "/System/Library/Fonts/"
def font(path, size, index=0):
    return ImageFont.truetype(F + path, size, index=index)

W, H = 900, 1380
paper = (246, 241, 228)
ink = (24, 22, 20)
red = (178, 28, 28)

def poster():
    im = Image.new("RGB", (W, H), paper)
    d = ImageDraw.Draw(im)
    d.rectangle([24, 24, W - 25, H - 25], outline=ink, width=4)
    hindi = font("Kohinoor.ttc", 150, 2)
    d.text((W / 2, 140), "लापता", font=hindi, fill=red, anchor="mm")
    d.text((W / 2, 250), "LAPATA · MISSING", font=font("Helvetica.ttc", 44, 1), fill=ink, anchor="mm")
    p = Image.open(photo).convert("L").convert("RGB")
    pw = 460
    p = p.resize((pw, int(p.height * pw / p.width)))
    im.paste(p, ((W - pw) // 2, 300))
    y = 300 + p.height + 70
    d.text((W / 2, y), "Dilip Kumar Mahto", font=font("Helvetica.ttc", 64, 1), fill=ink, anchor="mm")
    body = font("Helvetica.ttc", 34)
    for i, line in enumerate([
        "Umar 19 saal · Age 19",
        "Aakhri baar dekha: Shanivaar, 21 November",
        "Last seen: Banyan Farms, Chhattarpur",
        "Ghar: Samastipur, Bihar",
    ]):
        d.text((W / 2, y + 80 + i * 48), line, font=body, fill=ink, anchor="mm")
    d.text((W / 2, H - 80), "Sampark: Raju (bhai) · +91 62••• •4417", font=font("Helvetica.ttc", 36, 1), fill=ink, anchor="mm")
    return im

base = poster()
base.save(f"{out}/B02-poster.jpg", quality=90)
base.save(f"{out}/P-poster.jpg", quality=90)

found = base.copy()
d = ImageDraw.Draw(found)
pen = (28, 52, 140)
for dy in (-6, 6):
    d.line([(150, 140 + dy), (750, 132 + dy)], fill=pen, width=9)
layer = Image.new("RGBA", (W, 300), (0, 0, 0, 0))
ImageDraw.Draw(layer).text((W / 2, 150), "MIL GAYA", font=font("MarkerFelt.ttc", 150, 1), fill=pen + (235,), anchor="mm")
layer = layer.rotate(7, resample=Image.BICUBIC)
found.paste(layer, (0, 300 + 560 - 230), layer)
found.save(f"{out}/E-poster.jpg", quality=90)
print("posters drawn")
