import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
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
    let reservedByCurrentUser = false;


    const kashidashiObject ={
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: `${!reservedByCurrentUser ? 'not-allowed':'pointer'}`,
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
        await deleteDoc(doc(db, `rooms/${props.reservationRoomId}/reservationObjects/${props.doc.id}/reservedUser/${props.currentUserObject.uid}`));
        await deleteDoc(doc(db, `user/${props.currentUserObject.uid}/reservedObjects/${props.doc.id}`));
    }

    const reservedUserCollectionRef = collection(db, `rooms/${props.reservationRoomId}/reservationObjects/${props.doc.id}/reservedUser/`);
    const [reservedUserId] = useCollection(reservedUserCollectionRef);
    reservedUserId && reservedUserId.docs.map(doc =>{
        if (props.currentUserObject.uid == doc.id) {
            console.log('bruh this is it!');
            reservedByCurrentUser = true;
        }
    })

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
                {reservedUserId && reservedUserId.docs.length > 0 ? 
                    <span
                        style={{
                            backgroundColor:`${reservedByCurrentUser ? 'var(--faintAccentColor)':'#f0f0f0'}`,
                            color:`${reservedByCurrentUser ? 'var(--accentColor)':'black'}`,
                            borderRadius:'50px',
                            padding: '0.3em 1em'
                        }}
                    >
                        {reservedByCurrentUser ? '自分が予約しています':'他の人が予約しています'}
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
                    backgroundColor: `${reservedByCurrentUser ? '#f0f0f0':'var(--accentColor)'}`,
                    color: `${reservedByCurrentUser ? 'black':'white'}`,
                    width: '100%',
                }}
                onClick={reservedByCurrentUser ? ()=>returnKashidashiObject():props.reserveOnClick}
            >
                <AlignItems justifyContent={'center'}>
                    {reservedByCurrentUser ? 
                        <>
                            <FiArrowUp/>
                            <span>返却</span>                
                        </>:
                        <>
                            <FiBookmark/>
                            <span>予約</span>
                        </>
                    }
                </AlignItems>
            </div>
        </div>
    )
}
