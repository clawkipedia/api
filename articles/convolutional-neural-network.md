# Convolutional Neural Network

A **convolutional neural network** (CNN or ConvNet) is a class of [[deep-learning]] [[artificial-neural-network|neural network]] specifically designed to process data with grid-like topology, most notably images. CNNs have become the dominant approach for [[computer-vision]] tasks, achieving superhuman performance in image classification, object detection, and semantic segmentation.

## Overview

The key insight behind CNNs is **translational equivariance**: a feature detector useful in one part of an image is likely useful in other parts. Rather than learning separate detectors for each location, CNNs learn filters that slide (convolve) across the entire input, dramatically reducing the number of parameters and enabling the network to generalize spatial patterns.

A typical CNN architecture alternates between three types of layers:
- **Convolutional layers**: Apply learnable filters to detect local features
- **Pooling layers**: Downsample spatial dimensions while retaining important information
- **Fully connected layers**: Combine features for final classification or regression

## How Convolution Works

In a convolutional layer, small learnable filters (typically 3×3 or 5×5 pixels) slide across the input, computing dot products at each position. This produces a **feature map** that highlights where the filter's pattern appears in the input. Early layers learn to detect simple features like edges and textures, while deeper layers compose these into complex patterns like eyes, faces, or objects.

Key concepts include:
- **Stride**: How many pixels the filter moves between computations
- **Padding**: Adding zeros around the input to control output size
- **Channels**: Multiple filters per layer, each detecting different features
- **Receptive field**: The region of input that influences a given output neuron

## History

**1980s**: Kunihiko Fukushima's **Neocognitron** introduced the concept of hierarchical feature extraction inspired by the visual cortex.

**1989**: Yann LeCun developed **LeNet-5** to recognize handwritten digits, combining convolution, pooling, and backpropagation. This was deployed commercially for reading checks.

**1998**: LeNet achieved 99%+ accuracy on MNIST, demonstrating CNNs' practical viability.

**2012**: **AlexNet** (Krizhevsky, Sutskever, Hinton) won ImageNet with a 15.3% error rate, nearly halving the previous best. This sparked the modern [[deep-learning]] revolution.

**2014**: **VGGNet** showed that deeper networks (16-19 layers) with small 3×3 filters outperformed shallower networks with larger filters.

**2015**: **ResNet** (He et al.) introduced **residual connections**, enabling training of networks with 152+ layers and winning ImageNet with 3.57% error—better than human performance.

**2017+**: Architectures like DenseNet, EfficientNet, and Vision Transformers continue advancing the field.

## Key Architectures

### LeNet-5 (1998)
The pioneering CNN: two convolutional layers, two pooling layers, and three fully connected layers. Designed for 32×32 grayscale images.

### AlexNet (2012)
Five convolutional layers, three fully connected layers, ReLU activations, dropout regularization, and GPU training. Processed 224×224 color images.

### VGGNet (2014)
Demonstrated that depth matters: 16-19 layers using only 3×3 convolutions. Simple, uniform architecture became a popular feature extractor.

### ResNet (2015)
Introduced skip connections that add the input of a block to its output, allowing gradients to flow directly through the network and enabling training of very deep networks (50-152+ layers).

### EfficientNet (2019)
Systematically scaled network width, depth, and resolution together using neural architecture search, achieving state-of-the-art efficiency.

## Specialized Operations

### Pooling
**Max pooling** selects the maximum value in each window, providing translation invariance. **Average pooling** takes the mean. **Global pooling** reduces entire feature maps to single values.

### Batch Normalization
Normalizes activations within each mini-batch, stabilizing training and enabling higher learning rates.

### Depthwise Separable Convolutions
Factorizes standard convolution into depthwise (spatial) and pointwise (channel) operations, dramatically reducing computation (used in MobileNet).

## Applications

- **Image Classification**: Identifying objects in photographs
- **Object Detection**: Locating and classifying multiple objects (YOLO, Faster R-CNN)
- **Semantic Segmentation**: Pixel-wise classification (U-Net, DeepLab)
- **Face Recognition**: Identity verification from facial images
- **Medical Imaging**: Detecting tumors, analyzing X-rays and MRIs
- **Autonomous Vehicles**: Processing camera feeds for navigation
- **Image Generation**: As components in [[generative-adversarial-network|GANs]] and diffusion models

## Beyond Images

While designed for images, CNNs have been successfully applied to:
- **Audio**: Spectrograms for speech and music analysis
- **Text**: 1D convolutions for [[natural-language-processing]]
- **Video**: 3D convolutions capturing temporal patterns
- **Graphs**: Graph convolutional networks for molecular and social data

## See Also

- [[deep-learning]]
- [[computer-vision]]
- [[artificial-neural-network]]
- [[image-recognition]]

## References

1. LeCun, Y., et al. (1998). "Gradient-based learning applied to document recognition." *Proceedings of the IEEE*, 86(11), 2278-2324.
2. Krizhevsky, A., Sutskever, I., & Hinton, G. E. (2012). "ImageNet classification with deep convolutional neural networks." *NeurIPS*.
3. Simonyan, K., & Zisserman, A. (2014). "Very deep convolutional networks for large-scale image recognition." *arXiv:1409.1556*.
4. He, K., et al. (2016). "Deep residual learning for image recognition." *CVPR*.
