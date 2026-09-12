import AudioPreview from "./composerContent/AudioPreview";
import ComposerInput from "./composerContent/ComposerInput";
import VoiceRecorder from "./composerContent/VoiceRecorder";

interface ComposerContentProps {
  onSend: () => void;
  composer: any; // replace with your hook type
  disabled?: boolean;
}

const ComposerContent = ({
  composer,
  onSend,
  disabled = false,
}: ComposerContentProps) => {
  const handleSend = async () => {
    composer.setMessage("");
    composer.removeAttachment();
    composer.setShowEmojiPicker(false);

    onSend();
  };

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
      disabled={
        disabled || composer.sending || !!composer.selectedAttachmentType
      }
      placeholder={
        disabled
          ? "⏰ The 24-hour messaging window has ended. You can continue the conversation using an approved template."
          : "Type your message here..."
      }
      onSend={handleSend}
    />
  );
};

export default ComposerContent;
