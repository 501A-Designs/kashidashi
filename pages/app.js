import React, { useState,useEffect } from 'react'
import { useRouter } from 'next/router';

import Header from '../lib/Header'
import LargeButton from '../lib/buttons/LargeButton'
import Button from '../lib/buttons/Button';
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
import Link from 'next/link';
import { useCollection } from 'react-firebase-hooks/firestore';
import IconBanner from '../lib/scene/IconBanner';

import { useMediaQuery } from 'react-responsive'
import Head from 'next/head';


export default function App() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const auth = getAuth(app);
    const [user] = useAuthState(auth);

    const db = getFirestore(app);

    const userReservedCollectionRef = collection(db, `user/${user && user.uid}/reservedObjects/`);
    const [userData] = useCollection(userReservedCollectionRef);

    const roomsCollectionRef = collection(db, "rooms");
    const [roomsData] = useCollection(query(roomsCollectionRef, where("admin", "==", user && user.uid)))
    
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalType, setModalType] = useState('');

    const [roomInput, setRoomInput] = useState('');
    const [descriptionInput, setDescriptionInput] = useState('');
    const [roomTypeInput, setRoomTypeInput] = useState('');

    const [newlyGeneratedRoomId, setNewlyGeneratedRoomId] = useState('')


    const createRoom = async () => {
        let docRef = await addDoc(collection(db, "rooms"), {
            admin: user.uid,
            description: descriptionInput,
            emailGroup: '@'+user.email.split('@')[1],
            roomType: roomTypeInput,
            title: roomInput,
        });
        setNewlyGeneratedRoomId(docRef.id)
        setModalType('visitCreatedRoom')
    }

    const isSmallScreen = useMediaQuery({ query: '(max-width: 1000px)' });

    return (
        <>
            <LoadingBar
                color='var(--accentColor)'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
                waitingTime={500}
            />
            <Head>
                <title>Dashboard</title>
                <meta property="og:title" content="Kashidashi????????????????????????" key="title" />
            </Head>
            {user ? 
                <>
                    <Modal
                        isOpen={modalIsOpen}
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
                                <h2>????????????</h2>
                                <p>
                                    ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????{user.email.split('@')[1]}????????????????????????????????????????????????
                                </p>
                                <div
                                    style={{
                                        display: 'grid',
                                        gap: '0.5em',
                                        gridTemplateColumns:'1fr'
                                    }}
                                >
                                    <Input
                                        placeholder="???????????????????????????????????????????????????????????????????????????"
                                        value={roomInput}
                                        onChange={(e)=>setRoomInput(e.target.value)}
                                    />
                                    <Input
                                        placeholder="????????????????????????"
                                        value={descriptionInput}
                                        onChange={(e)=>setDescriptionInput(e.target.value)}
                                    />
                                    <h3>??????????????????</h3>
                                    <p style={{marginTop:'0'}}>
                                        ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????<Link href="https://pitch.com/public/044d2794-42e8-4e7a-a8ed-c3ddee03ebf1/e4d02efe-1192-4e1b-ab1a-dbd6290fb984"><a>?????????</a></Link>????????????????????????????????????
                                    </p>
                                    {roomTypeInput === 'dispenseMode' &&
                                        <>
                                            {user.email.split('@')[1] === 'gmail.com' ? 
                                                <IconBanner icon={<FiGlobe/>}>
                                                    ?????????????????????Gsuite??????????????????????????????????????????@gmail.com??????????????????????????????????????????????????????????????????
                                                </IconBanner>:
                                                <IconBanner icon={<FiUsers/>}>
                                                    {user.email.split('@')[1]}??????????????????????????????????????????????????????????????????
                                                </IconBanner>
                                            }
                                        </>
                                    }
                                    <div
                                        style={{
                                            display: 'grid',
                                            gap: '0.5em',
                                            gridTemplateColumns:'1fr 1fr'
                                        }}
                                    >
                                        <Button
                                            accentColor={roomTypeInput === 'dispenseMode' && true}
                                            onClick={() => setRoomTypeInput('dispenseMode')}
                                        >
                                            ???????????????????????????
                                        </Button>
                                        <Button
                                            accentColor={roomTypeInput === 'centralMode' && true}
                                            onClick={() => setRoomTypeInput('centralMode')}
                                        >
                                            ????????????????????????
                                        </Button>
                                    </div>

                                    {roomInput && descriptionInput && roomTypeInput && 
                                        <Button
                                            accentColor={true}
                                            onClick={() => createRoom()}
                                        >
                                            ????????????????????????
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
                                <h2>????????????????????????????????????</h2>
                                <p>????????????????????????????????????????????????????????????????????????????????????</p>
                                <Button
                                    accentColor={true}
                                    onClick={() => router.push(`/admin/${newlyGeneratedRoomId}/`)}
                                >
                                    ???????????????
                                </Button>
                            </AlignItems>
                        }
                        {modalType === 'join' &&
                            <>
                                <h2>??????????????????</h2>
                                <p>???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>
                                <section
                                    style={{
                                        paddingRight: '0.5em',
                                        maxHeight: '300px',
                                        overflowX: 'auto'
                                    }}
                                >
                                    {userData && userData.docs.length > 0 ? 
                                        userData.docs.map(obj => {
                                            return(
                                                <Borrowing
                                                    key={obj.id}
                                                    emoji={obj.data().emoji}
                                                    title={obj.data().title}
                                                    place={obj.data().place}
                                                    due={obj.data().due}
                                                    dateReserved={obj.data().reservedTime}
                                                    onClick={() => router.push(`/reserve/${obj.data().reservedRoomId}`)}
                                                />
                                            )
                                        }):<Nothing icon={<FiFile/>}>
                                            <p>
                                                ??????????????????????????????????????????????????????????????????????????????
                                                <br/>
                                                ?????????????????????????????????????????????????????????
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
                                    width: `${isSmallScreen ? '10%':'30%'}`,
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
                                            ???????????????
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
                                                        userData.docs.length > 0 && 
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
                                                                {userData.docs.length}
                                                            </AlignItems>
                                                        </div>
                                                    }
                                                </>
                                            }
                                        >
                                            ??????????????????
                                        </LargeButton>
                                        <LargeButton
                                            icon={<FiInfo/>}
                                            onClick={() => router.push('/about')}
                                        >
                                            ?????????
                                        </LargeButton>
                                    </AlignItems>
                                </div>
                                <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'0.5em', paddingBottom: '2.5em'}}>
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
                                        {!isSmallScreen && 
                                            <div>
                                                <h3 style={{margin:0}}>{user && user.displayName.split(' ')[0]}</h3>
                                                <p style={{margin:0,fontSize:'0.7em'}}>{user && user.email}</p>
                                            </div>
                                        }
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
                                    {roomsData && roomsData.docs.length > 0 ?
                                        <>{roomsData.docs.map((doc) => {
                                            return (
                                                <KashidashiRoom
                                                    key={doc.id}
                                                    title={doc.data().title}
                                                    description={doc.data().description}
                                                    id={doc.id}
                                                    roomType={doc.data().roomType}
                                                    emailGroup={doc.data().emailGroup}
                                                />
                                            )
                                        })}</>:
                                        <Nothing icon={<FiLayers/>}>
                                            <p>
                                                ???????????????????????????????????????????????????<br/>
                                                ??????????????????????????????????????????????????????????????????????????????????????????????????????
                                            </p>
                                        </Nothing>
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
