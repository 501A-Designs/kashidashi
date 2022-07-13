import { useRouter } from 'next/router';
import React,{useState} from 'react'

import Header from '../../lib/Header'
import DispenseKashidashiObject from '../../lib/DispenseKashidashiObject'


import { FiEdit,FiHome, FiShield } from "react-icons/fi";

import {app} from '../../firebase'
import { getFirestore, doc, setDoc, updateDoc, collection  } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import Button from '../../lib/buttons/Button';
import LoginRequired from '../../lib/scene/LoginRequired';

import LoadingBar from 'react-top-loading-bar'

import moment from 'moment';
import 'moment/locale/ja'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import Nothing from '../../lib/scene/Nothing';

import { useMediaQuery } from 'react-responsive'
import Head from 'next/head';


export default function ReservationRoom() {
    const router = useRouter();
    const reservationRoomId = router.query.id;
    const [progress, setProgress] = useState(0)

    const auth = getAuth(app);
    const [user] = useAuthState(auth);
    const db = getFirestore(app);

    const roomDataDocumentRef = doc(db, `rooms/${reservationRoomId && reservationRoomId}/`)
    const [roomData] =  useDocument(roomDataDocumentRef);

    const reviewsCollectionRef = collection(db, `rooms/${reservationRoomId && reservationRoomId}/reservationObjects/`);
    const [reservationObjects] = useCollection(reviewsCollectionRef);
    
    const reserveKashidashiObject = async(docObject) =>{
        let timeNow = moment().format('MMMM Do YYYY, h:mm a');
        await updateDoc(doc(db, `rooms/${reservationRoomId && reservationRoomId}/reservationObjects/${docObject.id}/`), {
            reserved:true,
            reservedBy:user && user.displayName,
            reservedByUid:user && user.uid,
            reservedByEmail:user && user.email,
            reservedByPhoto: user && user.photoURL,
            reservedTime:timeNow,
        });
        await setDoc(doc(db, `user/${user && user.uid}/reservedObjects/${docObject.id}/`), {
            emoji:docObject.data().emoji,
            title:docObject.data().title,
            place:docObject.data().place,
            due:docObject.data().due,
            reservedTime:timeNow,
            reservedRoomId:reservationRoomId
        });
    }

    const isSmallScreen = useMediaQuery({ query: '(max-width: 1200px)' });
    const isVerySmallScreen = useMediaQuery({ query: '(max-width: 800px)' });

    return (
        <>
            <LoadingBar
                color='var(--accentColor)'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
                waitingTime={500}
            />
            <Head>
                <title>貸し出し中</title>
                <meta property="og:title" content="ディスペンスモードの貸し出し画面" key="title" />
            </Head>
            {user ? 
                <>
                    {roomData && reservationObjects && roomData.data().emailGroup.split('@')[1] === user.email.split('@')[1] ? 
                        <>
                            <Header
                                title={roomData.data().title}
                                subTitle={`${roomData.data().description}`}
                            >
                                {user &&                            
                                    <Button
                                        icon={<FiHome/>}
                                        onClick={() => {router.push('/app')}}
                                    >
                                        Dashboardに戻る
                                    </Button>
                                }
                                {roomData.data().admin === user.uid && 
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
                            <main style={{paddingTop:'2%'}}>
                                <section style={{display: 'grid', gridTemplateColumns:`${isSmallScreen ? `${isVerySmallScreen ? '1fr':'1fr 1fr'}`:'1fr 1fr 1fr 1fr'}`, gap: '1.5em'}}>
                                    {reservationObjects.docs.map(doc =>{
                                        return <DispenseKashidashiObject
                                            key={doc.id}
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
                        </>:<Nothing icon={<FiShield/>}>
                            <p>この部屋を作成したアドミンと同じGsuiteグループに所属していないため、アクセスできません。</p>
                        </Nothing>
                    }
                </>:<LoginRequired/>
            }
        </>
    )
}
