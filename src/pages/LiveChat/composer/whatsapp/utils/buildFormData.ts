export const buildFormData = (payload: any) => {
  const formData = new FormData();

  formData.append("to", payload.to);
  formData.append("type", payload.type);

  switch (payload.type) {
    case "text":
      formData.append("text", JSON.stringify(payload.text));
      break;

    case "image":
      formData.append("caption", payload.image.caption);
      formData.append("file", payload.image.file);
      break;

    case "video":
      formData.append("caption", payload.video?.caption);
      formData.append("file", payload.video.file);
      break;

    case "document":
      formData.append("caption", payload.document.caption);
      formData.append("file", payload.document.file);
      break;

    case "audio":
      // formData.append("audio",);
      formData.append("file", payload.audio.file);
      break;

    case "template":
      formData.append("template", JSON.stringify(payload.template));
      break;
  }

  return formData;
};
