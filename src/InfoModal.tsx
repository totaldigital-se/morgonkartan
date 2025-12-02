import React, { useState, useEffect } from 'react';
import './InfoModal.css';

interface InfoModalProps {
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch('/blueprint.md')
      .then(response => response.text())
      .then(markdown => {
        // A more robust (but still simple) markdown to HTML parser
        let html = '';
        const lines = markdown.split('\n');
        let inList = false;

        lines.forEach(line => {
          if (line.startsWith('## ')) {
            if (inList) html += '</ul>';
            inList = false;
            html += `<h2>${line.substring(3)}</h2>`;
          } else if (line.startsWith('### ')) {
            if (inList) html += '</ul>';
            inList = false;
            html += `<h3>${line.substring(4)}</h3>`;
          } else if (line.startsWith('* ')) {
            if (!inList) {
              html += '<ul>';
              inList = true;
            }
            html += `<li>${line.substring(2)}</li>`;
          } else if (line.startsWith('**Johan:**')) {
            if (inList) html += '</ul>';
            inList = false;
            html += `<p><strong>Johan:</strong>${line.substring(10)}</p>`;
          } else if (line.startsWith('**Gemini:**')) {
            if (inList) html += '</ul>';
            inList = false;
            html += `<p><strong>Gemini:</strong></p><pre><code>${line.substring(11).replace(/\\n/g, '\n')}</code></pre>`;
          }
          else {
            if (inList) {
               html += '</ul>';
               inList = false;
            }
            if (line.trim() !== '') {
              html += `<p>${line}</p>`;
            }
          }
        });

        if (inList) html += '</ul>';
        setHtmlContent(html);
      });
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {htmlContent ? (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default InfoModal;
