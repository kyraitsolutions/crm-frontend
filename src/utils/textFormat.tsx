export const formatWhatsappMessage = (text: string) => {
    return text
        // Escape HTML
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")

        // WhatsApp formatting
        .replace(/\*(.*?)\*/gs, "<strong>$1</strong>")
        .replace(/_(.*?)_/gs, "<em>$1</em>")
        .replace(/~(.*?)~/gs, "<del>$1</del>")
        .replace(/`(.*?)`/gs, "<code>$1</code>")

        // Preserve line breaks
        .replace(/\n/g, "<br/>");
};