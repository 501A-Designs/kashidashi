import React,{useState} from 'react'
import AlignItems from './style/AlignItems'
import { FiSlash,FiBookmark,FiTrash2,FiEdit } from "react-icons/fi";
import Button from './buttons/Button';

export default function KashidashiObjectRow(props) {
    const [hover, setHover] = useState(false);

    return (
        <div
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            style={{
                // backgroundColor: `${hover ? 'var(--faintAccentColor)':'transparent'}`,
                // borderBottom: `2px solid ${hover ? 'var(--faintAccentColor)':'transparent'}`,
                padding: '0.5em 0em',
                transition: '0.2s',
                cursor: 'pointer'
            }}
        >
            <AlignItems justifyContent={'space-between'}>
                <AlignItems>
                    <AlignItems gap={'1em'}>
                        <div
                            style={{
                                backgroundColor:'#F0F0F0',
                                borderRadius:'50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                padding: '1em'
                            }}
                        >
                            {props.emoji}
                        </div>
                        <h4 style={{margin:0,padding:0,marginRight:'1em'}}>{props.title}</h4>
                    </AlignItems>
                </AlignItems>
                <AlignItems>
                    <div style={{padding:'0.5em',color:`${props.reserved ? 'black' : 'var(--accentColor)'}`}}>
                        <AlignItems>
                            {props.reserved ? 
                                <>
                                    <FiSlash/>
                                    <span>貸出済：{props.reservedBy}</span>
                                </>:
                                <>
                                    <FiBookmark/>
                                    <span>貸出可能</span>
                                </>
                            }
                        </AlignItems>
                    </div>
                    <AlignItems gap={'0.2em'}>
                        <div
                            style={{
                                borderRadius:'10px 0px 0px 10px',
                                backgroundColor:'var(--faintAccentColor)',
                                color:'var(--accentColor',
                                padding:'0.4em 1em'
                            }}
                        >
                            {props.place}
                        </div>
                        <div
                            style={{
                                borderRadius:'0px 10px 10px 0px',
                                backgroundColor:'var(--faintAccentColor)',
                                color:'var(--accentColor',
                                padding:'0.4em 1em'
                            }}
                        >
                            {props.due}
                        </div>
                    </AlignItems>
                    {!props.reserved &&
                        <AlignItems>
                            <Button icon={<FiEdit/>} onClick={props.editButtonOnClick}>編集</Button>
                            <Button icon={<FiTrash2/>} onClick={props.removeButtonOnClick} accentColor={true}>消去</Button>
                        </AlignItems>
                    }
                </AlignItems>
            </AlignItems>
        </div>
    )
}
