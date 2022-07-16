import React,{useState} from 'react'
import AlignItems from './style/AlignItems'
import { FiSlash,FiBookmark,FiTrash2,FiEdit, FiUser,FiChevronUp,FiChevronDown } from "react-icons/fi";
import Button from './buttons/Button';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, getFirestore } from 'firebase/firestore';
import { app } from '../firebase';

export default function KashidashiObjectRow(props) {
    const [hover, setHover] = useState(false);
    // const [focus, setFocus] = useState(false);
    const [displayDetails, setDisplayDetails] = useState(false);

    let emoji = props.docObject.data().emoji;
    let title = props.docObject.data().title;
    let place = props.docObject.data().place;
    let due = props.docObject.data().due;

    const db = getFirestore(app);
    const [reservedUserId] = useCollection(collection(db, `rooms/${props.reservationRoomId}/reservationObjects/${props.docObject.id}/reservedUser/`));

    // let reserved = props.docObject.data().reserved;
    let reservedTime = props.docObject.data().reservedTime;
    let reservedBy=props.docObject.data().reservedBy;
    let reservedByUid=props.docObject.data().reservedByUid;
    let reservedByEmail=props.docObject.data().reservedByEmail;
    let reservedByPhoto=props.docObject.data().reservedByPhoto;

    return (
        <div
            key={props.key}
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}
            // onFocus={()=>setFocus(true)}
            style={{
                transition: '0.2s',
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns:'1fr',
                gap: '1em',
                boxShadow:`${props.boxShadow}`,
                borderRadius: '15px',
                padding: '0.5em 0.7em',
                marginBottom:`${displayDetails ? '1em':'0'}`
            }}
            onClick={props.onClick}
        >
            <AlignItems justifyContent={'space-between'}>
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
                        <h4 style={{margin:0,padding:0}}>{title}</h4>
                        {reservedUserId && reservedUserId.docs.length > 0 && 
                            <div style={{width:'10px',height:'10px',backgroundColor:'var(--accentColor)',borderRadius:'15px'}}/>
                        }
                    </AlignItems>
                </div>
                <div>
                    <AlignItems gap={'0.2em'}>
                        <div
                            style={{
                                fontSize: '0.8em',
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
                                fontSize: '0.8em',
                                borderRadius:'0px 10px 10px 0px',
                                backgroundColor:'var(--faintAccentColor)',
                                color:'var(--accentColor',
                                padding:'0.4em 1em',
                            }}
                        >
                            {due}時間
                        </div>
                    </AlignItems>
                </div>
            </AlignItems>
        </div>
    )
}
