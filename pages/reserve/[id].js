import { useRouter } from 'next/router';
import React,{useEffect,useState} from 'react'

import Header from '../../lib/Header'
import KashidashiObject from '../../lib/KashidashiObject'


import { FiEdit,FiHome } from "react-icons/fi";

import {app} from '../../firebase'
import { getFirestore, doc, setDoc,getDoc, onSnapshot, arrayUnion, arrayRemove, updateDoc  } from "firebase/firestore";
import { getAuth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { async } from '@firebase/util';
import Button from '../../lib/buttons/Button';
import LoginRequired from '../../lib/scene/LoginRequired';

import LoadingBar from 'react-top-loading-bar'

import moment from 'moment';
import 'moment/locale/ja'

export default function ReservationRoom() {
    const router = useRouter();
    const reservationRoomId = router.query.id;
    const [progress, setProgress] = useState(0)

    const auth = getAuth(app);
    const [user, loading, error] = useAuthState(auth);
    const db = getFirestore(app);

    const [roomData, setRoomData] = useState()

    const unsub = () =>{
        if (reservationRoomId) { 
            setProgress(20);
            onSnapshot(doc(db, "rooms", reservationRoomId), (doc) => {
                setProgress(50);
                if (doc.data().emailGroup.split('@')[1] === user.email.split('@')[1]) {
                    setRoomData(doc.data());
                    setProgress(100);
                }else{
                    setProgress(0);
                    router.push('/app');
                }
            });
        }
    }

    useEffect(() => {
        if (user) {
            unsub();
        }
    }, [reservationRoomId,user])

    
    const reserveKashidashiObject = async(emoji,title,place,due,reservation) =>{
        if (reservationRoomId && user) {
            let timeNow = moment().format('MMMM Do YYYY, h:mm a');
            await updateDoc(doc(db, "rooms", reservationRoomId), {
                reservationObjects: arrayRemove({
                    emoji:emoji,
                    title:title,
                    place:place,
                    due:due,
                    reserved:reservation
                })
            });
            await updateDoc(doc(db, "rooms", reservationRoomId), {
                reservationObjects: arrayUnion({
                    emoji:emoji,
                    title:title,
                    place:place,
                    due:due,
                    reserved:true,
                    reservedBy:user.displayName,
                    reservedByUid:user.uid,
                    reservedTime:timeNow,
                })
            });

            const docSnap = await getDoc(doc(db, "user", user.uid));
            if (docSnap.exists()) {
                await updateDoc(doc(db, "user", user.uid), {
                    reservedObjects: arrayUnion({
                        emoji:emoji,
                        title:title,
                        place:place,
                        due:due,
                        reservedTime:timeNow,
                        reservedRoomId:reservationRoomId
                    })
                });
            } else {
                await setDoc(doc(db, "user", user.uid), {
                    reservedObjects: arrayUnion({
                        emoji:emoji,
                        title:title,
                        place:place,
                        due:due,
                        reservedTime:timeNow,
                        reservedRoomId:reservationRoomId
                    })
                });
            }
        }
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
                            {roomData && roomData.reservationObjects.map(obj =>{
                                return <KashidashiObject
                                    key={obj.title}
                                    emoji={obj.emoji}
                                    title={obj.title}
                                    place={obj.place}
                                    due={obj.due}
                                    reserved={obj.reserved}
                                    reserveOnClick={()=>{
                                        alert(`${obj.title}を借りる`);
                                        reserveKashidashiObject(
                                            obj.emoji,
                                            obj.title,
                                            obj.place,
                                            obj.due,
                                            obj.reserved,
                                        );
                                    }}
                                    reservedBy={obj.reservedBy}
                                    reservedByUid = {obj.reservedByUid}
                                    reservedTime={obj.reservedTime}
                                    reservedByCurrentUser={obj.reservedByUid === user.uid ? true:false}
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
