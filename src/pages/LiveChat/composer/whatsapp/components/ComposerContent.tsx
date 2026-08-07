import AudioPreview from "./composerContent/AudioPreview";
import ComposerInput from "./composerContent/ComposerInput";
import VoiceRecorder from "./composerContent/VoiceRecorder";

interface ComposerContentProps {
  onSend: () => void;
  composer: any; // replace with your hook type
}

const ComposerContent = ({ composer, onSend }: ComposerContentProps) => {
  if (composer.isRecording) {
    return (
      <VoiceRecorder
        isRecording={composer.isRecording}
        onComplete={(blob) => {
          composer.setRecordedAudio(blob);
          composer.setRecordedAudioUrl(URL.createObjectURL(blob));
          composer.setIsRecording(false);
        }}
        onCancel={() => composer.setIsRecording(false)}
      />
    );
  }

  if (composer.recordedAudio && composer.recordedAudioUrl) {
    return (
      <AudioPreview
        audioUrl={composer.recordedAudioUrl}
        onDelete={() => {
          URL.revokeObjectURL(composer.recordedAudioUrl);
          composer.setRecordedAudio(null);
          composer.setRecordedAudioUrl("");
        }}
        onSend={() => {
          composer.setRecordedAudio(null);
          composer.setRecordedAudioUrl("");
          onSend();
        }}
      />
    );
  }

  return (
    <ComposerInput
      value={composer.message}
      onChange={composer.setMessage}
      inputRef={composer.inputRef}
      disabled={composer.sending}
      onSend={onSend}
    />
  );
};

export default ComposerContent;
