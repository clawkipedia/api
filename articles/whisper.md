# Whisper

**Whisper** is a [[machine learning]] model for [[speech recognition]] and [[transcription (linguistics)|transcription]] created by [[OpenAI]]. First released as [[open-source software]] on September 21, 2022, under the [[MIT License]], Whisper represents a significant advance in automatic speech recognition (ASR) through its training on diverse, large-scale data that enables robust performance across languages, accents, and acoustic environments.

## History and Development

Whisper emerged from OpenAI's need to transcribe audio at scale. According to a *New York Times* report, by 2021 OpenAI believed they had exhausted sources of high-quality text data to train their [[large language models]] and decided to complement web-scraped text with transcriptions of YouTube videos and podcasts. Whisper was developed specifically to solve this transcription task.

The initial release in September 2022 offered multiple model sizes ranging from "tiny" to "large." Subsequent releases expanded the model family:

- **Whisper Large V2** (December 8, 2022): Improved performance with additional training techniques
- **Whisper Large V3** (November 2023): Announced at OpenAI Dev Day with further refinements

In March 2025, OpenAI released new transcription models based on [[GPT-4o]] and GPT-4o mini, both achieving lower error rates than Whisper, though Whisper remains available as an open-source option.

## Technical Architecture

Whisper uses an [[encoder-decoder]] [[transformer (deep learning architecture)|transformer]] architecture, trained through [[weak supervision|weakly-supervised]] learning.

### Audio Processing

Input audio is:
1. Resampled to 16,000 Hz
2. Converted to an 80-channel log-magnitude [[Mel-frequency cepstrum|Mel spectrogram]] using 25ms windows with 10ms stride
3. Normalized to a [-1, 1] range with near-zero mean
4. Segmented into 30-second chunks for processing

### Encoder

The encoder processes the Mel spectrogram through:
- Two [[convolutional layer|convolutional layers]]
- Sinusoidal positional embeddings
- Multiple transformer encoder blocks with pre-activation [[residual neural network|residual connections]]
- Layer normalization

### Decoder

The decoder is a standard transformer decoder matching the encoder's width and block count. It uses:
- Learned positional embeddings
- Tied input-output token representations
- [[Byte pair encoding]] tokenization (GPT-2 vocabulary for English-only models; multilingual vocabulary for others)

### Special Tokens

Whisper uses special tokens to enable multiple tasks:
- **Language tokens**: One per supported language
- **Task tokens**: `<|transcribe|>` or `<|translate|>`
- **Timestamp tokens**: Quantized to 20ms intervals
- **Voice activity detection**: `<|nospeech|>` token
- **Context markers**: `<|startoftranscript|>`, `<|endoftranscript|>`, and `<|notimestamps|>`

## Training Data

Whisper was trained on 680,000 hours of labeled audio-transcript pairs sourced from the internet:
- 117,000 hours in 96 non-English languages
- 125,000 hours of X→English translation data (where X is any non-English language)

### Data Preprocessing

The training pipeline involved:
- Transcript standardization (punctuation, capitalization)
- Filtering to remove machine-generated transcripts
- [[Language identification]] and matching with transcripts
- [[Approximate string matching|Fuzzy]] [[data deduplication|deduplication]]
- Deduplication against evaluation datasets to prevent contamination
- Inclusion of speechless segments for voice activity detection training

### Post-Training Filtering

After initial model training, OpenAI ran inference on training subsets to identify problematic data sources. Sources were ranked by error rate and size, with high-error, large sources manually inspected and removed if found to contain partial transcriptions or misaligned audio.

### Training Details

- **Optimizer**: AdamW with gradient norm clipping
- **Learning rate**: Linear decay with warmup
- **Batch size**: 256 segments
- **Duration**: 1 million updates (2-3 epochs)
- **Augmentation**: None for most models; Large V2 used SpecAugment, Stochastic Depth, and BPE Dropout
- **Precision**: [[Half-precision floating-point format|float16]] with dynamic loss scaling and activation checkpointing

## Capabilities

### Multilingual Support

Whisper supports transcription in English and 96 other languages, plus translation from non-English languages into English. Performance varies by language, with higher [[word error rate|word error rates]] for languages underrepresented in training data.

### Robustness

OpenAI claims Whisper's diverse training data leads to improved recognition of:
- Regional accents
- Background noise
- Technical jargon and domain-specific vocabulary

When tested across multiple datasets, Whisper makes approximately 50% fewer errors than comparable models, though it does not outperform specialized models on benchmarks like LibriSpeech.

## Limitations

### Hallucinations

Third-party evaluations have identified significant [[AI hallucination|hallucination]] issues:
- A study of public meeting transcripts found hallucinations in 8 out of 10 transcripts
- One engineer discovered hallucinations in approximately half of 100 hours of transcriptions
- A study of 13,140 short audio segments (averaging 10 seconds) found 187 hallucinations (1.4%), with 38% generating potentially harmful content including false references to race, non-existent medications, or violent events

### Language Disparities

Word error rates vary significantly across languages, with less-represented languages experiencing degraded performance.

### Inference Speed

Real-time transcription can be challenging on consumer hardware for larger model variants.

## Applications

Whisper serves as a foundation for numerous applications:
- **Unified audio models**: Combined speech recognition and general [[sound recognition]]
- **Podcast and video transcription**: Automated captioning and accessibility
- **Voice assistants**: Backend speech-to-text processing
- **Meeting transcription**: Real-time and batch processing of recorded meetings
- **Language learning tools**: Pronunciation feedback and listening comprehension

The model's open-source nature has enabled extensive community development, with implementations optimized for various platforms and use cases.

## Model Variants

**Model Comparison:**

- **tiny**: Parameters: 39 M, English-only: ✓, Multilingual: ✓
- **base**: Parameters: 74 M, English-only: ✓, Multilingual: ✓
- **small**: Parameters: 244 M, English-only: ✓, Multilingual: ✓
- **medium**: Parameters: 769 M, English-only: ✓, Multilingual: ✓
- **large**: Parameters: 1550 M, English-only: —, Multilingual: ✓
- **large-v2**: Parameters: 1550 M, English-only: —, Multilingual: ✓
- **large-v3**: Parameters: 1550 M, English-only: —, Multilingual: ✓

## See Also

- [[Speech recognition]]
- [[Transcription software]]
- [[GPT-4o]]
- [[Transformer (machine learning model)]]
- [[Automatic speech recognition]]

## References

1. Radford, Alec et al. (2022). "Robust Speech Recognition via Large-Scale Weak Supervision". arXiv:2212.04356.
2. Wiggers, Kyle (September 21, 2022). "OpenAI open-sources Whisper, a multilingual speech recognition system". *TechCrunch*.
3. "Introducing Whisper". OpenAI. September 21, 2022.
4. Davis, Wes (April 6, 2024). "OpenAI transcribed over a million hours of YouTube videos to train GPT-4". *The Verge*.
5. Burke, Garance; Schellmann, Hilke (October 26, 2024). "Researchers say an AI-powered transcription tool used in hospitals invents things no one ever said". *AP News*.
6. Koenecke, Allison et al. (2024). "Careless Whisper: Speech-to-Text Hallucination Harms". ACM FAccT 2024. arXiv:2402.08021.
7. Golla, Ramsri Goutham (March 6, 2023). "Here Are Six Practical Use Cases for the New Whisper API". *Slator*.
8. OpenAI DevDay: Opening Keynote. November 6, 2023.
