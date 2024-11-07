import React from 'react'

interface ShadowProps {
    children: React.ReactNode;
  }

  export const ShadowContainer: React.FC<ShadowProps> = ({ children }) => {
  return (
    <div className='p-3 border rounded'>
    { children}
    </div>
  )
}

