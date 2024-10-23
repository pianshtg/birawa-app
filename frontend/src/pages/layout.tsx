import Sidebar from '@/components/Sidebar'
import React from 'react'

type Props = {
    children: React.ReactNode;
}

export default function layout({children}: Props) {
  return (
    <div className='flex'>
    <Sidebar/>
    {children}
    </div>
  )
}
