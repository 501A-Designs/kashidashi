import { useRouter } from 'next/router';
import React,{useEffect,useState} from 'react'

import Header from '../../lib/Header'
import DispenseKashidashiObject from '../../lib/DispenseKashidashiObject'


import { FiEdit,FiHome } from "react-icons/fi";

import {app} from '../../firebase'
import { getFirestore, doc, setDoc,getDoc, onSnapshot, arrayUnion, arrayRemove, updateDoc, collection  } from "firebase/firestore";
import { getAuth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { async } from '@firebase/util';
import Button from '../../lib/buttons/Button';
import LoginRequired from '../../lib/scene/LoginRequired';

import LoadingBar from 'react-top-loading-bar'

import moment from 'moment';
import 'moment/locale/ja'
import { useCollection } from 'react-firebase-hooks/firestore';

export default function ReservationRoom() {
    const router = useRouter();
    const reservationRoomId = router.query.id;
    const [progress, setProgress] = useState(0)

    const auth = getAuth(app);
    const [user] = useAuthState(auth);
    const db = getFirestore(app);

    const [roomData, setRoomData] = useState()

    const unsub = () =>{
        if (reservationRoomId) { 
            setProgress(20);
            onSnapshot(doc(db, `rooms/${reservationRoomId}/`), (doc) => {
                setProgress(50);
                // if (doc.data().emailGroup.split('@')[1] === user.email.split('@')[1]) {
                    setRoomData(doc.data());
                    setProgress(100);
                // }else{
                //     setProgress(0);
                //     router.push('/app');
                // }
            });
        }
    }

    useEffect(() => {
        if (user) {
            unsub();
        }
    }, [reservationRoomId,user])

    const reviewsCollectionRef = collection(db, `rooms/${reservationRoomId && reservationRoomId}/reservationObjects/`);
    const [reservationObjects] = useCollection(reviewsCollectionRef);
    
    const reserveKashidashiObject = async(docObject) =>{
        let timeNow = moment().format('MMMM Do YYYY, h:mm a');
        await updateDoc(doc(db, `rooms/${reservationRoomId && reservationRoomId}/reservationObjects/${docObject.id}/`), {
            reserved:true,
            reservedBy:user && user.displayName,
            reservedByUid:user && user.uid,
            reservedTime:timeNow,
        });
        // const docSnap = await getDoc(doc(db, "user", user.uid));
        await setDoc(doc(db, `user/${user && user.uid}/reservedObjects/${docObject.id}/`), {
            emoji:docObject.data().emoji,
            title:docObject.data().title,
            place:docObject.data().place,
            due:docObject.data().due,
            reservedTime:timeNow,
            reservedRoomId:reservationRoomId
        });
    }

    return (
        <>
            <LoadingBar
                color='var(--accentColor)'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
                waitingTime={500}
            />
            {user ? 
                <>                
                    {roomData && 
                        <Header
                            title={roomData.title}
                            subTitle={`${roomData.description}`}
                        >
                            {user &&                            
                                <Button
                                    icon={<FiHome/>}
                                    onClick={() => {router.push('/app')}}
                                >
                                    Dashboardに戻る
                                </Button>
                            }
                            {roomData.admin === user.uid && 
                                <>
                                    <Button
                                        icon={<FiEdit/>}
                                        onClick={()=>router.push(`/admin/${reservationRoomId}`)}
                                        accentColor={true}
                                    >
                                        アドミンとして編集
                                    </Button>
                                </>
                            }
                        </Header>
                    }
                    <main style={{paddingTop:'2%'}}>
                        <section style={{display: 'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap: '1.5em'}}>
                            {reservationObjects && reservationObjects.docs.map(doc =>{
                                return <DispenseKashidashiObject
                                    key={doc.id}
                                    // emoji={doc.data().emoji}
                                    // title={doc.data().title}
                                    // place={doc.data().place}
                                    // due={doc.data().due}
                                    // reserved={doc.data().reserved}
                                    doc={doc}
                                    reserveOnClick={()=>{
                                        alert(`${doc.data().title}を借りる`);
                                        reserveKashidashiObject(doc);
                                    }}
                                    reservedBy={doc.data().reservedBy}
                                    reservedByUid = {doc.data().reservedByUid}
                                    reservedTime={doc.data().reservedTime}
                                    reservedByCurrentUser={doc.data().reservedByUid === user.uid ? true:false}
                                    reservationRoomId={reservationRoomId}
                                    currentUserObject={user}
                                />
                            })}
                        </section>
                    </main>
                </>:<LoginRequired/>
            }
        </>
    )
}
