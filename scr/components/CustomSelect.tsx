import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  category?: string;
  fontFamily?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  renderFontPreview?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Selecione uma opção',
  disabled = false,
  className = '',
  renderFontPreview = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border bg-white transition-all text-xs font-semibold ${
          disabled
            ? 'opacity-60 cursor-not-allowed border-slate-200'
            : isOpen
            ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
            : 'border-slate-300 hover:border-slate-400 text-slate-800'
        }`}
      >
        <span className="truncate text-left text-slate-900 flex items-center gap-2">
          {selectedOption ? (
            <>
              <span
                style={{
                  fontFamily: renderFontPreview
                    ? selectedOption.fontFamily || selectedOption.value
                    : undefined,
                  fontSize: '0.85rem',
                }}
              >
                {selectedOption.label}
              </span>
              {selectedOption.category && (
                <span className="ml-1 text-[10px] font-normal text-slate-500 font-sans">
                  ({selectedOption.category})
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-400 font-normal">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white rounded-xl border border-slate-200 shadow-xl max-h-60 overflow-y-auto py-1 animate-fadeIn">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            const fontStyle = renderFontPreview
              ? opt.fontFamily || opt.value
              : undefined;

            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left transition-colors ${
                  isSelected
                    ? 'bg-blue-50 font-bold text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="truncate flex items-center gap-2">
                  <span
                    style={{
                      fontFamily: fontStyle,
                      fontSize: '0.9rem',
                    }}
                  >
                    {opt.label}
                  </span>
                  {opt.category && (
                    <span className="text-[10px] font-normal text-slate-400 font-sans">
                      ({opt.category})
                    </span>
                  )}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
