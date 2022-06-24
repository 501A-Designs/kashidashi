import React, { useState,useEffect } from 'react'
import { useRouter } from 'next/router';

import Header from '../lib/Header'
import LargeButton from '../lib/buttons/LargeButton'
import Button from '../lib/buttons/Button';
import KashidashiObject from '../lib/KashidashiObject';
import KashidashiRoom from '../lib/KashidashiRoom';
import { modalStyle } from '../lib/style/modalStyle';

import { FiLogOut,FiPlusSquare,FiInfo,FiXCircle,FiZap,FiUsers,FiGlobe,FiInbox,FiLayers, FiFile } from "react-icons/fi";
import Modal from 'react-modal';

import AlignItems from '../lib/style/AlignItems';
import Input from '../lib/Input';

import {app} from '../firebase'
import { getFirestore, collection, query, where, getDocs, addDoc, getDoc, doc } from "firebase/firestore";
import { getAuth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import LoginRequired from '../lib/scene/LoginRequired';
import LoadingBar from 'react-top-loading-bar';
import Borrowing from '../lib/Borrowing';
import Nothing from '../lib/scene/Nothing'

export default function App() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);

    const auth = getAuth(app);
    const [user, loading, error] = useAuthState(auth);

    const db = getFirestore(app);

    let roomsData = []
    const [roomsArray, setRoomsArray] = useState();
    const [userData, setUserData] = useState()

    const fetchCollection = async () => {
        if (user) {
            const collectionRef = collection(db, "rooms");
            const querySnapshot = await getDocs(query(collectionRef, where("admin", "==", user.uid)))
            if (roomsData.length === 0) {                
                querySnapshot.forEach((doc) => {
                    roomsData.push(
                        {
                            data:doc.data(),
                            id:doc.id
                        }
                    );
                });
            }
            setProgress(100);
            setRoomsArray(roomsData);
            console.log(roomsData)
        }
    }

    const fetchUserData = async () => {
        if (user) {
            const docRef = doc(db, "user", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setUserData(docSnap.data());
            } else {
                console.log("No such document!");
            }
        }
    }

    useEffect(() => {
        setProgress(30);
        fetchCollection();
        fetchUserData();
    }, [user])
    
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalType, setModalType] = useState('');

    const [roomInput, setRoomInput] = useState('');
    const [descriptionInput, setDescriptionInput] = useState('');

    const [newlyGeneratedRoomId, setNewlyGeneratedRoomId] = useState('')

    const createRoom = async () => {
        const docRef = await addDoc(collection(db, "rooms"), {
            admin: user.uid,
            description: descriptionInput,
            emailGroup: '@'+user.email.split('@')[1],
            reservationObjects:[],
            title: roomInput,
        });
        setNewlyGeneratedRoomId(docRef.id)
        setModalType('visitCreatedRoom')
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
                    <Modal
                        isOpen={modalIsOpen}
                        // onAfterOpen={afterOpenModal}
                        // onRequestClose={closeModal}
                        style={modalStyle}
                    >
                        {modalType !== 'visitCreatedRoom' && 
                            <Button
                                onClick={()=>setModalIsOpen(false)}
                                icon={<FiXCircle/>}
                                float={'right'}
                            />
                        }
                        {modalType === 'create' &&
                            <>
                                <h2>新規作成</h2>
                                <p>
                                    Kashidashiで貸し出しを行う場所は全て「部屋」と呼ばれています。新しい部屋を作成すると、貸し出しする物の追加・消去できる権限が与えられます。なお、作成する部屋は{user.email.split('@')[1]}に所属する人のみが閲覧できます。
                                </p>
                                <div
                                    style={{
                                        display: 'grid',
                                        gap: '0.5em',
                                        gridTemplateColumns:'1fr'
                                    }}
                                >
                                    <Input
                                        placeholder="部屋の名前　※他の部屋とかぶる事なくユニークなもの"
                                        value={roomInput}
                                        onChange={(e)=>setRoomInput(e.target.value)}
                                    />
                                    <Input
                                        placeholder="ちょっとした概要"
                                        value={descriptionInput}
                                        onChange={(e)=>setDescriptionInput(e.target.value)}
                                    />
                                    {roomInput && descriptionInput &&
                                        <Button
                                            accentColor={true}
                                            onClick={() => createRoom()}
                                        >
                                            部屋を新しく作成
                                        </Button>
                                    }
                                </div>
                            </>
                        }
                        {modalType === 'visitCreatedRoom' &&
                            <AlignItems
                                justifyContent={'center'}
                                flexDirection={'column'}
                            >
                                <h2>部屋作成完了</h2>
                                <p>新しく作成された部屋を見る</p>
                                <Button
                                    accentColor={true}
                                    onClick={() => router.push(`/admin/${newlyGeneratedRoomId}/`)}
                                >
                                    編集画面へ
                                </Button>
                            </AlignItems>
                        }
                        {modalType === 'join' &&
                            <>
                                <h2>今借りてる物</h2>
                                <p>今借りてる物が一覧として見れます。借りた物の部屋に入る事で返却することができます。</p>
                                <section
                                    style={{
                                        paddingRight: '0.5em',
                                        maxHeight: '300px',
                                        overflowX: 'auto'
                                    }}
                                >
                                    {userData ?
                                        <>                                        
                                            {userData.reservedObjects.length > 0 ? 
                                                userData.reservedObjects.map(obj => {
                                                    return(
                                                        <Borrowing
                                                            emoji={obj.emoji}
                                                            title={obj.title}
                                                            place={obj.place}
                                                            due={obj.due}
                                                            dateReserved={obj.reservedTime}
                                                            onClick={() => router.push(`/reserve/${obj.reservedRoomId}`)}
                                                        />
                                                    )
                                                }):<Nothing icon={<FiFile/>}>
                                                    <p>
                                                        借りているものは全てここにリストとして表示されます。
                                                        <br/>
                                                        なお、現在借りているものはありません。
                                                    </p>
                                                </Nothing>
                                            }
                                        </>:
                                        <Nothing icon={<FiFile/>}>
                                            <p>
                                                借りているものは全てここにリストとして表示されます。
                                                <br/>
                                                なお、現在借りているものはありません。
                                            </p>
                                        </Nothing>
                                    }
                                </section>
                            </>
                        }
                    </Modal>
                    <main>
                        <section style={{display: 'flex', gap: '1.5em'}}>
                            <section
                                style={{
                                    position:'sticky',
                                    top: '0px',
                                    width: '30%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: '100vh'
                                }}
                            >
                                <div style={{paddingTop: '2.5em'}}>
                                    <AlignItems
                                        flexDirection={'column'}
                                        alignItems={'left'}
                                    >
                                        <LargeButton
                                            icon={<FiPlusSquare/>}
                                            onClick={() => {
                                                setModalType('create');
                                                setModalIsOpen(true);
                                            }}
                                        >
                                            新しい部屋を作成
                                        </LargeButton>
                                        <LargeButton
                                            icon={<FiInbox/>}
                                            onClick={() => {
                                                setModalType('join');
                                                setModalIsOpen(true);
                                            }}
                                            additionalComponent={
                                                userData && 
                                                <>
                                                    {
                                                        userData.reservedObjects.length > 0 && 
                                                        <div
                                                            style={{
                                                                backgroundColor: 'var(--accentColor)',
                                                                fontSize:'0.8em',
                                                                padding: '0.2em 0.5em',
                                                                minWidth:'30px',
                                                                color:'white',
                                                                borderRadius: '15px',
                                                            }}
                                                        >
                                                            <AlignItems justifyContent={'center'}>
                                                                {userData.reservedObjects.length}
                                                            </AlignItems>
                                                        </div>
                                                    }
                                                </>
                                            }
                                        >
                                            今借りてる物
                                        </LargeButton>
                                        <LargeButton
                                            icon={<FiInfo/>}
                                            onClick={() => router.push('/about')}
                                        >
                                            ヘルプ
                                        </LargeButton>
                                    </AlignItems>
                                </div>
                                <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'0.5em', paddingBottom: '2.5em'}}>
                                    <Button
                                        icon={<FiPlusSquare/>}
                                        onClick={() => {
                                            setModalType('create');
                                            setModalIsOpen(true);
                                        }}
                                    >
                                        新しい部屋を作成
                                    </Button>
                                    <div
                                        style={{
                                            color:'var(--accentColor)',
                                            backgroundColor:'var(--faintAccentColor)',
                                            padding: '1em',
                                            marginBottom: '1em',
                                            borderRadius:'10px',
                                            display: 'grid',
                                            gridTemplateColumns:'1fr 9fr',
                                            gap: '0.5em',
                                        }}
                                    >
                                        {user.email.split('@')[1] === 'gmail.com' ? 
                                            <>
                                                <AlignItems justifyContent={'center'}>
                                                    <FiGlobe/>
                                                </AlignItems>
                                                <span style={{fontSize:'0.8em'}}>
                                                    本アカウントはGsuiteでの管理下でないため、通常の@gmail.comのメールアドレスを持つ人が全て閲覧できます。
                                                </span>
                                            </>:
                                            <>
                                                <AlignItems justifyContent={'center'}>
                                                    <FiUsers/>
                                                </AlignItems>
                                                <span style={{fontSize:'0.8em'}}>
                                                    {user.email.split('@')[1]}のグループに所属している人のみ閲覧できます。
                                                </span>
                                            </>
                                        }
                                    </div>
                                    <AlignItems gap={'1em'}>
                                        <img
                                            src={user && user.photoURL}
                                            width="40px"
                                            height="40px"
                                            style={{
                                                borderRadius:'50px',
                                                border:'2px solid var(--accentColor)'
                                            }}
                                        />
                                        <div>
                                            <h3 style={{margin:0}}>{user && user.displayName.split(' ')[0]}</h3>
                                            <p style={{margin:0,fontSize:'0.7em'}}>{user && user.email}</p>
                                        </div>
                                    </AlignItems>
                                </div>
                            </section>
                            <section style={{width: '100%',paddingTop:'2%',paddingBottom:'2%'}}>
                                <h1>Dashboard</h1>
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns:'1fr',
                                        gap: '0.5em',
                                        height: 'fit-content',
                                    }}
                                >
                                {roomsArray &&
                                    <>                                
                                        {roomsArray.length > 0 ?
                                            <>{roomsArray.map((doc) => {
                                                return (
                                                    <KashidashiRoom
                                                        key={doc.id}
                                                        title={doc.data.title}
                                                        description={doc.data.description}
                                                        id={doc.id}
                                                        emailGroup={doc.data.emailGroup}
                                                        reservationObjects={doc.data.reservationObjects}
                                                    />
                                                )
                                            })}</>:
                                            <Nothing icon={<FiLayers/>}>
                                                <p>
                                                    作成されている貸出部屋はありません<br/>
                                                    新しく作成するには左上にある「新しい部屋を作成」のボタンを押してください。
                                                </p>
                                            </Nothing>
                                        }
                                    </>
                                }
                                </div>
                            </section>
                        </section>
                    </main>
                </>:<LoginRequired/>
            }
        </>
    )
}
