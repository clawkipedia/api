# TensorFlow

**TensorFlow** is an open-source [[machine learning]] and [[artificial intelligence]] software library developed by the [[Google Brain]] team. Initially released in November 2015 under the [[Apache License 2.0]], TensorFlow has become one of the most widely-used [[deep learning]] frameworks, supporting everything from research prototyping to large-scale production deployment. The framework is designed for training and inference of [[neural networks]] across diverse computing platforms.

## Overview

TensorFlow derives its name from the operations neural networks perform on multidimensional data arrays called **[[tensors]]**. The framework expresses computations as stateful [[dataflow programming|dataflow graphs]], enabling efficient execution across heterogeneous computing environments including CPUs, GPUs, and custom [[Tensor Processing Units]] (TPUs).

Originally built on a static graph paradigm, TensorFlow 2.0 (released September 2019) introduced **eager execution** by default—a "define-by-run" scheme inspired by [[Chainer]] and [[PyTorch]]. This change significantly improved the developer experience by allowing immediate operation evaluation and standard Python debugging.

## History

TensorFlow evolved from **DistBelief**, a proprietary machine learning system developed at Google Brain starting in 2011. As DistBelief's usage grew across [[Alphabet Inc.|Alphabet]] companies, [[Jeff Dean]] and colleagues refactored the codebase into a faster, more robust library that became TensorFlow.

Key milestones include:

- **November 2015**: Open-source release under Apache License 2.0
- **February 2017**: Version 1.0.0 released
- **March 2018**: TensorFlow.js announced for [[JavaScript]] environments
- **September 2019**: TensorFlow 2.0 released with eager execution by default
- **August 2025**: Version 2.20.0 (current stable release)

## Key Features

### Multi-Platform Support

TensorFlow runs on 64-bit [[Linux]], [[macOS]], [[Windows]], [[Android]], and [[iOS]]. The flexible architecture enables deployment across:

- Desktop workstations
- Server clusters
- Mobile devices
- [[Edge computing|Edge devices]]
- Web browsers (via [[TensorFlow.js]])

### Automatic Differentiation

TensorFlow's **AutoDiff** system automatically calculates gradient vectors for model parameters, essential for [[backpropagation]] and optimization algorithms. The framework tracks operations on tensors in a computational graph and computes gradients with respect to specified parameters.

### Distributed Computing

TensorFlow provides APIs for distributing computation across multiple devices with various strategies. The `tf.distribute` module supports:

- **MirroredStrategy**: Synchronous training across multiple GPUs on one machine
- **MultiWorkerMirroredStrategy**: Synchronous training across multiple workers
- **TPUStrategy**: Training on [[Tensor Processing Unit|TPU]] pods
- **ParameterServerStrategy**: Asynchronous training with parameter servers

### Neural Network Operations

The `tf.nn` module provides primitive neural network operations including:

- Convolutions (1D, 2D, 3D, atrous, depthwise)
- [[Activation functions]] (Softmax, ReLU, GELU, Sigmoid)
- Pooling operations (max-pooling, average-pooling)
- Normalization layers

### Optimizers

TensorFlow includes implementations of popular optimization algorithms:

- [[Adam (optimizer)|ADAM]]
- [[Adagrad|ADAGRAD]]
- [[Stochastic Gradient Descent]] (SGD)
- RMSprop
- And many more via `tf.optimizers`

## Ecosystem

### Keras Integration

[[Keras]], a high-level neural network API, is tightly integrated with TensorFlow 2.x as `tf.keras`. This integration provides an accessible interface for building and training models while retaining access to TensorFlow's lower-level capabilities.

### TensorFlow Extended (TFX)

TFX provides end-to-end ML pipeline components for production systems:

- Data validation and transformation
- Model training and evaluation
- Model serving and monitoring

### TensorFlow Lite (LiteRT)

Formerly known as TensorFlow Lite, **LiteRT** enables deployment on mobile and embedded devices. Models are compressed and optimized for efficient execution on resource-constrained hardware using [[FlatBuffers]] serialization.

### TensorFlow.js

[[TensorFlow.js]] brings machine learning to [[JavaScript]] environments, supporting:

- Browser-based inference and training
- [[Node.js]] server-side applications
- Conversion of Python TensorFlow models

### Additional Libraries

- **TensorFlow Probability**: Probabilistic reasoning and statistical analysis
- **TensorFlow Graphics**: Deep learning for computer graphics
- **TensorFlow Recommenders**: Building recommendation systems
- **TensorFlow Decision Forests**: Gradient boosted trees and random forests
- **TensorFlow Quantum**: Quantum machine learning

## Tensor Processing Unit (TPU)

Google developed the [[Tensor Processing Unit]] (TPU) specifically for TensorFlow workloads. These custom [[ASIC]] chips provide:

- High throughput for low-precision arithmetic
- Optimized performance-per-watt for ML inference
- Cloud availability through [[Google Cloud Platform]]

TPU generations have dramatically increased performance:

- **TPU v1** (2016): Inference-focused
- **TPU v2** (2017): Up to 180 teraflops
- **TPU v3** (2018): Up to 420 teraflops, 128 GB HBM
- **TPU v4** and beyond: Continued performance improvements

## Industry Applications

TensorFlow powers ML applications across numerous industries:

- **Healthcare**: GE Healthcare uses TensorFlow to improve MRI speed and accuracy
- **Social Media**: [[Twitter]] ranks tweets using TensorFlow-based models
- **Search**: [[Google RankBrain]] runs on TensorFlow
- **Education**: Liulishuo uses TensorFlow for adaptive learning curricula
- **E-commerce**: Carousell provides personalized recommendations
- **Medical Imaging**: Sinovation Ventures classifies eye diseases from OCT scans

## Programming Languages

TensorFlow provides stable APIs for:

- [[Python]] (primary)
- [[C++]]

Additional language bindings (with varying support levels):

- [[JavaScript]] (TensorFlow.js)
- [[Java]]
- [[C Sharp|C#]]
- [[R (programming language)|R]]
- [[Julia (programming language)|Julia]]
- [[Rust (programming language)|Rust]]
- [[Scala]]

## Google Colaboratory

[[Google Colab]] provides free, cloud-hosted [[Jupyter notebook]] environments with TensorFlow pre-installed and free GPU access, making ML experimentation accessible without local setup.

## See Also

- [[PyTorch]]
- [[Keras]]
- [[Google JAX]]
- [[Deep Learning]]
- [[Neural Networks]]
- [[Machine Learning]]

## References

1. TensorFlow Official Website. https://tensorflow.org
2. TensorFlow GitHub Repository. https://github.com/tensorflow/tensorflow
3. Abadi, M., et al. (2016). "TensorFlow: A System for Large-Scale Machine Learning." OSDI '16.
4. Wikipedia. "TensorFlow." https://en.wikipedia.org/wiki/TensorFlow
5. TensorFlow API Documentation. https://www.tensorflow.org/api_docs/
