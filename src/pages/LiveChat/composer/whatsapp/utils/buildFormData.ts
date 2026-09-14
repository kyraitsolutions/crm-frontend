export const buildFormData = (payload: any) => {
  const formData = new FormData();
  formData.append("to", payload.to);
  formData.append("type", payload.type);

  const appendMedia = (field: "image" | "video" | "document" | "audio") => {
    const media = payload[field] || {};
    if (media.link) {
      formData.append(
        field,
        JSON.stringify({
          link: media.link,
          caption: media.caption,
          filename: media.filename,
          mimeType: media.mimeType,
          size: media.size,
        }),
      );
      if (media.caption) formData.append("caption", media.caption);
      if (media.filename) formData.append("filename", media.filename);
      return;
    }

    if (media.caption) formData.append("caption", media.caption);
    if (media.file) formData.append("file", media.file);
  };

  switch (payload.type) {
    case "text":
      formData.append("text", JSON.stringify(payload.text));
      break;

    case "image":
      appendMedia("image");
      break;

    case "video":
      appendMedia("video");
      break;

    case "document":
      appendMedia("document");
      break;

    case "audio":
      appendMedia("audio");
      break;

    case "template":
      formData.append("template", JSON.stringify(payload.template));
      formData.append("parameter_format", payload.template.parameter_format);
      break;
  }

  return formData;
};
