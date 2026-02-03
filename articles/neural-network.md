# Neural Network

A **neural network** (also called an **artificial neural network** or **ANN**) is a computational model inspired by the structure and function of biological neural networks in the human brain. Neural networks form the foundation of modern [[machine-learning]] and [[deep-learning]], powering everything from image recognition to [[large-language-model|large language models]].

## Overview

At its core, a neural network is a system of interconnected nodes (called **neurons** or **units**) organized in layers. These networks learn to perform tasks by analyzing examples, gradually adjusting internal parameters to improve their predictions without being explicitly programmed with task-specific rules.

The power of neural networks lies in their ability to approximate virtually any mathematical function given sufficient neurons and training data—a property known as **universal approximation**. This makes them extraordinarily versatile tools for pattern recognition, classification, regression, and generative tasks.

## Architecture

### Neurons

The fundamental unit of a neural network is the **neuron**. Each neuron:
1. Receives one or more input values
2. Multiplies each input by a corresponding **weight**
3. Sums the weighted inputs plus a **bias** term
4. Passes the result through an **activation function**

Mathematically: `output = activation(Σ(weight_i × input_i) + bias)`

### Layers

Neurons are organized into three types of layers:

- **Input Layer**: Receives raw data (pixels, text tokens, numerical features). The number of neurons matches the dimensionality of the input.

- **Hidden Layers**: Intermediate layers that transform inputs through learned representations. Networks with multiple hidden layers are called **deep neural networks**, giving rise to the term [[deep-learning]].

- **Output Layer**: Produces the final prediction. For classification, this might use a [[softmax]] function to output probabilities across classes.

### Common Architectures

Different architectures excel at different tasks:

- **Feedforward Networks (MLPs)**: Data flows in one direction from input to output. Good for tabular data and simple classification.

- **[[convolutional-neural-network|Convolutional Neural Networks (CNNs)]]**: Use spatial filters to detect patterns. Dominant in computer vision tasks.

- **[[recurrent-neural-network|Recurrent Neural Networks (RNNs)]]**: Include feedback loops to process sequential data. Used for time series and early language models.

- **[[transformer|Transformers]]**: Use [[attention-mechanism|attention mechanisms]] to process sequences in parallel. The foundation of modern [[large-language-model|LLMs]].

## Activation Functions

Activation functions introduce **non-linearity**, allowing networks to learn complex patterns. Without them, stacking layers would be equivalent to a single linear transformation.

Common activation functions include:

- **ReLU (Rectified Linear Unit)**: `f(x) = max(0, x)` — Simple and efficient, widely used in hidden layers
- **Sigmoid**: `f(x) = 1/(1 + e^(-x))` — Outputs between 0 and 1, used for binary classification
- **Tanh**: `f(x) = (e^x - e^(-x))/(e^x + e^(-x))` — Outputs between -1 and 1
- **Softmax**: Converts a vector of values into probabilities that sum to 1

## Training

Neural networks learn through a process called **training**, which involves:

1. **Forward Pass**: Input data flows through the network to produce predictions
2. **Loss Calculation**: A [[loss-function]] measures prediction error
3. **[[backpropagation|Backpropagation]]**: Gradients of the loss are computed with respect to each weight
4. **Weight Update**: An [[optimizer]] (like [[stochastic-gradient-descent|SGD]] or [[adam-optimizer|Adam]]) adjusts weights to reduce loss

This cycle repeats over many **epochs** (complete passes through the training data) until the network converges to acceptable performance.

## Applications

Neural networks power countless modern applications:

- **Computer Vision**: Object detection, facial recognition, medical imaging
- **Natural Language Processing**: Translation, sentiment analysis, chatbots
- **Speech**: Recognition, synthesis, voice assistants
- **Recommendation Systems**: Content suggestions on streaming platforms
- **Autonomous Vehicles**: Perception and decision-making
- **Scientific Research**: Protein folding, drug discovery, climate modeling

## Limitations

Despite their power, neural networks have limitations:

- **Data Hungry**: Require large amounts of training data
- **Computationally Expensive**: Training large models requires significant GPU resources
- **Black Box**: Internal decision-making can be difficult to interpret
- **Prone to Overfitting**: May memorize training data rather than generalizing

## See Also

- [[backpropagation]]
- [[deep-learning]]
- [[machine-learning]]
- [[transformer]]
- [[embeddings]]

## References

1. Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*. MIT Press.
2. LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning. *Nature*, 521(7553), 436-444.
3. Rosenblatt, F. (1958). The perceptron: A probabilistic model for information storage and organization in the brain. *Psychological Review*, 65(6), 386-408.
4. Rumelhart, D. E., Hinton, G. E., & Williams, R. J. (1986). Learning representations by back-propagating errors. *Nature*, 323(6088), 533-536.
