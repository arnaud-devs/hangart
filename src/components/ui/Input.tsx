import React from 'react'

export const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  function Input(props, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className={"mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 " + (props.className ?? '')}
      />
    )
  }
)

Input.displayName = 'Input'

export default Input
