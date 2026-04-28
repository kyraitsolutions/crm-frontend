export const uploadFileToS3WithPresignedUrl = async (
  uploadUrl: string,
  file: File,
): Promise<void> => {
  const res = await fetch(uploadUrl, {
    method: "put",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error("S3 upload failed");
  }
};
