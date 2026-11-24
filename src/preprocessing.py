"""
Acoustic Image Preprocessing, Ocean Noise Simulation, and Physics Analysis.
Includes speckle noise reduction via Median Filtering, contrast enhancement via CLAHE,
realistic ocean turbulence simulation, and acoustic highlight/shadow extraction.
"""

from PIL import Image, ImageFilter, ImageOps, ImageEnhance
import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None

try:
    from torchvision import transforms
except ImportError:
    transforms = None

from configs.config import (
    IMAGE_SIZE,
    IMAGENET_MEAN,
    IMAGENET_STD,
    CLAHE_CLIP_LIMIT,
    CLAHE_TILE_GRID,
    MEDIAN_BLUR_KSIZE,
)


def preprocess_sonar_image(image_input):
    """
    Load and preprocess a single sonar image.
    Handles RGBA/Grayscale -> RGB conversion.
    Applies median filter (speckle noise suppression) + CLAHE (contrast enhancement).

    Args:
        image_input (str, Path, or PIL.Image.Image): Path to image file or PIL image.

    Returns:
        PIL.Image.Image: Preprocessed 3-channel RGB PIL image.
    """
    if isinstance(image_input, (str, bytes)) or hasattr(image_input, "__fspath__"):
        img = Image.open(image_input).convert("RGB")
    elif isinstance(image_input, Image.Image):
        img = image_input.convert("RGB")
    else:
        raise ValueError(f"Unsupported image input type: {type(image_input)}")

    if cv2 is not None:
        img_np = np.array(img)
        gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)

        # Step 1: Median filter — removes acoustic speckle noise
        denoised = cv2.medianBlur(gray, MEDIAN_BLUR_KSIZE)

        # Step 2: CLAHE — enhances target-to-background acoustic contrast
        clahe = cv2.createCLAHE(clipLimit=CLAHE_CLIP_LIMIT, tileGridSize=CLAHE_TILE_GRID)
        enhanced = clahe.apply(denoised)

        # Step 3: Convert back to 3-channel RGB for ResNet backbone
        enhanced_rgb = cv2.cvtColor(enhanced, cv2.COLOR_GRAY2RGB)
        return Image.fromarray(enhanced_rgb)
    else:
        # High quality PIL fallback if OpenCV is not installed
        gray = img.convert("L")
        denoised = gray.filter(ImageFilter.MedianFilter(size=MEDIAN_BLUR_KSIZE))
        enhanced = ImageOps.equalize(denoised)
        enhancer = ImageEnhance.Contrast(enhanced)
        enhanced = enhancer.enhance(1.4)
        return enhanced.convert("RGB")


def simulate_ocean_noise(image_input, speckle_intensity=0.3, turbidity=0.2):
    """
    Simulates real-world underwater acoustic perturbations:
    - Multiplicative speckle noise (Rayleigh / Gamma acoustic backscatter variability)
    - Turbidity / turbidity attenuation
    """
    if isinstance(image_input, (str, bytes)) or hasattr(image_input, "__fspath__"):
        img = Image.open(image_input).convert("RGB")
    elif isinstance(image_input, Image.Image):
        img = image_input.convert("RGB")
    else:
        raise ValueError(f"Unsupported image input type: {type(image_input)}")

    img_np = np.array(img).astype(np.float32) / 255.0

    # 1. Multiplicative acoustic speckle noise: I_noisy = I * (1 + N(0, sigma))
    if speckle_intensity > 0:
        noise = np.random.normal(0, speckle_intensity, img_np.shape)
        img_np = img_np * (1.0 + noise)

    # 2. Turbidity / attenuation (lowers contrast and adds backscatter haze)
    if turbidity > 0:
        haze = np.ones_like(img_np) * 0.15
        img_np = (1.0 - turbidity) * img_np + turbidity * haze

    img_np = np.clip(img_np, 0.0, 1.0)
    noisy_pil = Image.fromarray((img_np * 255).astype(np.uint8))
    return noisy_pil


def extract_acoustic_zones(image_input):
    """
    Physically segments forward-looking sonar imagery into:
    1. Acoustic Highlight: Strong direct beam backscatter (bright target reflection)
    2. Acoustic Shadow: Beam occlusion zone behind target (pitch dark)
    Returns a colorized diagnostic overlay and percentage areas.
    """
    if isinstance(image_input, (str, bytes)) or hasattr(image_input, "__fspath__"):
        img = Image.open(image_input).convert("RGB")
    elif isinstance(image_input, Image.Image):
        img = image_input.convert("RGB")
    else:
        raise ValueError(f"Unsupported image input type: {type(image_input)}")

    img_np = np.array(img.convert("L"))
    h, w = img_np.shape
    total_pixels = h * w

    # Intensity thresholds
    p85 = np.percentile(img_np, 85)
    p20 = np.percentile(img_np, 20)

    highlight_mask = img_np >= max(p85, 120)
    shadow_mask = img_np <= min(p20, 45)

    highlight_pct = (np.sum(highlight_mask) / total_pixels) * 100.0
    shadow_pct = (np.sum(shadow_mask) / total_pixels) * 100.0

    # Build RGB overlay: Red for highlight, Blue for shadow, Gray for background
    overlay = np.zeros((h, w, 3), dtype=np.uint8)
    overlay[:, :, 0] = img_np
    overlay[:, :, 1] = img_np
    overlay[:, :, 2] = img_np

    # Highlight in Cyan/Green
    overlay[highlight_mask] = [0, 230, 120]
    # Shadow in Deep Blue/Purple
    overlay[shadow_mask] = [180, 50, 240]

    overlay_pil = Image.fromarray(overlay)
    return overlay_pil, highlight_pct, shadow_pct


def get_train_transforms():
    if transforms is None:
        return None
    return transforms.Compose([
        transforms.Resize(IMAGE_SIZE),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


def get_val_test_transforms():
    if transforms is None:
        return None
    return transforms.Compose([
        transforms.Resize(IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])
