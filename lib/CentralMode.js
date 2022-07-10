import React,{useState} from 'react'
import CentralKashidashiObject from './CentralKashidashiObject';
import AlignItems from './style/AlignItems';

import Button from './buttons/Button';
import Input from './Input';
import { FiArrowUp, FiXCircle, FiArrowLeft, FiBookmark, FiSmile, FiSend } from 'react-icons/fi';

import moment from 'moment';
import 'moment/locale/ja'
import { collection, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { app } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import Nothing from './scene/Nothing';

export default function CentralMode(props) {
    const db = getFirestore(app);
    let timeNow = moment().format('MMMM Do YYYY, h:mm a');

    const [displayScene, setDisplayScene] = useState('start');
    const [userNameInput, setUserNameInput] = useState('');
    const [userEmailInput, setUserEmailInput] = useState('');
    const [reservedKashidashiObjectData, setReservedKashidashiObjectData] = useState();

    const reserveKashidashiObject = async() =>{
        await updateDoc(doc(db, `rooms/${props.reservationRoomId}/reservationObjects/${reservedKashidashiObjectData.id}/`), {
            reserved:true,
            reservedBy:userNameInput,
            reservedByEmail:userEmailInput,
            reservedTime:timeNow,
        });
    }

    const reservationObjectsCollectionRef = collection(db, `rooms/${props.reservationRoomId}/reservationObjects/`);
    const [reservationObjects] = useCollection(reservationObjectsCollectionRef);

    let reservedNum = 0;
    let notReservedNum = 0;

    
    function LargeButton(props) {
        return (
            <div
                style={{
                    backgroundColor:'var(--faintAccentColor)',
                    color:'var(--accentColor)',
                    padding:'3em',
                    borderRadius:'30px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    textAlign:'center'
                }}
                onClick={props.onClick}
            >
                <AlignItems flexDirection={'column'} gap={'0'}>
                    <div style={{fontSize:'5em'}}>
                        {props.icon}
                    </div>
                    <h2>{props.children}</h2>
                </AlignItems>
            </div>
        )
    }
    

    return (
        <>     
            <section
                style={{
                    padding: '2.5%',
                    height: '100vh'
                }}
            >
                <div
                    style={{
                        backgroundColor: 'white',
                        height: '100%',
                        borderRadius: '30px',
                        padding: '10px',
                        border:'1px solid gray',
                        boxShadow: '0px 0px 30px lightgray',
                    }}
                >
                    {displayScene === 'start' &&
                        <AlignItems justifyContent={'center'} height={'100%'}>
                            <div>
                                <AlignItems justifyContent={'center'} flexDirection={'column'}>
                                    <h1 style={{fontSize: '2.5em',marginBottom:'0'}}>{props.name}</h1>
                                    <p>{props.description}</p>
                                </AlignItems>
                                <section style={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: '1.5em',padding: '2em',overflowY:'scroll'}}>
                                    <LargeButton
                                        icon={<FiBookmark/>}
                                        onClick={() => {setDisplayScene('reserve')}}
                                    >
                                        これから借りる
                                    </LargeButton>
                                    <LargeButton
                                        icon={<FiArrowUp/>}
                                        onClick={() => setDisplayScene('return')}
                                    >
                                        借りたものを返却
                                    </LargeButton>
                                </section>
                            </div>
                        </AlignItems>
                    }
                    {displayScene === 'reserve' &&
                        <>
                            <AlignItems justifyContent={'center'}>
                                <Button
                                    onClick={() => setDisplayScene('start')}
                                    icon={<FiArrowLeft/>}
                                >
                                    貸し借り画面に戻る
                                </Button>
                            </AlignItems>
                            <h2 style={{textAlign: 'center',fontSize: '3em'}}>これから借りる</h2>
                            <section style={{display: 'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap: '1.5em',padding: '2em',overflowY:'scroll'}}>
                                {reservationObjects.docs.map(obj =>{
                                    if (obj.data().reserved === false) {
                                        notReservedNum++;                 
                                        return (
                                            <CentralKashidashiObject
                                                key={obj.id}
                                                docObject={obj}
                                                reserveOnClick={()=>{
                                                    setDisplayScene('reservationForm');
                                                    setReservedKashidashiObjectData(obj);
                                                    setUserNameInput('')
                                                    setUserEmailInput('')
                                                }}
                                                reservationRoomId={props.reservationRoomId}
                                            />
                                        )
                                    }
                                })}
                            </section>
                            {notReservedNum === 0 &&                            
                                <Nothing icon={<FiSend/>}>
                                    <p>現在貸し出しているものは全て借りられています。</p>
                                </Nothing>
                            }
                        </>
                    }
                    {displayScene === 'return' &&
                        <>
                            <AlignItems justifyContent={'center'}>
                                <Button
                                    onClick={() => setDisplayScene('start')}
                                    icon={<FiArrowLeft/>}
                                >
                                    貸し借り画面に戻る
                                </Button>
                            </AlignItems>
                            <h2 style={{textAlign: 'center',fontSize: '3em'}}>返却画面</h2>
                            <section style={{display: 'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap: '1.5em',padding: '2em',overflowY:'scroll'}}>
                                {
                                    reservationObjects.docs.map(obj =>{
                                        if (obj.data().reserved === true) {
                                            reservedNum++;          
                                            return (
                                                <CentralKashidashiObject
                                                    key={obj.id}
                                                    docObject={obj}
                                                    reservationRoomId={props.reservationRoomId}
                                                />
                                            )
                                        }
                                    })
                                }
                            </section>
                            {reservedNum === 0 &&                            
                                <Nothing icon={<FiSmile/>}>
                                    <p>全て返却済みです。返却の方ありがとうございます。</p>
                                </Nothing>
                            }
                        </>
                    }
                    {displayScene === 'reservationForm' && 
                         <AlignItems justifyContent={'center'} height={'100%'}>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns:'1fr',
                                    gap: '1em',
                                    backgroundColor: 'white',
                                    border: '2px solid #F0F0F0',
                                    borderRadius: '30px',
                                    padding: '2em',
                                    boxShadow: '0px 5px 30px lightgray',
                                }}
                            >
                                <AlignItems justifyContent={'center'} gap={'2em'}>
                                    <div
                                        style={{
                                            backgroundColor: 'var(--faintAccentColor)',
                                            borderRadius:'15px',
                                            padding: '2em',
                                        }}
                                    >
                                        <AlignItems justifyContent={'center'} flexDirection={'column'}>
                                            <div
                                                style={{
                                                    backgroundColor:'var(--accentColor)',
                                                    borderRadius:'30px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '40px',
                                                    height: '40px',
                                                    padding: '1em',
                                                    fontSize:'3em'
                                                }}
                                            >
                                                {reservedKashidashiObjectData.data().emoji}
                                            </div>
                                            <h1 style={{fontSize:'1.5em', margin: '0'}}>{reservedKashidashiObjectData.data().title}</h1>
                                        </AlignItems>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={()=>{
                                                setDisplayScene('reserve');
                                                setUserNameInput('');
                                                setUserEmailInput('');
                                            }}
                                            icon={<FiXCircle/>}
                                            float={'right'}
                                        />
                                        <>
                                            <h2>これから借りる</h2>
                                            <p>
                                                借りる上で名前・連絡が付くメールアドレスを入力。
                                            </p>
                                            <div
                                                style={{
                                                    display: 'grid',
                                                    gap: '0.5em',
                                                    gridTemplateColumns:'1fr'
                                                }}
                                            >
                                                <Input
                                                    placeholder="お名前"
                                                    value={userNameInput}
                                                    onChange={(e)=>setUserNameInput(e.target.value)}
                                                />
                                                <Input
                                                    placeholder="メールアドレス（半角）"
                                                    value={userEmailInput}
                                                    onChange={(e)=>setUserEmailInput(e.target.value)}
                                                />
                                            </div>
                                        </>
                                    </div>
                                </AlignItems>
                                {
                                    userNameInput && userEmailInput &&
                                    <Button
                                        accentColor={true}
                                        onClick={() => {
                                            reserveKashidashiObject();
                                            setDisplayScene('start');
                                        }}
                                    >
                                        借りる
                                    </Button>
                                }
                            </div>
                        </AlignItems>
                    }
                </div>
            </section>
        </>
    )
}
