import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '../lib/cn';

const MAX_BYTES = 10 * 1024 * 1024;

export default function Dropzone({ onFile, fileName, onClear, accept = 'image/*' }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);

  const validateAndEmit = (file) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('File exceeds 10 MB limit.');
      return;
    }
    onFile(file);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer?.files?.[0];
          validateAndEmit(file);
        }}
        className={cn(
          'rounded-control border-2 border-dashed p-4 text-center cursor-pointer transition-colors',
          dragging
            ? 'border-primary bg-primary-soft/60'
            : 'border-line-strong bg-soft/60 hover:bg-soft hover:border-primary/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            validateAndEmit(file);
            e.target.value = '';
          }}
        />
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-9 h-9 rounded-full bg-card border border-line flex items-center justify-center text-primary">
            <Upload size={16} />
          </div>
          <div className="text-xs font-medium text-ink">
            {fileName ? (
              <span className="inline-flex items-center gap-2">
                <span>Uploaded: {fileName}</span>
                {onClear && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClear();
                    }}
                    aria-label="Remove uploaded file"
                    className="p-0.5 rounded-full hover:bg-hover text-ink-muted hover:text-ink"
                  >
                    <X size={13} />
                  </button>
                )}
              </span>
            ) : (
              'Drop a sonar echogram here, or click to browse'
            )}
          </div>
          <div className="text-[11px] text-ink-muted">PNG, JPG, BMP up to 10 MB</div>
        </div>
      </div>
      {error && <p className="text-xs text-bad mt-1.5">{error}</p>}
    </div>
  );
}
