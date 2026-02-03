# Speech-to-Text

**Speech-to-Text (STT)**, also known as Automatic Speech Recognition (ASR), is the technology that converts spoken language into written text. Modern STT systems powered by [[deep learning]] achieve near-human accuracy across dozens of languages, enabling applications from voice assistants and transcription services to accessibility tools and real-time captioning.

## Technical Foundations

### Traditional Approaches

Early speech recognition systems used:

- **Hidden Markov Models (HMMs)**: Statistical models representing speech as sequences of states
- **Gaussian Mixture Models (GMMs)**: Modeling acoustic features as mixtures of Gaussian distributions
- **Language Models**: N-gram models providing linguistic context to improve recognition

These systems required extensive feature engineering (MFCCs, filterbanks) and separate training of acoustic and language models.

### Deep Learning Revolution

Neural networks transformed speech recognition:

1. **DNN-HMM Hybrids**: Deep neural networks replacing GMMs for acoustic modeling while retaining HMM structure
2. **End-to-End Models**: Systems like DeepSpeech learning directly from audio to text
3. **Attention-based Models**: Sequence-to-sequence architectures with attention mechanisms
4. **Transformer Models**: Self-attention architectures achieving state-of-the-art results

## OpenAI Whisper and Transcription Models

[[OpenAI]]'s speech-to-text offerings represent the current state of the art for general-purpose transcription.

### Whisper

[[Whisper]] is OpenAI's open-source speech recognition model, trained on 680,000 hours of multilingual data from the web. Key features:

- **Multilingual**: Supports 99 languages with varying quality levels
- **Robust**: Handles accents, background noise, and technical language
- **Multi-task**: Transcription, translation to English, language identification
- **Zero-shot**: Strong performance without fine-tuning on target domains

The original whisper-1 model remains available through OpenAI's API, supporting multiple output formats (JSON, text, SRT, VTT, verbose_json).

### GPT-4o Transcription Models

OpenAI's newer transcription models build on [[GPT-4o]]'s multimodal capabilities:

- **gpt-4o-transcribe**: Higher quality transcription with prompt support and logprobs
- **gpt-4o-mini-transcribe**: Faster, cost-effective option with the same capabilities
- **gpt-4o-transcribe-diarize**: Adds speaker diarization with up to 32 speakers

These models support only JSON and plain text output but offer improved accuracy over whisper-1.

### Speaker Diarization

The gpt-4o-transcribe-diarize model provides speaker-aware transcripts:

```json
{
  "segments": [
    {"speaker": "Speaker 1", "text": "Hello, how are you?", "start": 0.0, "end": 1.5},
    {"speaker": "Speaker 2", "text": "I'm doing well, thanks!", "start": 1.7, "end": 3.2}
  ]
}
```

Features include:
- Automatic speaker detection and labeling
- **Known speaker references**: Provide 2-10 second audio clips to identify specific speakers by name
- **Chunking strategy**: Required for audio longer than 30 seconds
- Support for up to 4 known speakers with reference clips

### API Usage

OpenAI's transcription endpoint accepts audio files up to 25 MB in formats: mp3, mp4, mpeg, mpga, m4a, wav, and webm.

```python
from openai import OpenAI

client = OpenAI()
audio_file = open("meeting.mp3", "rb")

transcription = client.audio.transcriptions.create(
    model="gpt-4o-transcribe",
    file=audio_file
)
print(transcription.text)
```

### Translation

The translations endpoint transcribes audio in any language and outputs English text, currently supporting only the whisper-1 model.

## AssemblyAI

[[AssemblyAI]] provides a developer-focused speech AI platform with enterprise-grade capabilities.

### Core Features

- **Speech-to-Text**: High-accuracy transcription for audio and video files
- **Real-time Transcription**: Streaming transcription from microphone input
- **Speaker Labels**: Diarization identifying different speakers
- **Auto Chapters**: Automatic summarization with chapter markers
- **Content Moderation**: Detection of sensitive content
- **Entity Detection**: Identifying named entities (people, places, organizations)
- **Sentiment Analysis**: Detecting emotional tone throughout audio

### LLM Gateway

AssemblyAI's LLM Gateway enables applying [[large language models]] directly to audio:
- Transcribe and analyze in one pipeline
- Ask questions about audio content
- Generate summaries and action items
- Extract structured data from conversations

### Audio Intelligence

Beyond transcription, AssemblyAI offers:
- **Summarization**: Automatic summary generation
- **Sentiment Analysis**: Per-sentence sentiment scoring  
- **Topic Detection**: Identifying discussion topics
- **PII Redaction**: Automatic removal of sensitive information
- **Custom Vocabulary**: Boosting recognition of domain terms

## Other Notable Platforms

### Google Cloud Speech-to-Text

- Multiple model options (latest_long, telephony, medical)
- 125+ languages and variants
- Real-time and batch processing
- Speaker diarization and word timestamps
- Integration with Google Cloud ecosystem

### Amazon Transcribe

- Medical transcription with HIPAA compliance
- Call analytics for contact centers
- Custom vocabulary and language models
- Automatic content redaction
- Subtitle generation

### Microsoft Azure Speech

- Neural speech recognition
- Custom Speech for domain adaptation
- Pronunciation assessment
- Real-time conversation transcription
- Batch transcription for large volumes

## Technical Challenges

Despite remarkable progress, STT systems face ongoing challenges:

### Acoustic Challenges
- Background noise and music
- Multiple overlapping speakers
- Room acoustics and reverberation
- Low-quality audio (phone calls, compressed)

### Linguistic Challenges
- Accents and dialects
- Code-switching between languages
- Domain-specific terminology
- Disfluencies (ums, ahs, false starts)
- Proper noun recognition

### Practical Considerations
- Punctuation and formatting
- Speaker attribution accuracy
- Real-time latency requirements
- Privacy and data security

## Accuracy Metrics

Speech recognition accuracy is typically measured by:

- **Word Error Rate (WER)**: Percentage of words incorrectly transcribed (lower is better)
- **Character Error Rate (CER)**: Similar but at character level
- **Real-Time Factor (RTF)**: Processing time relative to audio duration

Modern systems achieve 5-10% WER on clean speech, with higher error rates for challenging conditions.

## Applications

Speech-to-text enables numerous applications:

- **Voice Assistants**: [[Siri]], Alexa, Google Assistant
- **Transcription Services**: Meetings, interviews, podcasts
- **Captioning**: Live TV, video platforms, accessibility
- **Voice Search**: Search engines, mobile applications
- **Healthcare**: Clinical documentation, medical dictation
- **Legal**: Court reporting, deposition transcription
- **Education**: Lecture capture, language learning
- **Customer Service**: Call center analytics, voice bots

## Future Directions

The field continues evolving:

- **Multimodal Integration**: Combining audio, visual, and text understanding
- **Personalization**: Adapting to individual speakers
- **Smaller Models**: On-device processing for privacy and latency
- **Code-switching**: Seamless handling of multilingual speech
- **Emotional Understanding**: Recognizing tone and intent beyond words

## See Also

- [[Whisper]]
- [[Text-to-Speech]]
- [[Audio Understanding]]
- [[Natural Language Processing]]
- [[OpenAI]]
- [[Large Language Models]]
- [[Accessibility]]

## References

- OpenAI, "Speech to Text API Documentation" (2026)
- AssemblyAI Documentation
- Radford et al., "Robust Speech Recognition via Large-Scale Weak Supervision" (Whisper, 2022)
