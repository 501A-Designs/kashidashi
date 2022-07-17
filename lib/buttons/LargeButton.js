import React,{useState} from 'react'
import AlignItems from '../style/AlignItems';
// import {isBrowser} from 'react-device-detect';
import { useMediaQuery } from 'react-responsive'

export default function LargeButton(props) {
    const [hover, setHover] = useState(false);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 1000px)' })
    
    const largeButton = {
        borderRadius: '15px',
        backgroundColor: `${hover ? 'var(--faintAccentColor)':'transparent'}`,
        color:'var(--accentColor)',
        padding: `${isSmallScreen ? '0.5em':'0.7em 1.5em 0.7em 0.7em'}`,
        textAlign: 'center',
        width: `${isSmallScreen ? 'fit-content':'100%'}`,
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
            <AlignItems justifyContent={'space-between'}  flexDirection={isSmallScreen && "column"}>
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
                    {!isSmallScreen && props.children}
                </AlignItems>
                {props.additionalComponent}
            </AlignItems>
        </div>
    )
}
