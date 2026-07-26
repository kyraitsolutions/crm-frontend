import axios from "axios";

export const uploadFileToS3WithPresignedUrl = async (
  uploadUrl: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<void> => {
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    onUploadProgress: (event) => {
      if (!event.total) return;
      const progress = Math.round((event.loaded * 100) / event.total);
      onProgress?.(progress);
    },
  });
};

// export const uploadFileToS3WithPresignedUrl = async (
//   uploadUrl: string,
//   file: File,
//   onProgress?: (progress: number) => void,
// ): Promise<void> => {
//   const res = await fetch(uploadUrl, {
//     method: "put",
//     headers: {
//       "Content-Type": file.type || "application/octet-stream",
//     },

//     body: file,
//   });

//   if (!res.ok) {
//     throw new Error("S3 upload failed");
//   }
// };
