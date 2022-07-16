import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import React from 'react'
import { FiMapPin,FiClock,FiBookmark,FiSlash,FiArrowUp } from "react-icons/fi";
import { app } from '../firebase';
import Button from './buttons/Button';
import AlignItems from './style/AlignItems';


export default function CentralKashidashiObject(props) {


    let emoji = props.docObject.data().emoji;
    let title = props.docObject.data().title;
    let place = props.docObject.data().place;
    let due = props.docObject.data().due;
    let reserved = props.docObject.data().reserved;
    let reservedBy = props.docObject.data().reservedBy;
    let reservedTime = props.docObject.data().reservedTime;
    
    const kashidashiObject ={
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
    }
    const emojiContainer = {
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
        await updateDoc(doc(db, `rooms/${props.reservationRoomId}/reservationObjects/${props.docObject.id}/`), {
            reserved:false,
            reservedBy:'',
            reservedByEmail:'',
            reservedTime:'',
            reservedReason:'',
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
                <div style={emojiContainer}>{emoji}</div>
                <h2 style={{width:'fit-content',marginBottom:'0.5em',textAlign:'center'}}>{title}</h2>
                {reserved ? 
                    <span
                        style={{
                            backgroundColor:'var(--faintAccentColor)',
                            color:'var(--accentColor)',
                            borderRadius:'50px',
                            padding: '0.3em 1em'
                        }}
                    >
                      {reservedBy}が借りています
                    </span>:
                    <AlignItems justifyContent={'center'} gap={'1em'}>
                        <AlignItems><FiMapPin/><span>{place}</span></AlignItems>
                        <AlignItems><FiClock/><span>{due > 23 ? due/24+'日': due+'時間'}</span></AlignItems>
                    </AlignItems>
                }
            </div>
            <div
                style={{
                    borderRadius: '0px 0px 15px 15px',
                    padding: '1em',
                    backgroundColor: `${reserved ? '#f0f0f0':'var(--accentColor)'}`,
                    color: `${reserved ? 'black':'white'}`,
                    width: '100%',
                }}
                onClick={
                    reserved ? 
                    ()=> {returnKashidashiObject()}
                    :props.reserveOnClick
                }
            >
                <AlignItems justifyContent={'center'}>
                    {reserved ? <FiArrowUp/>:<FiBookmark/>}
                    <span>{reserved ? '返却':'借りる'}</span>
                </AlignItems>
            </div>
        </div>
    )
}
