import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleFile = (file) => {
    setError('');
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      setError("Supported formats: JPG, PNG, WEBP, or PDF.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File is too heavy. Max limit is 10MB.");
      return;
    }

    const details = {
      name: file.name,
      size: formatBytes(file.size),
      type: file.type.split('/')[1].toUpperCase(),
      preview: null,
      isImage: file.type.startsWith('image/')
    };

    if (details.isImage) {
      const reader = new FileReader();
      reader.onload = (e) => setFileData({ ...details, preview: e.target.result });
      reader.readAsDataURL(file);
    } else {
      setFileData(details);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="glass-card">
        <header className="card-header">
          <h2>File Studio</h2>
          <p>Upload and optimize your assets</p>
        </header>

        <div 
          className={`upload-area ${isDragging ? 'dragging' : ''} ${fileData ? 'has-file' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => !fileData && fileInputRef.current.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
            accept="image/*, application/pdf" 
            hidden 
          />
          
          {!fileData ? (
            <div className="upload-prompt">
              <div className="icon-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              </div>
              <p><span>Click to upload</span> or drag and drop</p>
              <small>PNG, JPG or PDF (max 10MB)</small>
            </div>
          ) : (
            <div className="preview-mode">
              {fileData.isImage ? (
                <img src={fileData.preview} alt="Preview" className="img-render" />
              ) : (
                <div className="pdf-placeholder">
                  <div className="pdf-icon">PDF</div>
                </div>
              )}
              <button className="clear-btn" onClick={(e) => { e.stopPropagation(); setFileData(null); setError(''); }}>
                ✕
              </button>
            </div>
          )}
        </div>

        {error && <div className="error-badge">{error}</div>}

        {fileData && (
          <div className="info-panel">
            <div className="info-row">
              <span className="label">File Name</span>
              <span className="value" title={fileData.name}>{fileData.name}</span>
            </div>
            <div className="info-grid">
              <div className="info-row">
                <span className="label">Size</span>
                <span className="value">{fileData.size}</span>
              </div>
              <div className="info-row">
                <span className="label">Format</span>
                <span className="value-tag">{fileData.type}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;