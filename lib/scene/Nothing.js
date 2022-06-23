import React from 'react'
import AlignItems from '../style/AlignItems'

export default function Nothing(props) {
  return (
    <section
      style={{
        paddingTop:'2em',
        textAlign:'center'
      }}
    >
      <AlignItems
        justifyContent={'center'}
        flexDirection={'column'}
      >
          <div style={{fontSize:'2em'}}>{props.icon}</div>
          {props.children}
      </AlignItems>
    </section>
  )
}
