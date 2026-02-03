# Backpropagation

**Backpropagation** (short for "backward propagation of errors") is the fundamental algorithm used to train [[neural-network|neural networks]]. It efficiently computes gradients of a [[loss-function]] with respect to every weight in the network, enabling learning through [[gradient-descent]].

## Overview

When a neural network makes a prediction, it will likely be wrong initially. Backpropagation answers the crucial question: "How should we adjust each weight to reduce this error?" It does this by computing the **gradient**—the direction and magnitude of change needed for each parameter.

The algorithm works by propagating error signals backward through the network, from output to input, using the mathematical chain rule of calculus. This backward flow gives the algorithm its name and makes training deep networks computationally tractable.

## The Training Loop

Backpropagation is one step in the broader training cycle:

1. **Forward Pass**: Input data flows through the network layer by layer, producing a prediction
2. **Loss Calculation**: A [[loss-function]] quantifies how wrong the prediction is
3. **Backward Pass (Backpropagation)**: Gradients are computed for every weight
4. **Weight Update**: An [[optimizer]] uses gradients to adjust weights

This process repeats thousands or millions of times until the network learns to make accurate predictions.

## Mathematical Foundation

### The Chain Rule

Backpropagation relies on the **chain rule** of calculus. For a composite function `f(g(x))`, the derivative is:

```
df/dx = (df/dg) × (dg/dx)
```

In a neural network, the output depends on many nested functions (layers). The chain rule allows us to decompose the gradient calculation into manageable pieces, computing local gradients at each layer and multiplying them together.

### Computing Gradients

Consider a simple network with input `x`, weight `w`, bias `b`, and output `y = activation(w × x + b)`. If our loss is `L`, we need `∂L/∂w` and `∂L/∂b`.

Using the chain rule:
```
∂L/∂w = (∂L/∂y) × (∂y/∂w)
```

Where:
- `∂L/∂y` is the gradient flowing back from the loss
- `∂y/∂w` is the local gradient (depends on activation function)

This pattern repeats layer by layer, with each layer receiving gradients from the layer above and passing gradients to the layer below.

## Algorithm Steps

### 1. Forward Pass
Store intermediate values (activations) at each layer—these are needed for gradient computation:

```
For each layer l:
    z[l] = W[l] × a[l-1] + b[l]    # weighted sum
    a[l] = activation(z[l])         # apply activation
```

### 2. Output Layer Gradient
Compute the initial gradient at the output:

```
δ[L] = ∂Loss/∂a[L] × activation_derivative(z[L])
```

### 3. Backward Pass
Propagate gradients through each layer, from output toward input:

```
For each layer l (from L-1 to 1):
    δ[l] = (W[l+1]ᵀ × δ[l+1]) × activation_derivative(z[l])
```

### 4. Compute Weight Gradients
At each layer, compute gradients for weights and biases:

```
∂Loss/∂W[l] = δ[l] × a[l-1]ᵀ
∂Loss/∂b[l] = δ[l]
```

## Practical Considerations

### Vanishing Gradients

In deep networks, gradients can become extremely small as they propagate backward, effectively preventing early layers from learning. This **vanishing gradient problem** historically limited network depth.

Solutions include:
- **ReLU activation**: Gradients don't shrink for positive inputs
- **Residual connections**: Skip connections in [[transformer|Transformers]] and ResNets
- **Batch normalization**: Normalizes layer inputs to stable ranges
- **Careful initialization**: Xavier or He initialization

### Exploding Gradients

Conversely, gradients can grow exponentially large, causing unstable training. Mitigation strategies:
- **Gradient clipping**: Cap gradient magnitudes
- **Lower learning rates**: More conservative weight updates
- **Weight regularization**: Penalize large weights

### Automatic Differentiation

Modern [[deep-learning]] frameworks like [[pytorch|PyTorch]] and [[tensorflow|TensorFlow]] implement **automatic differentiation** (autodiff), which computes gradients automatically. You define the forward pass; the framework builds a computational graph and computes gradients via backpropagation.

```python
# PyTorch example
loss = model(input) - target
loss.backward()  # Backpropagation happens here
optimizer.step()  # Update weights using gradients
```

## Historical Context

Backpropagation's history involves multiple independent discoveries:
- **1960s**: Basic gradient descent in control theory
- **1970**: Seppo Linnainmaa describes autodiff
- **1974**: Paul Werbos applies backpropagation to neural networks (PhD thesis)
- **1986**: Rumelhart, Hinton, and Williams popularize it in their landmark *Nature* paper

The 1986 paper demonstrated backpropagation's effectiveness and sparked renewed interest in neural networks, ultimately leading to the [[deep-learning]] revolution.

## Variants and Extensions

- **Stochastic Gradient Descent (SGD)**: Compute gradients on mini-batches rather than the full dataset
- **Momentum**: Accumulate gradient history to smooth updates
- **[[adam-optimizer|Adam]]**: Adaptive learning rates per parameter
- **Backpropagation Through Time (BPTT)**: Extension for [[recurrent-neural-network|RNNs]]

## See Also

- [[neural-network]]
- [[gradient-descent]]
- [[loss-function]]
- [[deep-learning]]
- [[optimizer]]

## References

1. Rumelhart, D. E., Hinton, G. E., & Williams, R. J. (1986). Learning representations by back-propagating errors. *Nature*, 323(6088), 533-536.
2. Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*, Chapter 6. MIT Press.
3. Werbos, P. J. (1974). Beyond regression: New tools for prediction and analysis in the behavioral sciences. PhD thesis, Harvard University.
4. LeCun, Y., Bottou, L., Orr, G. B., & Müller, K. R. (1998). Efficient BackProp. In *Neural Networks: Tricks of the Trade*, Springer.
