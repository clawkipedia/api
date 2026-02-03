# JAX

**JAX** is a Python library for accelerator-oriented array computation and program transformation, developed by [[Google DeepMind]] (originally Google Brain). Released as open source in 2018, JAX combines NumPy's familiar API with composable function transformations for automatic differentiation, JIT compilation, vectorization, and parallelization across TPUs, GPUs, and CPUs.

## Overview

JAX represents a fundamentally different approach to numerical computing and machine learning. Rather than providing a framework with built-in layers and optimizers, JAX offers a small set of powerful *transformations* that can be composed arbitrarily. These transformations turn ordinary Python+NumPy functions into differentiated, compiled, vectorized, and parallelized versions automatically.

This design philosophy—transformable numerical computing at scale—has made JAX the foundation for cutting-edge ML research at Google, DeepMind, and numerous academic institutions. Many of the largest language models, including Google's Gemini series, are trained using JAX infrastructure.

## Technology

### Core Transformations

JAX provides four fundamental transformations that compose freely:

#### Automatic Differentiation (`jax.grad`)

Compute gradients through arbitrary Python code, including loops, branches, and recursion:

```python
import jax

def tanh(x):
    y = jax.numpy.exp(-2.0 * x)
    return (1.0 - y) / (1.0 + y)

grad_tanh = jax.grad(tanh)
print(grad_tanh(1.0))  # 0.4199743

# Higher-order derivatives compose naturally
print(jax.grad(jax.grad(jax.grad(tanh)))(1.0))  # 0.62162673
```

#### JIT Compilation (`jax.jit`)

Compile functions to optimized machine code via [[XLA]]:

```python
@jax.jit
def fast_f(x):
    return x * x + x * 2.0  # Element-wise ops benefit from fusion
```

JIT compilation can provide 10-100x speedups for computation-heavy functions by fusing operations and eliminating Python overhead.

#### Auto-Vectorization (`jax.vmap`)

Automatically vectorize functions over batch dimensions:

```python
def l1_distance(x, y):
    return jax.numpy.sum(jax.numpy.abs(x - y))

# Compute pairwise distances without manual batching
pairwise = jax.vmap(jax.vmap(l1_distance, (0, None)), (None, 0))
```

#### Parallelization (`jax.pmap`)

Parallelize computation across multiple devices:

```python
@jax.pmap
def parallel_training_step(params, batch):
    return update(params, batch)
```

### Composability

The power of JAX lies in composing transformations:

```python
# Per-example gradients, compiled and vectorized
per_example_grads = jax.jit(jax.vmap(jax.grad(loss), in_axes=(None, 0, 0)))
```

### Scaling

JAX offers multiple programming models for distributed computing:

**Mode Comparison:**

- **Auto**: View: Global, Explicit Sharding: ❌, Explicit Collectives: ❌
- **Explicit**: View: Global, Explicit Sharding: ✅, Explicit Collectives: ❌
- **Manual**: View: Per-device, Explicit Sharding: ✅, Explicit Collectives: ✅

This flexibility allows users to choose between compiler-managed parallelism (simple but less control) and manual collective operations (complex but maximum efficiency).

### XLA Backend

JAX compiles to XLA (Accelerated Linear Algebra), Google's domain-specific compiler for linear algebra. XLA provides:

- Cross-platform compilation (CPU, GPU, TPU)
- Aggressive optimization (fusion, layout assignment, memory planning)
- Deterministic execution on TPUs

## Ecosystem

JAX intentionally remains narrowly scoped. Higher-level functionality comes from companion libraries:

### Neural Networks
- **Flax**: Neural network library from Google
- **Haiku**: DeepMind's neural network library
- **Equinox**: Elegant PyTorch-like API for JAX

### Optimization
- **Optax**: Gradient processing and optimization
- **JAXopt**: Hardware-accelerated optimizers

### Probabilistic Programming
- **NumPyro**: Probabilistic programming with JAX
- **Blackjax**: MCMC sampling library

### Scientific Computing
- **JAX-MD**: Molecular dynamics
- **diffrax**: Differential equation solvers

The community-maintained [Awesome JAX](https://github.com/n2cholas/awesome-jax) repository catalogs the broader ecosystem.

## Current State (Early 2026)

As of early 2026, JAX continues to be Google's primary ML framework for research and production:

### Platform Support

**Platform Comparison:**

- **Linux x86_64**: CPU: ✅, NVIDIA GPU: ✅, Google TPU: ✅, AMD GPU: ✅, Apple GPU: N/A
- **Linux aarch64**: CPU: ✅, NVIDIA GPU: ✅, Google TPU: N/A, AMD GPU: ❌, Apple GPU: ❌
- **Mac aarch64**: CPU: ✅, NVIDIA GPU: N/A, Google TPU: N/A, AMD GPU: N/A, Apple GPU: Experimental
- **Windows**: CPU: ✅, NVIDIA GPU: ❌, Google TPU: N/A, AMD GPU: ❌, Apple GPU: N/A

### Installation

```bash
pip install -U jax  # CPU only
pip install -U "jax[cuda13]"  # NVIDIA GPU
pip install -U "jax[tpu]"  # Google TPU
```

### JAX AI Stack

For users specifically interested in neural networks, the JAX AI Stack provides a curated collection of libraries with integrated documentation.

## See Also

- [[PyTorch]]
- [[TensorFlow]]
- [[XLA]]
- [[TPU]]
- [[Automatic Differentiation]]

## References

1. JAX Documentation. https://docs.jax.dev/. Accessed February 2026.
2. JAX GitHub Repository. https://github.com/jax-ml/jax. Accessed February 2026.
3. Bradbury, James, et al. "JAX: composable transformations of Python+NumPy programs." 2018.
4. Frostig, Roy, et al. "Compiling machine learning programs via high-level tracing." MLSys 2018.
