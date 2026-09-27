export interface PresignedPost {
  url: string;
  fields: Record<string, string>;
}

export interface PresignUploadHandle {
  promise: Promise<void>;
  abort: () => void;
}

export function isLocalUploadUrl(url: string): boolean {
  return url.startsWith("local-upload://");
}

export function isLocalDownloadUrl(url: string): boolean {
  return url.startsWith("local-download://");
}

function sendForm(
  url: string,
  form: FormData,
  headers: Record<string, string> | undefined,
  onProgress: (percent: number) => void,
): PresignUploadHandle {
  const xhr = new XMLHttpRequest();
  const promise = new Promise<void>((resolve, reject) => {
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }
      onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
        return;
      }
      const expired = xhr.status === 403 || xhr.status === 400;
      reject(
        Object.assign(new Error(expired ? "Upload URL expired" : "Upload failed"), {
          status: xhr.status,
          expired,
        }),
      );
    };
    xhr.onerror = () => {
      reject(Object.assign(new Error("Upload failed"), { status: 0, expired: false }));
    };
    xhr.onabort = () => {
      reject(Object.assign(new Error("Upload cancelled"), { aborted: true }));
    };
    xhr.open("POST", url);
    if (headers) {
      for (const [name, value] of Object.entries(headers)) {
        xhr.setRequestHeader(name, value);
      }
    }
    xhr.send(form);
  });

  return {
    promise,
    abort: () => xhr.abort(),
  };
}

export function uploadLocalSource(
  url: string,
  file: File,
  fields: Record<string, string>,
  headers: Record<string, string>,
  onProgress: (percent: number) => void,
): PresignUploadHandle {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }
  form.append("file", file);
  return sendForm(url, form, headers, onProgress);
}

export function uploadPresignedPost(
  post: PresignedPost,
  file: File,
  onProgress: (percent: number) => void,
): PresignUploadHandle {
  const form = new FormData();
  for (const [key, value] of Object.entries(post.fields)) {
    form.append(key, value);
  }
  form.append("file", file);
  return sendForm(post.url, form, undefined, onProgress);
}
