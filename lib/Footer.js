import Link from 'next/link'
import React from 'react'
import AlignItems from './style/AlignItems'

export default function Footer() {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderTop:'2px solid #f0f0f0',
        marginTop:'5%'
      }}
    >
      <AlignItems justifyContent={'center'}>
        <p>
          Designed & Developed By 
          <Link href="https://501a.netlify.app/" target="_blank" rel="noreferrer">
            <a>501A</a>
          </Link>
        </p>
      </AlignItems>
    </div>
  )
}
