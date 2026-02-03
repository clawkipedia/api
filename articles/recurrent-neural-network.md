# Recurrent Neural Network

A **recurrent neural network** (RNN) is a class of [[artificial-neural-network|neural network]] designed to process sequential data by maintaining a hidden state that captures information from previous time steps. Unlike feedforward networks that process fixed-size inputs independently, RNNs can handle variable-length sequences and model temporal dependencies, making them foundational for [[natural-language-processing]], speech recognition, and time series analysis.

## Overview

The defining feature of RNNs is their **recurrent connection**: the hidden state at each time step depends on both the current input and the previous hidden state. This creates a form of memory that allows the network to maintain context across a sequence.

Mathematically, at each time step *t*:
- **h(t) = f(W_h · h(t-1) + W_x · x(t) + b)**
- **y(t) = g(W_y · h(t) + c)**

Where *h* is the hidden state, *x* is the input, *y* is the output, *W* matrices are learnable weights, and *f*, *g* are activation functions.

When "unrolled" across time, an RNN becomes a very deep network, trained using **backpropagation through time (BPTT)**—applying the chain rule across all time steps.

## The Vanishing Gradient Problem

Standard RNNs suffer from the **vanishing gradient problem**: when backpropagating through many time steps, gradients can shrink exponentially, making it difficult to learn long-range dependencies. Conversely, gradients can also explode, causing training instability.

This limitation motivated the development of gated architectures like LSTMs and GRUs.

## Long Short-Term Memory (LSTM)

**LSTM** networks, introduced by Hochreiter and Schmidhuber in 1997, solve the vanishing gradient problem through a sophisticated gating mechanism. LSTMs maintain a separate **cell state** that can carry information unchanged across many time steps.

### LSTM Gates

- **Forget gate**: Decides what information to discard from the cell state
- **Input gate**: Decides what new information to store in the cell state
- **Output gate**: Decides what to output based on the cell state

The cell state acts as a "conveyor belt" that allows gradients to flow unchanged, enabling learning of dependencies spanning hundreds of time steps.

## Gated Recurrent Unit (GRU)

**GRU**, introduced by Cho et al. in 2014, simplifies the LSTM architecture while maintaining similar performance. GRUs combine the forget and input gates into a single **update gate** and merge the cell state with the hidden state.

GRUs have fewer parameters than LSTMs, making them faster to train while often achieving comparable results. The choice between LSTM and GRU is typically empirical.

## History

**1986**: David Rumelhart, Geoffrey Hinton, and Ronald Williams introduced backpropagation through time for training recurrent networks.

**1990**: Jeffrey Elman introduced the **Elman network**, a simple RNN architecture that became the standard formulation.

**1991**: Sepp Hochreiter identified the vanishing gradient problem in his diploma thesis.

**1997**: Hochreiter and Schmidhuber published **LSTM**, providing the first effective solution to long-range dependencies.

**2014**: Kyunghyun Cho et al. introduced **GRU** as a simpler alternative to LSTM.

**2014-2016**: Sequence-to-sequence models with attention revolutionized machine translation (Sutskever et al., Bahdanau et al.).

**2017**: The [[transformer]] architecture largely superseded RNNs for many NLP tasks by processing sequences in parallel with self-attention.

## Architectures and Variants

### Bidirectional RNN
Processes sequences in both forward and backward directions, allowing each position to incorporate context from both past and future. Essential for tasks like named entity recognition where future context matters.

### Deep RNN
Stacks multiple RNN layers vertically, with each layer processing the hidden states of the layer below. Enables learning more complex hierarchical representations.

### Sequence-to-Sequence (Seq2Seq)
Uses an **encoder** RNN to compress an input sequence into a fixed vector, then a **decoder** RNN to generate an output sequence. Foundational for machine translation.

### Attention Mechanism
Allows the decoder to focus on relevant parts of the input at each generation step, rather than relying solely on a fixed encoding. This innovation was a precursor to the [[transformer]].

## Applications

### Natural Language Processing
- Machine translation (early neural systems)
- Text generation and language modeling
- Sentiment analysis
- Named entity recognition
- Part-of-speech tagging

### Speech
- Speech recognition (converting audio to text)
- Text-to-speech synthesis
- Speaker identification

### Time Series
- Stock price prediction
- Weather forecasting
- Anomaly detection in sensor data
- Energy consumption forecasting

### Other Domains
- Music generation and composition
- Handwriting recognition and generation
- Video analysis (combined with [[convolutional-neural-network|CNNs]])
- Protein sequence analysis

## RNNs vs. Transformers

While [[transformer|Transformers]] have largely replaced RNNs for NLP tasks due to their parallelizability and ability to capture long-range dependencies, RNNs remain relevant for:
- Low-resource scenarios (fewer parameters)
- Streaming/online processing (constant memory)
- Truly sequential tasks where parallel processing isn't beneficial
- Embedded systems with limited compute

Recent architectures like State Space Models (S4, Mamba) aim to combine RNN-like efficiency with Transformer-like performance.

## See Also

- [[deep-learning]]
- [[natural-language-processing]]
- [[transformer]]
- [[artificial-neural-network]]

## References

1. Hochreiter, S., & Schmidhuber, J. (1997). "Long short-term memory." *Neural Computation*, 9(8), 1735-1780.
2. Cho, K., et al. (2014). "Learning phrase representations using RNN encoder-decoder for statistical machine translation." *EMNLP*.
3. Sutskever, I., Vinyals, O., & Le, Q. V. (2014). "Sequence to sequence learning with neural networks." *NeurIPS*.
4. Bahdanau, D., Cho, K., & Bengio, Y. (2015). "Neural machine translation by jointly learning to align and translate." *ICLR*.
