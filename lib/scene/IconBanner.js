import React from 'react'
import AlignItems from '../style/AlignItems'

export default function IconBanner(props) {
  return (
    <div
      style={{
        color:'var(--accentColor)',
        backgroundColor:'var(--faintAccentColor)',
        padding: '1em',
        borderRadius:'10px',
        display: 'grid',
        gridTemplateColumns:'1fr 9fr',
        gap: '0.5em',
      }}
    >
      <AlignItems justifyContent={'center'}>
        {props.icon}
      </AlignItems>
      <span style={{fontSize:'0.8em'}}>
        {props.children}
      </span>
    </div>
  )
}
