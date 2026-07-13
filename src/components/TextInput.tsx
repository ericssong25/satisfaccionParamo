import { useEffect, useRef } from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  autoFocus?: boolean;
}

export default function TextInput({ value, onChange, placeholder, multiline = false, autoFocus = false }: TextInputProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Hacer scroll hacia el campo con un pequeño delay para asegurar que el DOM esté listo
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        inputRef.current?.focus();
      }, 300);
    }
  }, [autoFocus]);
  const baseClasses = `
    w-full px-4 py-3 rounded-xl border-2 border-gray-200
    focus:border-primary focus:outline-none
    transition-all duration-300
    font-garet text-dark placeholder:text-dark/40
    bg-white
  `;

  if (multiline) {
    return (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className={`${baseClasses} resize-none`}
      />
    );
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={baseClasses}
    />
  );
}
