'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface TINInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

export function TINInput({
  value,
  onChange,
  className,
  placeholder = '000-000-000',
  disabled = false,
  error = false,
}: TINInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Stable ref callback to prevent infinite re-renders
  const setRef = React.useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    []
  );

  // Split the value into three parts
  const parts = React.useMemo(() => {
    const cleanValue = value.replace(/\D/g, ''); // Remove non-digits
    return [
      cleanValue.slice(0, 3),
      cleanValue.slice(3, 6),
      cleanValue.slice(6, 9),
    ];
  }, [value]);

  const handleInputChange = (index: number, inputValue: string) => {
    // Only allow digits
    const digitsOnly = inputValue.replace(/\D/g, '');

    // Limit to 3 digits per field
    const limitedValue = digitsOnly.slice(0, 3);

    // Update the specific part
    const newParts = [...parts];
    newParts[index] = limitedValue;

    // Combine all parts
    const newValue = newParts.join('');
    onChange(newValue);

    // Auto-focus next field if current field is full
    if (limitedValue.length === 3 && index < 2) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace to move to previous field
    if (e.key === 'Backspace' && parts[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 2) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    const limitedPastedData = pastedData.slice(0, 9);
    onChange(limitedPastedData);

    // Focus the appropriate field based on pasted length
    if (limitedPastedData.length <= 3) {
      inputRefs.current[0]?.focus();
    } else if (limitedPastedData.length <= 6) {
      inputRefs.current[1]?.focus();
    } else {
      inputRefs.current[2]?.focus();
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          <Input
            ref={setRef(index)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={part}
            onChange={e => handleInputChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={disabled}
            className={cn(
              'text-center font-mono w-12 bg-card px-0',
              error && 'border-destructive',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            placeholder={placeholder.split('-')[index]}
            maxLength={3}
          />
          {index < 2 && (
            <span className="text-muted-foreground font-mono text-lg">-</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
