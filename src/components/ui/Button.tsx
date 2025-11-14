import React from 'react'

export function Button({ children, className, ...props }: React.ComponentPropsWithoutRef<'button'> & { className?: string }) {
  return (
    <button
      {...props}
      suppressHydrationWarning
      className={"inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-[#DFDFD6] hover:bg-blue-700 disabled:opacity-50 " + (className ?? '')}
    >
      {children}
    </button>
  )
}

export default Button
