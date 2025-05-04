/**
 * Copy plain text to the clipboard.
 * @param {string} text
 */
export function copyText(text) {
  if (!navigator.clipboard) {
    console.warn('Clipboard API not supported');
    return;
  }
  navigator.clipboard.writeText(text).catch((err) => {
    console.error('Failed to copy text: ', err);
  });
}

/**
 * Copy HTML string to the clipboard as rich text.
 * @param {string} html
 */
export function copyHTML(html) {
  if (!navigator.clipboard) {
    console.warn('Clipboard API not supported');
    return;
  }
  const blob = new Blob([html], { type: 'text/html' });
  const data = [new ClipboardItem({ 'text/html': blob })];
  navigator.clipboard.write(data).catch((err) => {
    console.error('Failed to copy HTML: ', err);
  });
}

/**
 * Trigger download of the HTML content as a .html file.
 * @param {string} filename
 * @param {string} htmlContent
 */
export function downloadHTML(filename, htmlContent) {
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Open the default mail client with a pre-filled LOI.
 * @param {string} to      Recipient email address
 * @param {string} subject Email subject
 * @param {string} body    Email body (plain text)
 */
export function emailLOI(to, subject, body) {
  const params = new URLSearchParams({ subject, body });
  window.location.href = `mailto:${to}?${params.toString()}`;
}

/**
 * High-level handler: given LOI output and options, perform actions.
 * @param {{ text: string, html: string }} loi
 * @param {{ copyPlain?: boolean, copyRich?: boolean, download?: boolean, email?: string }} options
 */
export function handleLOIOutput(loi, options = {}) {
  if (options.copyPlain) copyText(loi.text);
  if (options.copyRich)  copyHTML(loi.html);
  if (options.download)   downloadHTML('LOI.html', loi.html);
  if (options.email)      emailLOI(options.email, loi.text.split('\n')[0], loi.text);
}

// Default export if you’re using it elsewhere
export default {
  copyText,
  copyHTML,
  downloadHTML,
  emailLOI,
  handleLOIOutput,
};
