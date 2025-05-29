// Base64 encoded SVG placeholder image
export const placeholderImage = `data:image/svg+xml;base64,${btoa(`
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#f8f9fa"/>
  <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#6c757d" text-anchor="middle">
    No Image Available
  </text>
</svg>
`)}`; 