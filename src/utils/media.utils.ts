

export  const validateFile = (file: File) => {
    const maxSize=100 * 1024 * 1024;
    if (file.size > maxSize) {
        return false;
    }
    return true;
};