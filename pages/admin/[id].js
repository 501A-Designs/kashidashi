import { useRouter } from 'next/router';
import React,{useState,useEffect,useRef} from 'react'
import Button from '../../lib/buttons/Button';
import Header from '../../lib/Header';

import { FiFile,FiLock,FiFilePlus,FiXCircle,FiCheck,FiEdit,FiHome,FiPlay,FiSettings,FiTrash2, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import DataGrid from 'react-data-grid';

import {app} from '../../firebase'
import { getFirestore, doc, getDoc, onSnapshot,updateDoc, collection, arrayRemove, deleteDoc, addDoc, getDocs } from "firebase/firestore";
import { getAuth, signOut } from 'firebase/auth';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { async } from '@firebase/util';

import Modal from 'react-modal';
import { modalStyle } from '../../lib/style/modalStyle';
import AlignItems from '../../lib/style/AlignItems';
import Input from '../../lib/Input';
import KashidashiObjectRow from '../../lib/KashidashiObjectRow';
import LoginRequired from '../../lib/scene/LoginRequired';

import LoadingBar from 'react-top-loading-bar'
import Nothing from '../../lib/scene/Nothing';
import Borrowing from '../../lib/Borrowing';
import IconBanner from '../../lib/scene/IconBanner';

export default function AdminPannel() {
    const router = useRouter();
    const reservationRoomId = router.query.id;
    const [progress, setProgress] = useState(0);

    const auth = getAuth(app);
    const [user] = useAuthState(auth);
    const db = getFirestore(app);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalType, setModalType] = useState('');

    const [aboutReservedBy,setAboutReservedBy] = useState('');

    const [roomTitleInput, setRoomTitleInput] = useState('');
    const [roomDescriptionInput, setRoomDescriptionInput] = useState('');
    const [roomAdminInput, setRoomAdminInput] = useState('');

    const updateRoomInfo = async() =>{
        if (user) {
            const docRef = doc(db, `rooms/${reservationRoomId}`);
            await updateDoc(docRef, {
                title: roomTitleInput,
                description: roomDescriptionInput,
                admin: roomAdminInput === '' ? user.uid:roomAdminInput,
            });
        }
        closeModal();
    }

    const deleteThisRoom = async () =>{
        await deleteDoc(doc(db, `rooms/${reservationRoomId}/`));
        router.push(`/app/`);
    }

    const roomDataDocumentRef = doc(db, `rooms/${reservationRoomId && reservationRoomId}/`)
    const [roomData] =  useDocument(roomDataDocumentRef);

    const reservationObjectsCollectionRef = collection(db, `rooms/${reservationRoomId && reservationRoomId}/reservationObjects/`);
    const [reservationObjects] = useCollection(reservationObjectsCollectionRef);
    const [reservedStatus, setReservedStatus] = useState(0);

    useEffect(() => {
        reservationObjects && reservationObjects.docs.map(doc =>{
            doc.data().reserved && setReservedStatus(true);
        })
    },[reservationObjects])

    const [previousValue, setPreviousValue] = useState();
    const [emojiSelected, setEmojiSelected] = useState('');
    const [titleInput, setTitleInput] = useState('');
    const [placeInput, setPlaceInput] = useState('');
    const [dueInput, setDueInput] = useState(1);
    const [dueInputType, setDueInputType] = useState('hours')
    const [emojiType, setEmojiType] = useState('electronics');

    let emojiData;
    if (emojiType === 'electronics') {
        emojiData = ['💻','🖨️','📽','🎞','🖥','📷','🎥','🔋','🔌','⏱','🎙','📱','⌚️']
    }if (emojiType === 'books'){
        emojiData = ['📦','📁','📄','📚','📕','📗','📘','📙','📓','📔','📒']
    }if (emojiType === 'sports'){
        emojiData = ['🏀','🏈','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🥅','🥊','🥋','🛷','⛸','🎿',]
    }if (emojiType === 'rooms'){
        emojiData = ['🛋','🧑‍🏫','🧑‍🔬','🧑‍💻','🧑‍💼','🧑‍🎨','💃','🤰','🗣','👤','👥']
    }


    const removeKashidashiObject = async(docObject) =>{
        await deleteDoc(doc(db, `rooms/${reservationRoomId && reservationRoomId}/reservationObjects/${docObject.id}`));
    }

    const addKashidashiObject = async() =>{
        await addDoc(collection(db, `rooms/${reservationRoomId && reservationRoomId}/reservationObjects/`), {
            emoji:emojiSelected,
            title:titleInput,
            place:placeInput,
            due:dueInputType === 'hours' ? dueInput:dueInput*24,
            reserved:false
        });
        closeModal();
    }

    const updateKashidashiObject = async() => {
        await updateDoc(doc(db, `rooms/${reservationRoomId && reservationRoomId}/reservationObjects/${previousValue.id}`), {
            emoji:emojiSelected,
            title:titleInput,
            place:placeInput,
            due:dueInputType === 'hours' ? dueInput:dueInput*24,
        });
        closeModal();
    }
    
    const closeModal = () =>{
        setPreviousValue();
        setEmojiSelected('');
        setTitleInput('');
        setPlaceInput('');
        setDueInputType('hours');
        setDueInput(1);
        setModalIsOpen(false);
    }

    function EmojiCarousel() {
        return (
            <>
            <div style={{display:'grid',gap: '0.5em',gridTemplateColumns:'1fr 1fr 1fr 1fr', marginBottom:'0.5em'}}>
                <Button onClick={() => setEmojiType('electronics')}>電子機器</Button>
                <Button onClick={() => setEmojiType('books')}>書籍</Button>
                <Button onClick={() => setEmojiType('sports')}>スポーツ</Button>
                <Button onClick={() => setEmojiType('rooms')}>部屋</Button>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap:'0.5em',
                    overflowX: 'scroll',
                    paddingBottom: '1em'
                }}
            >
                {emojiData && emojiData.map(emoji => 
                    <div
                        key={emoji}
                        style={{
                            background:`${emojiSelected === emoji ? 'var(--faintAccentColor)':'#f0f0f0'}`,
                            color: `${emojiSelected === emoji ? 'var(--accentColor)':'black'}`,
                            fontSize: '1.5em',
                            height:'60px',
                            padding:'0.5em 0.8em',
                            borderRadius:'10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onClick={() => setEmojiSelected(emoji)}
                    >
                        {emojiSelected === emoji ? <FiCheck/>:emoji}
                    </div>
                )}
            </div>
            </>
        )
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
                        style={modalStyle}
                    >
                        <Button
                            onClick={()=>closeModal()}
                            icon={<FiXCircle/>}
                            float={'right'}
                        />
                        {modalType === 'settings' && 
                            <>
                                <h2>設定</h2>
                                <p>タイトル・概要・オーナーの移行等をすることができます。なお、オーナーは移行するとアドミンとしてのアクセスはできませんのでご了承ください。</p>
                                <form
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr',
                                        gap: '0.5em'
                                    }}
                                >
                                    <AlignItems justifyContent={'space-between'}>
                                        <p style={{ margin:0}}>
                                            タイトル
                                        </p>
                                        <Input
                                            placeholder="タイトル"
                                            value={roomTitleInput}
                                            onChange={(e) => setRoomTitleInput(e.target.value)}
                                        />
                                    </AlignItems>
                                    <AlignItems justifyContent={'space-between'}>
                                        <p style={{margin:0}}>
                                            概要
                                        </p>
                                        <Input
                                            minWidth={'250px'}
                                            placeholder="概要"
                                            value={roomDescriptionInput}
                                            onChange={(e) => setRoomDescriptionInput(e.target.value)}
                                        />
                                    </AlignItems>
                                    <AlignItems justifyContent={'space-between'}>
                                        <p style={{margin:0}}>
                                            オーナーの移行
                                        </p>
                                        <AlignItems>
                                            <Input
                                                placeholder="ユーザーIDを入力"
                                                value={roomAdminInput}
                                                onChange={(e) => setRoomAdminInput(e.target.value)}
                                            />
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setRoomAdminInput('');
                                                }}
                                            >
                                                クリア
                                            </Button>
                                        </AlignItems>
                                    </AlignItems>
                                    <Button
                                        accentColor={true}
                                        icon={<FiRefreshCw/>}
                                        onClick={() => updateRoomInfo()}
                                    >
                                        更新
                                    </Button>
                                </form>
                                <div
                                    style={{
                                        marginTop:'0.5em'
                                    }}
                                >
                                    {reservedStatus ?
                                        <IconBanner icon={<FiAlertTriangle/>}>
                                            この部屋を消去するには、貸し出したもの全てが返却される必要があります。
                                        </IconBanner>:
                                        <AlignItems justifyContent={'space-between'}>
                                            <p>一度消去すると復旧することはできません</p>
                                            <Button
                                                icon={<FiTrash2/>}
                                                onClick={() => deleteThisRoom()}
                                            >
                                                部屋を消去
                                            </Button>
                                        </AlignItems>
                                    }
                                </div>
                            </>
                        }
                        {modalType !== 'settings' && modalType !== 'aboutUser' &&                 
                            <>
                                {modalType === 'new' && 
                                    <>
                                        <h2>新規作成</h2>
                                        <p>貸し出しする物を追加していこう！</p>
                                    </>
                                }
                                {modalType === 'edit' && 
                                    <>
                                        <h2>編集</h2>
                                    </>
                                }
                                <EmojiCarousel/>            
                                <form style={{display: 'grid', gridTemplateColumns: '1fr',gap: '0.5em'}}>
                                    <Input
                                        placeholder="タイトル　※被る事なくユニークなもの"
                                        value={titleInput}
                                        onChange={(e) => setTitleInput(e.target.value)}
                                    />
                                    <Input
                                        placeholder="場所　例）本館2階"
                                        value={placeInput}
                                        onChange={(e) => setPlaceInput(e.target.value)}
                                    />
                                    <div style={{marginTop:'1em',marginBottom:'1.5em'}}>
                                        <AlignItems justifyContent={'space-between'}>
                                            <h4 style={{margin:'1em 0'}}>貸出期間</h4>
                                            <AlignItems>
                                                <Button
                                                    onClick={(e)=>{
                                                        e.preventDefault();
                                                        setDueInput(1);
                                                        setDueInputType('hours');
                                                    }}
                                                >
                                                    時間単位
                                                </Button>
                                                <Button
                                                    onClick={(e)=>{
                                                        e.preventDefault();
                                                        setDueInput(1);
                                                        setDueInputType('days');
                                                    }}
                                                >
                                                    日単位
                                                </Button>
                                            </AlignItems>
                                        </AlignItems>
                                        <AlignItems justifyContent={'space-between'}>
                                            {dueInputType === 'days' ?                                        
                                                <>
                                                    <Input
                                                        placeholder="日数（半角数字）"
                                                        value={dueInput}
                                                        type={'number'}
                                                        onChange={(e) => setDueInput(e.target.value)}
                                                    />
                                                    <span>{dueInput}日貸し出す（{dueInput*24}時間）</span>
                                                </>:
                                                <>
                                                    <Input
                                                        placeholder="時間（半角数字）"
                                                        value={dueInput}
                                                        type={'number'}
                                                        onChange={(e) => setDueInput(e.target.value)}
                                                    />
                                                    <span>{dueInput}時間貸し出す</span>
                                                </>
                                            }
                                        </AlignItems>
                                    </div>
                                    {
                                        emojiSelected !== '' && titleInput && placeInput && dueInput &&
                                        <>
                                            {modalType === 'new' &&
                                                <Button
                                                    accentColor={true}
                                                    onClick={(e) => {e.preventDefault(); addKashidashiObject();}}
                                                >
                                                    作成
                                                </Button>
                                            }
                                            {modalType === 'edit' &&
                                                <Button
                                                    icon={<FiEdit/>}
                                                    accentColor={true}
                                                    onClick={(e) => {e.preventDefault(); updateKashidashiObject();}}
                                                >
                                                    変更を加える
                                                </Button>
                                            }
                                        </> 
                                    }
                                </form>
                            </>
                        }
                        {modalType === 'aboutUser' &&
                            <>                            
                                <h2>ユーザーの借り状況</h2>
                                <p>ユーザーが他に何を借りているかの情報を安全のためアドミンが把握できるようになっています。</p>
                                <>
                                    {aboutReservedBy && aboutReservedBy.map(data => {
                                        return (
                                            <Borrowing
                                                key={data.id}
                                                emoji={data.emoji}
                                                title={data.title}
                                                place={data.place}
                                                due={data.due}
                                                dateReserved={data.reservedTime}
                                                onClick={() => router.push(`/reserve/${data.reservedRoomId}`)}
                                            />
                                        )
                                    })}
                                </>
                            </>
                        }
                    </Modal>
                    {roomData && 
                        <>
                            <Header title={'編集'} subTitle={`「${roomData && roomData.data().title}」を編集`}>
                                <Button
                                    icon={<FiHome/>}
                                    onClick={() => {router.push('/app')}}
                                >
                                    Dashboardに戻る
                                </Button>
                                {roomData.data().roomType === 'dispenseMode' &&
                                    <Button
                                        icon={<FiPlay/>}
                                        onClick={() => {router.push(`/reserve/${reservationRoomId}`)}}
                                        accentColor={true}
                                    >
                                        ユーザーとして利用
                                    </Button>
                                }
                            </Header>
                            <main style={{paddingTop:'2%'}}>
                                <section style={{marginBottom:'1em'}}>
                                    <AlignItems justifyContent={'space-between'}>
                                        <Button
                                            accentColor={true}
                                            icon={<FiFilePlus/>}
                                            onClick={() => {setModalIsOpen(true); setModalType('new')}}
                                        >
                                            新しく追加
                                        </Button>
                                        <AlignItems>
                                            <Button
                                                icon={<FiSettings/>}
                                                onClick={() => {
                                                    setModalIsOpen(true);
                                                    setModalType('settings')
                                                    setRoomTitleInput(roomData.data().title);
                                                    setRoomDescriptionInput(roomData.data().description);
                                                    setRoomAdminInput(roomData.data().admin);
                                                }}
                                            >
                                                設定
                                            </Button>
                                        </AlignItems>
                                    </AlignItems>
                                </section>
                                {reservationObjects && reservationObjects.docs.map(doc =>{
                                    return (
                                        <KashidashiObjectRow
                                            key={doc.id}
                                            docObject={doc}
                                            removeButtonOnClick = {()=>removeKashidashiObject(doc)}
                                            editButtonOnClick = {()=>{
                                                setModalIsOpen(true);
                                                setModalType('edit');
                                                setPreviousValue(doc);
                                                setEmojiSelected(doc.data().emoji)
                                                setTitleInput(doc.data().title)
                                                setPlaceInput(doc.data().place)
                                                setDueInput(doc.data().due)
                                            }}
                                            // aboutReservedByOnClick={()=>{
                                            //     fetchReservedByUid(doc.reservedByUid);
                                            //     setModalIsOpen(true);
                                            //     setModalType('aboutUser')
                                            // }}
                                        />
                                    )
                                })}
                                {reservationObjects && reservationObjects.docs.length === 0 &&
                                    <Nothing icon={<FiFile/>}>
                                        <p>新しく作成するには左上にある<br/>「新しく追加」のボタンを押してください。</p>
                                    </Nothing>
                                }
                            </main>
                        </>
                    }
                </>:<LoginRequired/>
            }
        </>
    )
}