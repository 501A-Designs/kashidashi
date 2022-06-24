import { arrayRemove, arrayUnion, doc, getFirestore, updateDoc } from 'firebase/firestore';
import React from 'react'
import { FiMapPin,FiClock,FiBookmark,FiSlash,FiArrowUp } from "react-icons/fi";
import { app } from '../firebase';
import Button from './buttons/Button';
import AlignItems from './style/AlignItems';


export default function KashidashiObject(props) {
    const kashidashiObject ={
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: `${!props.reservedByCurrentUser && props.reserved ? 'not-allowed':'pointer'}`,
    }
    const emoji = {
        backgroundColor:'#F0F0F0',
        borderRadius:'50px',
        fontSize: '2.5em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        padding: '1em'
    }

    const db = getFirestore(app);
    const returnKashidashiObject = async(emoji,title,place,due,reservation,timeNow) =>{
        await updateDoc(doc(db, "rooms", props.reservationRoomId), {
            reservationObjects: arrayRemove({
                emoji:emoji,
                title:title,
                place:place,
                due:due,
                reserved:reservation,
                reservedBy:props.reservedBy,
                reservedByUid:props.reservedByUid,
                reservedTime:timeNow,
            })
        });
        await updateDoc(doc(db, "rooms", props.reservationRoomId), {
            reservationObjects: arrayUnion({
                emoji:emoji,
                title:title,
                place:place,
                due:due,
                reserved:false,
            })
        });
        await updateDoc(doc(db, "user", props.currentUserObject.uid), {
            reservedObjects: arrayRemove({
                emoji:emoji,
                title:title,
                place:place,
                due:due,
                reservedTime:timeNow,
                reservedRoomId:props.reservationRoomId
            })
        });
    }

    return (
        <div style={kashidashiObject} key={props.key}>
            <div
                style={{
                    borderRadius: '15px 15px 0px 0px',
                    borderRight:'2px solid #F0F0F0',
                    borderTop:'2px solid #F0F0F0',
                    borderLeft:'2px solid #F0F0F0',
                    padding: '1em',
                    width: '100%',
                    minHeight: '200px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div style={emoji}>{props.emoji}</div>
                <h2 style={{width:'fit-content',marginBottom:'0.5em',textAlign:'center'}}>{props.title}</h2>
                {props.reserved ? 
                    <span
                        style={{
                            backgroundColor:`${props.reservedByCurrentUser ? 'var(--faintAccentColor)':'#f0f0f0'}`,
                            color:`${props.reservedByCurrentUser ? 'var(--accentColor)':'black'}`,
                            borderRadius:'50px',
                            padding: '0.3em 1em'
                        }}
                    >
                        {props.reservedBy.split(' ')[0] === props.currentUserObject.displayName.split(' ')[0] ?
                            '自分':props.reservedBy.split(' ')[0]
                        }
                        が借りています
                    </span>:
                    <AlignItems justifyContent={'center'} gap={'1em'}>
                        <AlignItems><FiMapPin/><span>{props.place}</span></AlignItems>
                        <AlignItems><FiClock/><span>{props.due > 23 ? props.due/24+'日': props.due+'時間'}</span></AlignItems>
                    </AlignItems>
                }
            </div>
            <div
                style={{
                    borderRadius: '0px 0px 15px 15px',
                    padding: '1em',
                    backgroundColor: `${props.reserved ? '#f0f0f0':'var(--accentColor)'}`,
                    color: `${props.reserved ? 'black':'white'}`,
                    width: '100%',
                }}
                onClick={
                    props.reserved ? 
                    ()=> {props.reservedByCurrentUser ? returnKashidashiObject(props.emoji,props.title,props.place,props.due,props.reserved,props.reservedTime):alert('既に貸出されています')}
                    :props.reserveOnClick
                }
            >
                <AlignItems justifyContent={'center'}>
                    {props.reservedByCurrentUser ? 
                        <>
                            <FiArrowUp/>
                            <span>返却</span>                            
                        </>:                    
                        <>
                            {props.reserved ? <FiSlash/>:<FiBookmark/>}
                            <span>{props.reserved ? '貸出済':'借りる'}</span>
                        </>
                    }
                </AlignItems>
            </div>
        </div>
    )
}
