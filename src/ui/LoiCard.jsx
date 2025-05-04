import React from 'react';

export default function LoiCard({ body }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(body);
  };

  return (
    <div className="loi-card">
      <textarea
        className="loi-textarea"
        readOnly
        rows={10}
        value={body}
        style={{ width: '100%' }}
      />
      <button onClick={handleCopy}>Copy to Clipboard</button>
    </div>
  );
}
