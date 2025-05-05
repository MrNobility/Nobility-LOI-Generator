// src/ui/sharedRenderer.js

/**
 * Create an element with attributes and children.
 * @param {string} tag
 * @param {Object} attrs
 * @param  {...Node|string} children
 * @returns {HTMLElement}
 */
export function createElement(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, val]) => {
    if (key === 'className') {
      el.className = val;
    } else if (key.startsWith('on') && typeof val === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), val);
    } else {
      el.setAttribute(key, val);
    }
  });
  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  });
  return el;
}

/**
 * Create a form group by nesting the input inside its label.
 * @param {string} labelText
 * @param {HTMLElement} inputEl
 * @returns {HTMLElement}
 */
export function createFormGroup(labelText, inputEl) {
  const wrapper = createElement('div', { className: 'form-group' });
  const label = createElement(
    'label',
    { className: 'form-label' },
    labelText + ' ',
    inputEl
  );
  wrapper.appendChild(label);
  return wrapper;
}

/**
 * Create a <select> with id+name to enable autofill.
 * @param {string} name – unique identifier
 * @param {{ value: string, text: string }[]} options
 * @returns {HTMLSelectElement}
 */
export function createSelect(name, options = []) {
  const select = createElement('select', { id: name, name });
  options.forEach(({ value, text }) => {
    const opt = createElement('option', { value }, text);
    select.appendChild(opt);
  });
  return select;
}

/**
 * Create a <textarea> with id+name.
 * @param {string} name – unique identifier
 * @param {number} rows
 * @returns {HTMLTextAreaElement}
 */
export function createTextarea(name, rows = 6) {
  return createElement('textarea', { id: name, name, rows, className: 'tsv-input' });
}

/**
 * Create a <button>.
 * @param {string} text
 * @param {Function} onClick
 * @param {string} [type='button']
 * @returns {HTMLButtonElement}
 */
export function createButton(text, onClick, type = 'button') {
  return createElement('button', { type, onClick, className: 'btn' }, text);
}

/**
 * Render a LOI card with a spacious textarea and copy/download buttons.
 * @param {{ text: string, html: string }} loi
 * @returns {HTMLElement}
 */
export function renderLOICard(loi) {
  const textArea = createElement(
    'textarea',
    {
      readOnly: true,
      rows: 10,
      className: 'w-full h-64 resize-none border rounded p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
    },
    loi.text
  );

  const btnCopyText = createButton('Copy Text', () => {
    import('../core/outputEngine.js').then(mod => mod.copyText(loi.text));
  });

  const btnCopyHTML = createButton('Copy HTML', () => {
    import('../core/outputEngine.js').then(mod => mod.copyHTML(loi.html));
  });

  const btnDownload = createButton('Download HTML', () => {
    import('../core/outputEngine.js').then(mod => mod.downloadHTML('LOI.html', loi.html));
  });

  return createElement(
    'div',
    { className: 'loi-card space-y-4 bg-white border rounded-xl p-4' },
    textArea,
    createElement('div', { className: 'flex space-x-2' }, btnCopyText, btnCopyHTML, btnDownload)
  );
}
