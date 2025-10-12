const validateImageSource = (src) => {
    if (!src) return "/default-avatar.png";
    if (src.startsWith("data:image/")) {
      const validBase64Regex =
        /^data:image\/(jpeg|jpg|png|gif);base64,[A-Za-z0-9+/]*={0,2}$/;
      if (!validBase64Regex.test(src)) {
        return "/default-avatar.png";
      }
    } else {
      if (src.startsWith("http")) {
        try {
          const url = new URL(src);
          const allowedDomains = [
            "localhost",
            "127.0.0.1",
          ];
          const isLocalhost =
            url.hostname === "localhost" ||
            url.hostname === "127.0.0.1" ||
            url.hostname.startsWith("localhost:");

          if (!allowedDomains.includes(url.hostname) && !isLocalhost) {
            return "/default-avatar.png";
          }
        } catch (e) {
          return "/default-avatar.png";
        }
      }
      else if (!src.startsWith("/")) {
        return "/default-avatar.png";
      }
    }
    return src;
  };


// Helper function to create safe image source
export const getSafeImageSource = (imageData, fallbackImage) => {
  if (imageData) {
    const base64Src = `data:image/jpeg;base64,${imageData}`;
    return validateImageSource(base64Src);
  }
  return validateImageSource(fallbackImage);
};