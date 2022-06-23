import React,{useState} from 'react'

export default function Input(props) {
    const [focus, setFocus] = useState(false)
    const input = {
        border: `2px solid ${focus ? 'var(--faintAccentColor)':'#f0f0f0'}`,
        backgroundColor:`${focus ? 'white':'#f0f0f0'}`,
        padding: '0.5em 1em',
        borderRadius: '10px',
        outline: 'none',
        minWidth: `${props.minWidth ? props.minWidth:'200px'}`
    }

    return (
        <input
            type={props.type ? props.type : "text"}
            min="1"
            placeholder={props.placeholder}
            style={input}
            onFocus={()=>{setFocus(true)}}
            onBlur={()=>{setFocus(false)}}
            value={props.value}
            onChange={props.onChange}
        >
        </input>
    )
}
