import React,{useState} from 'react'

export default function Button(props) {
  const [hover, setHover] = useState(false);

  const button = {
    border: `2px solid ${props.accentColor ? 'var(--accentColor)':'#E8E8E8'}`,
    backgroundColor: `${props.accentColor ? 'var(--accentColor)':'#F0F0F0'}`,
    color: `${props.accentColor ? 'white':'black'}`,
    padding: `${props.children ? '0.5em 1em':'0.5em'}`,
    borderRadius: `${props.children ? '10px':'50px'}`,
    cursor: 'pointer',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5em',
    transition: '0.5s',
    float: `${props.float ? props.float : 'none'}`,
    filter: `${hover ? 'brightness(0.9)':'none'}`
  }

  return (
    <button
      title={props.title}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={button}
      onClick={props.onClick}
    >
      {props.icon}
      {props.children}
    </button>
  )
}
