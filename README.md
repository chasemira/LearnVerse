# Mini-Photoshop

A simple image editing application built with Python and Tkinter that provides basic photo manipulation features.

## Features

### Core Operations
- **Grayscale Conversion**: Convert images to black and white
- **Ordered Dithering**: Apply 4x4 Bayer matrix dithering effect
- **Auto Level**: Automatically adjust brightness and contrast using histogram equalization

### Optional Operations
- **Invert Colors**: Create negative effect
- **Blur Effect**: Apply Gaussian blur filter
- **Brightness Adjustment**: Increase or decrease image brightness (0.0 - 10.0)
- **Contrast Adjustment**: Modify image contrast (0.0 - 10.0)
- **Sharpness Adjustment**: Enhance or reduce image sharpness (0.0 - 10.0)
- **Sepia Tone**: Apply vintage brown tint effect

## Requirements

```
tkinter (built-in with Python)
Pillow (PIL)
numpy
```

## Installation

1. Clone or download the repository
2. Install required packages:
```bash
pip install Pillow numpy
```

## Usage

1. Run the application:
```bash
python mini_photoshop.py
```

2. Open a BMP file using **File → Open File**
3. Select desired operations from the **Core Operations** or **Optional Operations** menus
4. View original and modified images side by side

## Demo


## Supported Formats

- **Input**: BMP files (24-bit RGB uncompressed)
- **Display**: Side-by-side comparison of original and modified images

## Technical Details

- **GUI Framework**: Tkinter
- **Image Processing**: Pillow (PIL)
- **Array Operations**: NumPy
- **Dithering**: 4x4 Bayer matrix implementation
- **Auto-Level**: Cumulative Distribution Function (CDF) normalization

## Author

Jasleen Kaur  
October 2024  
CMPT 365 - Project 2

## License

This project is for educational purposes.
