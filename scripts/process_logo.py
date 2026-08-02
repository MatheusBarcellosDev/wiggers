"""Rebuild Wiggers logos: true transparent PNG for light/dark surfaces."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(r"C:\Users\mathe\Projects\wiggers")
RAW_AVIF = ROOT / "brand" / "wiggers-logo.avif"
TMP_RGB = ROOT / "brand" / "_logo_raw.png"


def load_raw() -> Image.Image:
    # Prefer fresh ffmpeg decode from AVIF when available
    if RAW_AVIF.exists():
        import subprocess

        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i",
                str(RAW_AVIF),
                "-frames:v",
                "1",
                str(TMP_RGB),
            ],
            check=True,
            capture_output=True,
        )
        return Image.open(TMP_RGB).convert("RGBA")
    return Image.open(ROOT / "brand" / "wiggers-logo.png").convert("RGBA")


def knock_out_black(im: Image.Image) -> Image.Image:
    """Hard + soft key of dark background. Keep mint and light inks."""
    out = im.copy()
    px = out.load()
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = (r + g + b) / 3.0
            # mint / teal accents — always keep
            mint = g >= 110 and g > r + 12 and g >= b - 20 and (g - r) > 8
            if mint:
                continue
            if lum <= 35:
                px[x, y] = (0, 0, 0, 0)
            elif lum < 70:
                # feather
                t = (lum - 35) / 35.0
                px[x, y] = (r, g, b, int(a * t))
    return out


def is_mint(r: int, g: int, b: int) -> bool:
    return g >= 110 and g > r + 12 and g >= b - 20 and (g - r) > 8


def make_dark(im: Image.Image) -> Image.Image:
    """For cream/light UI: ink wordmark + mint mark."""
    ink = (20, 32, 28)
    out = im.copy()
    px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            if a < 10:
                px[x, y] = (0, 0, 0, 0)
                continue
            if is_mint(r, g, b):
                # slightly richer mint on light bg
                px[x, y] = (90, 180, 155, a)
            else:
                px[x, y] = (*ink, a)
    return out


def make_light(im: Image.Image) -> Image.Image:
    """For dark UI: white wordmark + mint mark."""
    out = im.copy()
    px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            if a < 10:
                px[x, y] = (0, 0, 0, 0)
                continue
            if is_mint(r, g, b):
                px[x, y] = (126, 200, 177, a)
            else:
                # force clean white
                px[x, y] = (255, 255, 255, a)
    return out


def trim(im: Image.Image, pad: int = 8) -> Image.Image:
    bbox = im.split()[-1].getbbox() or im.getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)
    return im.crop((l, t, r, b))


def assert_clean(im: Image.Image, label: str) -> None:
    px = im.load()
    # Only flag pure keyed failure: fully opaque absolute black leftovers
    # (ink wordmark uses ~#14201c and must remain).
    bad = 0
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a > 240 and r <= 5 and g <= 5 and b <= 5:
                bad += 1
    print(f"{label}: size={im.size} pure_black_opaque={bad}")
    if bad > 200:
        raise SystemExit(f"{label} still has opaque pure black background")


def main() -> None:
    raw = load_raw()
    keyed = trim(knock_out_black(raw))
    dark = make_dark(keyed)
    light = make_light(keyed)

    assert_clean(dark, "dark")
    assert_clean(light, "light")

    brand = ROOT / "brand"
    public = ROOT / "public" / "brand"
    brand.mkdir(exist_ok=True)
    public.mkdir(parents=True, exist_ok=True)

    mapping = {
        "wiggers-logo.png": dark,
        "wiggers-logo-dark.png": dark,
        "wiggers-logo-light.png": light,
        "wiggers-logo@2x.png": dark.resize(
            (dark.width * 2, dark.height * 2), Image.Resampling.LANCZOS
        ),
    }
    for name, img in mapping.items():
        for folder in (brand, public):
            path = folder / name
            img.save(path, format="PNG", optimize=True)
            print("wrote", path)

    # never serve avif on the site
    for folder in (public,):
        avif = folder / "wiggers-logo.avif"
        if avif.exists():
            avif.unlink()
            print("removed", avif)

    if TMP_RGB.exists():
        TMP_RGB.unlink()


if __name__ == "__main__":
    main()
