import { arrayRemove, arrayUnion, deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import React from 'react'
import { FiMapPin,FiClock,FiBookmark,FiSlash,FiArrowUp } from "react-icons/fi";
import { app } from '../firebase';
import AlignItems from './style/AlignItems';

export default function DispenseKashidashiObject(props) {
    const docData = props.doc.data();
    const emoji = docData.emoji;
    const title = docData.title;
    const place = docData.place;
    const due = docData.due;
    const reserved = docData.reserved;


    const kashidashiObject ={
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: `${!props.reservedByCurrentUser && reserved ? 'not-allowed':'pointer'}`,
    }
    const emojiContainer = {
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
    const returnKashidashiObject = async() =>{
        console.log(props.doc.id);
        console.log(props.currentUserObject.uid);
        await updateDoc(doc(db, `rooms/${props.reservationRoomId}/reservationObjects/${props.doc.id}`), {
            emoji:emoji,
            title:title,
            place:place,
            due:due,
            reservedBy:'',
            reservedByUid:'',
            reservedByEmail:'',
            reservedByPhoto:'',
            reservedTime:'',

            reservedSingleDate: null,
            reservedSlotStart: null,
            reservedSlotEnd: null,
            reservedReason: '',

            reserved:false,
        });
        await deleteDoc(doc(db, `user/${props.currentUserObject.uid}/reservedObjects/${props.doc.id}`));
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
                            backgroundColor:`${props.reservedByCurrentUser ? 'var(--faintAccentColor)':'#f0f0f0'}`,
                            color:`${props.reservedByCurrentUser ? 'var(--accentColor)':'black'}`,
                            borderRadius:'50px',
                            padding: '0.3em 1em'
                        }}
                    >
                        {props.reservedBy.split(' ')[0] === props.currentUserObject.displayName.split(' ')[0] ?
                            '自分':props.reservedBy.split(' ')[0]
                        }が予約しています
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
                        ()=> {props.reservedByCurrentUser ? 
                            returnKashidashiObject():
                            alert('既に貸出されています')
                        }
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
                            {reserved ? <FiSlash/>:<FiBookmark/>}
                            <span>{reserved ? '貸出済':'借りる'}</span>
                        </>
                    }
                </AlignItems>
            </div>
        </div>
    )
}
