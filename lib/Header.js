import React from 'react'

export default function Header(props) {
    const header = {
        borderBottom: '2px solid var(--faintAccentColor)',
        backgroundColor: 'white',
        padding:'1.5em 10%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: '0px',
        zIndex:10
    }
    return (
        <header style={header}>
            <div>
                <h1 style={{margin:0,padding:0,fontSize:'1.5em'}}>{props.title ? props.title:'Kashidashi'}</h1>
                {props.subTitle && <h4 style={{margin:0,padding:0,color:'#696969'}}>{props.subTitle}</h4>}
            </div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5em'
                }}
            >
                {props.children}
            </div>
        </header>
    )
}
