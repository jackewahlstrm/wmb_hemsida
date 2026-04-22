'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface Props {
  id?: string
  name: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  error?: boolean
}

export default function CustomSelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'Välj...',
  error = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    if (open) {
      const currentIndex = options.findIndex((o) => o.value === value)
      setFocused(currentIndex >= 0 ? currentIndex : 0)
    }
  }, [open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocused((f) => (f + 1) % options.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocused((f) => (f - 1 + options.length) % options.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (focused >= 0 && options[focused]) {
        onChange(options[focused].value)
        setOpen(false)
      }
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full px-4 py-3 bg-white dark:bg-zinc-800 border rounded-xl text-left text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-wmb-blue focus:border-transparent transition-all flex items-center justify-between gap-2 ${
          error ? 'border-red-400' : 'border-zinc-300 dark:border-zinc-700'
        }`}
      >
        <span className={selected ? '' : 'text-zinc-400'}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-zinc-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-20 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-lg p-1.5 max-h-72 overflow-y-auto animate-in"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value
            const isFocused = i === focused
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setFocused(i)}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between gap-2 text-sm transition-colors ${
                  isFocused
                    ? 'bg-sky-100 text-sky-900 dark:bg-sky-500/20 dark:text-sky-100'
                    : 'text-zinc-700 dark:text-zinc-200'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={16} className="text-wmb-blue shrink-0" />}
              </li>
            )
          })}
        </ul>
      )}

      <style jsx>{`
        @keyframes dropdown-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: dropdown-in 0.15s ease-out;
        }
      `}</style>
    </div>
  )
}
