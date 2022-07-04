import { arrayRemove, arrayUnion, doc, getFirestore, updateDoc } from 'firebase/firestore';
import React from 'react'
import { FiMapPin,FiClock,FiBookmark,FiSlash,FiArrowUp } from "react-icons/fi";
import { app } from '../firebase';
import Button from './buttons/Button';
import AlignItems from './style/AlignItems';


export default function CentralKashidashiObject(props) {
    const kashidashiObject ={
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
    }
    const emoji = {
        backgroundColor:'#F0F0F0',
        borderRadius:'30px',
        fontSize: '3em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        padding: '1em'
    }

    const db = getFirestore(app);
    const returnKashidashiObject = async() =>{
        await updateDoc(doc(db, "rooms", props.reservationRoomId), {
            reservationObjects: arrayRemove({
                emoji:props.emoji,
                title:props.title,
                place:props.place,
                due:props.due,
                reserved:props.reserved,
                reservedBy:props.reservedBy,
                reservedByEmail:props.reservedByEmail,
                reservedTime:props.reservedTime,
            })
        });
        await updateDoc(doc(db, "rooms", props.reservationRoomId), {
            reservationObjects: arrayUnion({
                emoji:props.emoji,
                title:props.title,
                place:props.place,
                due:props.due,
                reserved:false,
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
                            backgroundColor:'var(--faintAccentColor)',
                            color:'var(--accentColor)',
                            borderRadius:'50px',
                            padding: '0.3em 1em'
                        }}
                    >
                      {props.reservedBy}が借りています
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
                    ()=> {returnKashidashiObject()}
                    :props.reserveOnClick
                }
            >
                <AlignItems justifyContent={'center'}>
                    {props.reserved ? <FiArrowUp/>:<FiBookmark/>}
                    <span>{props.reserved ? '返却':'借りる'}</span>
                </AlignItems>
            </div>
        </div>
    )
}
