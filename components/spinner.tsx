import React from 'react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'accent' | 'white'
  className?: string
}

const Spinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}: SpinnerProps) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  }

  const strokeWidth = {
    sm: 'border-2',
    md: 'border-3',
    lg: 'border-4'
  }

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-[var(--primary)]';
      case 'secondary':
        return 'text-[var(--soft-gray)]';
      case 'accent':
        return 'text-[var(--hover-accent)]';
      case 'white':
        return 'text-white';
      default:
        return 'text-[var(--primary)]';
    }
  }

  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-label="Loading">
      <div 
        className={`
          ${sizeClasses[size]}
          ${strokeWidth[size]}
          ${getColorClasses()}
          border-t-transparent
          rounded-full
          animate-spin
        `}
        style={{
          animationDuration: '1s',
          animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          animationIterationCount: 'infinite'
        }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Spinner
