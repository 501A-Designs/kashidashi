import React from 'react'

export default function AlignItems(props) {
    const alignItems = {
        display: 'flex',
        alignItems: `${props.alignItems ? props.alignItems:'center'}`,
        justifyContent: `${props.justifyContent ? props.justifyContent:'none'}`,
        flexDirection: `${props.flexDirection ? props.flexDirection:'row'}`,
        height: `${props.height ? props.height:'none'}`,
        gap: `${props.gap ? props.gap:'0.5em'}`
    }

    return (
        <div style={alignItems}>
            {props.children}
        </div>
    )
}
