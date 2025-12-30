'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  className = '',
  placeholder,
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      const currentIndex = options.findIndex(opt => opt.value === value);
      let newIndex = currentIndex;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          newIndex = (currentIndex + 1) % options.length;
          onChange(options[newIndex].value);
          break;
        case 'ArrowUp':
          event.preventDefault();
          newIndex = (currentIndex - 1 + options.length) % options.length;
          onChange(options[newIndex].value);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          setIsOpen(false);
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, value, options, onChange]);

  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption?.label || placeholder || '';

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* 触发器按钮 */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          select w-full text-left flex items-center justify-between
          hover:border-primary-400 dark:hover:border-primary-600
          focus:border-primary-500 dark:focus:border-primary-500
          ${isOpen ? 'border-primary-500 dark:border-primary-500 ring-2 ring-primary-200 dark:ring-primary-800' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          transition-all duration-200
        `}
      >
        <span className="truncate font-medium">{displayText}</span>
        <ChevronDown
          className={`
            w-4 h-4 text-dark-400 dark:text-dark-600 transition-all duration-200 flex-shrink-0 ml-2
            ${isOpen ? 'transform rotate-180 text-primary-500 dark:text-primary-400' : ''}
          `}
        />
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-card shadow-2xl max-h-64 overflow-auto custom-scrollbar animate-fade-in backdrop-blur-sm ring-1 ring-dark-200/50 dark:ring-dark-700/50">
          <div className="py-1.5">
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-4 py-3 text-left text-sm transition-all duration-200
                    flex items-center justify-between group relative
                    ${
                      isSelected
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white dark:from-primary-600 dark:to-primary-700 font-semibold shadow-md'
                        : 'text-dark-900 dark:text-dark-100 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100/50 dark:hover:from-primary-900/30 dark:hover:to-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300'
                    }
                    ${index === 0 ? 'rounded-t-lg' : ''}
                    ${index === options.length - 1 ? 'rounded-b-lg' : ''}
                    hover:shadow-sm
                    active:scale-[0.98]
                    ${!isSelected ? 'hover:pl-5' : ''}
                  `}
                >
                  <span className={`truncate flex-1 transition-all ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 flex-shrink-0 ml-3 text-white animate-fade-in" strokeWidth={3} />
                  )}
                  {!isSelected && (
                    <div className="w-4 h-4 flex-shrink-0 ml-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <div className="w-2 h-2 rounded-full bg-primary-400 dark:bg-primary-500 shadow-sm"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

