import React,{useState} from 'react'
import AlignItems from './style/AlignItems'
import { FiSlash,FiBookmark,FiTrash2,FiEdit, FiUser,FiChevronUp,FiChevronDown } from "react-icons/fi";
import Button from './buttons/Button';

export default function KashidashiObjectRow(props) {
    const [hover, setHover] = useState(false);
    const [displayDetails, setDisplayDetails] = useState(false);

    let emoji = props.docObject.data().emoji;
    let title = props.docObject.data().title;
    let place = props.docObject.data().place;
    let due = props.docObject.data().due;
    let reserved = props.docObject.data().reserved;
    let reservedTime = props.docObject.data().reservedTime;
    let reservedBy=props.docObject.data().reservedBy;
    let reservedByUid=props.docObject.data().reservedByUid;
    let reservedByEmail=props.docObject.data().reservedByEmail;

    return (
        <div
            key={props.key}
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            style={{
                transition: '0.2s',
                cursor: 'default',
                display: 'grid',
                gridTemplateColumns:'1fr',
                gap: '1em',
                borderLeft: `2px solid ${displayDetails ? 'var(--faintAccentColor)':'transparent'}`,
                padding: `${displayDetails ? '1em 0 1em 1em':'0.5em 0em'}`,
                marginBottom:`${displayDetails ? '1em':'0'}`
            }}
        >
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:'1fr 2fr 1fr 1fr'
                }}
            >
                <div>
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
                            {emoji}
                        </div>
                        <h4 style={{margin:0,padding:0,marginRight:'1em'}}>{title}</h4>
                    </AlignItems>
                </div>
                <div style={{padding:'0.5em',color:`${reserved ? 'black' : 'var(--accentColor)'}`}}>
                    <AlignItems>
                        {reserved ? 
                            <>
                                <FiSlash/>
                                <span>貸出済</span>
                            </>:
                            <>
                                <FiBookmark/>
                                <span>貸出可能</span>
                            </>
                        }
                    </AlignItems>
                </div>
                <div>
                    <AlignItems gap={'0.2em'}>
                        <div
                            style={{
                                borderRadius:'10px 0px 0px 10px',
                                backgroundColor:'var(--faintAccentColor)',
                                color:'var(--accentColor',
                                padding:'0.4em 1em'
                            }}
                        >
                            {place}
                        </div>
                        <div
                            style={{
                                borderRadius:'0px 10px 10px 0px',
                                backgroundColor:'var(--faintAccentColor)',
                                color:'var(--accentColor',
                                padding:'0.4em 1em'
                            }}
                        >
                            {due}時間
                        </div>
                    </AlignItems>
                </div>
                <AlignItems justifyContent={'right'}>
                    <Button
                        onClick={() => {displayDetails ? setDisplayDetails(false):setDisplayDetails(true)}}
                        icon={displayDetails ? <FiChevronUp/>:<FiChevronDown/>}
                    >
                        {displayDetails ? '閉じる':'詳細'}
                    </Button>
                </AlignItems>
            </div>
            {displayDetails &&
                <div
                    style={{
                        width: '100%',
                    }}
                >
                    {reserved ?
                        <AlignItems justifyContent={'space-between'}>
                            <AlignItems>
                                <span>今借りている人：{reservedBy}{reservedByEmail && <span style={{cursor: 'text'}}>（{reservedByEmail}）</span>}</span>
                            </AlignItems>
                            <AlignItems gap={'1em'}>
                                <span>借り始めた日時：{reservedTime}</span>
                                {/* {reservedByUid &&
                                    <Button
                                        icon={<FiUser/>}
                                        onClick={props.aboutReservedByOnClick}
                                    >
                                        今借りている人について
                                    </Button>
                                } */}
                            </AlignItems>
                        </AlignItems>:
                        <AlignItems justifyContent={'space-between'}>
                            <Button icon={<FiEdit/>} onClick={props.editButtonOnClick}>「{title}」を編集</Button>
                            <Button icon={<FiTrash2/>} onClick={props.removeButtonOnClick} accentColor={true}>「{title}」を消去</Button>
                        </AlignItems>
                    }
                </div>
            }
        </div>
    )
}
