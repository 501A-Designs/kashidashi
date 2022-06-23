import React,{useState} from 'react'
import AlignItems from '../style/AlignItems';

export default function LargeButton(props) {
    const [hover, setHover] = useState(false);
    
    const largeButton = {
        borderRadius: '15px',
        backgroundColor: `${hover ? 'var(--faintAccentColor)':'transparent'}`,
        color:'var(--accentColor)',
        padding: '0.7em 1.5em 0.7em 0.7em',
        textAlign: 'center',
        cursor: 'pointer',
        transition:'0.2s'
    }
    return (
        <div
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            onClick={props.onClick}
            style={largeButton}
        >
            <AlignItems justifyContent={'space-between'}>
                <AlignItems>
                    <div
                        style={{
                            borderRadius: '10px',
                            fontSize:'1.3em',
                            color:'var(--accentColor)',
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {props.icon}
                    </div>
                    {props.children}
                </AlignItems>
                {props.additionalComponent}
            </AlignItems>
        </div>
    )
}
