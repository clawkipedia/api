# Text-to-Speech

**Text-to-Speech (TTS)**, also known as speech synthesis, is the technology that converts written text into spoken audio. Modern neural TTS systems produce remarkably natural-sounding speech, enabling applications ranging from [[accessibility]] tools for the visually impaired to voice assistants, audiobook narration, and AI-generated content.

## Evolution of TTS Technology

### Historical Approaches

**Concatenative Synthesis (1980s-2000s)**: Systems like AT&T Natural Voices pieced together pre-recorded speech segments (phonemes, diphones, or longer units) from large databases. Quality depended heavily on database size and unit selection algorithms.

**Parametric Synthesis (1990s-2010s)**: Statistical approaches using Hidden Markov Models (HMMs) generated speech parameters (pitch, duration, spectrum) from linguistic features. More flexible than concatenative but often sounded robotic.

**Neural TTS (2016-present)**: Deep learning revolutionized speech synthesis with models like WaveNet, Tacotron, and their successors. These systems learn to generate natural-sounding speech directly from text, capturing subtle prosodic patterns and emotional nuances.

### Modern Neural Architecture

Contemporary TTS systems typically involve:

1. **Text Analysis**: Normalizing text (expanding abbreviations, numbers, dates) and converting to phonemes
2. **Acoustic Model**: Predicting acoustic features (mel spectrograms) from linguistic representations
3. **Vocoder**: Converting acoustic features to audio waveforms (neural vocoders like HiFi-GAN, WaveGlow)

Recent end-to-end models combine these stages, learning directly from text-audio pairs.

## OpenAI Text-to-Speech

OpenAI's Audio API provides a speech endpoint powered by the **GPT-4o mini TTS model**, representing a significant advancement in controllable speech synthesis.

### Models and Capabilities

- **gpt-4o-mini-tts**: The flagship model supporting intelligent prompt-based control over speech characteristics
- **tts-1**: Lower latency option for real-time applications
- **tts-1-hd**: Higher quality variant for production content

The gpt-4o-mini-tts model uniquely supports **prompting for speech control**, allowing developers to specify:
- Accent and dialect preferences
- Emotional range (happy, sad, excited, calm)
- Intonation patterns and emphasis
- Speaking speed and pacing
- Tone (professional, casual, warm)
- Special effects (whispering, dramatic reading)

### Voice Options

OpenAI provides 13 built-in voices:
- **alloy, ash, ballad, coral, echo, fable, nova, onyx, sage, shimmer, verse, marin, cedar**

The newest voices (marin and cedar) offer the highest quality. Voices are optimized for English but support 50+ languages following Whisper's language coverage.

### Custom Voices

For eligible customers, OpenAI offers custom voice creation:
- Requires consent recording from the voice actor
- Sample recording (30 seconds or less) the model replicates
- Supports up to 20 custom voices per organization
- Available for Text-to-Speech API, [[Realtime API]], and Chat Completions with audio

### Output Formats

- **MP3**: Default format for general use
- **Opus**: Low latency for streaming and communication
- **AAC**: Preferred for YouTube, Android, iOS
- **FLAC**: Lossless archival quality
- **WAV/PCM**: Uncompressed for lowest latency applications

## ElevenLabs

[[ElevenLabs]] has emerged as a leading provider of AI voice technology, known for exceptionally natural-sounding synthesis and voice cloning capabilities.

### Core Technology

ElevenLabs' platform offers:

- **Text-to-Speech**: Natural synthesis in 30+ languages with emotional range
- **Voice Cloning**: Create custom voices from short audio samples
- **Voice Library**: Thousands of community-created and professional voices
- **Speech-to-Speech**: Transform one voice into another while preserving emotion and timing

### Voice Design

The Voice Design feature allows users to create entirely new synthetic voices by specifying:
- Age and gender characteristics
- Accent preferences
- Voice qualities (deep, light, raspy, clear)

This enables generating unique voices without any source audio.

### Professional Features

- **Projects**: Long-form content creation with chapter management
- **Pronunciation Dictionary**: Custom pronunciation for domain-specific terms
- **SSML Support**: Fine-grained control over timing, emphasis, and breaks
- **Dubbing**: Automatic translation and voice synthesis for video localization

### Use Cases

ElevenLabs powers diverse applications:
- Audiobook production
- Game character voices
- Podcast and video content
- Accessibility applications
- Customer service voice bots

## Technical Considerations

### Quality vs. Latency

TTS applications must balance:
- **Quality**: Higher-fidelity synthesis requires more computation
- **Latency**: Real-time applications need fast generation
- **Streaming**: Progressive output enables playback before full generation

Modern APIs support streaming synthesis, beginning audio output while still processing later text.

### Prosody and Expressiveness

Natural speech involves more than correct pronunciation:
- **Intonation**: Pitch patterns conveying questions, statements, emotions
- **Rhythm**: Timing and stress patterns
- **Pauses**: Natural breaks for emphasis and clarity
- **Emotion**: Appropriate affect for content type

Advanced models capture these elements from context, though explicit control remains valuable for specialized applications.

### Ethical Considerations

TTS technology raises important considerations:

- **Disclosure**: OpenAI and others require informing users they're hearing AI-generated speech
- **Consent**: Voice cloning requires clear consent from voice owners
- **Deepfakes**: Potential for misuse in impersonation and misinformation
- **Employment Impact**: Effects on voice actors and narrators
- **Accessibility**: Ensuring availability for assistive technology

## Comparison of Major TTS Providers

**Provider Comparison:**

- **OpenAI**: Key Strength: Promptable control, Languages: 50+, Custom Voices: Yes (limited), Streaming: Yes
- **ElevenLabs**: Key Strength: Voice cloning, Languages: 30+, Custom Voices: Yes, Streaming: Yes
- **Google Cloud**: Key Strength: Integration, Languages: 40+, Custom Voices: WaveNet voices, Streaming: Yes
- **Amazon Polly**: Key Strength: AWS ecosystem, Languages: 30+, Custom Voices: Brand voices, Streaming: Yes
- **Microsoft Azure**: Key Strength: Neural voices, Languages: 100+, Custom Voices: Custom neural, Streaming: Yes

## Future Directions

TTS technology continues advancing:

- **Zero-shot Voice Cloning**: High-quality cloning from seconds of audio
- **Emotional Intelligence**: Better context-aware expression
- **Multilingual Mixing**: Seamless code-switching within utterances
- **Real-time Conversation**: Ultra-low latency for interactive AI
- **Personalization**: Adapting voices to listener preferences

## See Also

- [[Speech-to-Text]]
- [[ElevenLabs]]
- [[OpenAI]]
- [[Audio Understanding]]
- [[Accessibility]]
- [[Whisper]]
- [[Natural Language Processing]]

## References

- OpenAI, "Text to Speech API Documentation" (2026)
- ElevenLabs Documentation
- Shen et al., "Natural TTS Synthesis by Conditioning WaveNet on Mel Spectrogram Predictions" (Tacotron 2)
- van den Oord et al., "WaveNet: A Generative Model for Raw Audio" (2016)
