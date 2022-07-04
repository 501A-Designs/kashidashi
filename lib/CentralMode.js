import React,{useState,useEffect} from 'react'
import { useRouter } from 'next/router';
import CentralKashidashiObject from './CentralKashidashiObject';
import AlignItems from './style/AlignItems';

import Button from './buttons/Button';
import Input from './Input';
import { FiArrowUp, FiXCircle, FiArrowLeft, FiBookmark } from 'react-icons/fi';

import moment from 'moment';
import 'moment/locale/ja'
import { arrayRemove, arrayUnion, doc, getFirestore, onSnapshot, updateDoc } from 'firebase/firestore';
import { app } from '../firebase';

export default function CentralMode(props) {
    const [userNameInput, setUserNameInput] = useState('');
    const [userEmailInput, setUserEmailInput] = useState('');

    const [reservedKashidashiObjectData, setReservedKashidashiObjectData] = useState({})

    const db = getFirestore(app);
    const reserveKashidashiObject = async() =>{
        let timeNow = moment().format('MMMM Do YYYY, h:mm a');
        await updateDoc(doc(db, "rooms", props.reservationRoomId), {
            reservationObjects: arrayRemove({
                emoji:reservedKashidashiObjectData.emoji,
                title:reservedKashidashiObjectData.title,
                place:reservedKashidashiObjectData.place,
                due:reservedKashidashiObjectData.due,
                reserved:reservedKashidashiObjectData.reserved
            })
        });
        await updateDoc(doc(db, "rooms", props.reservationRoomId), {
            reservationObjects: arrayUnion({
                emoji:reservedKashidashiObjectData.emoji,
                title:reservedKashidashiObjectData.title,
                place:reservedKashidashiObjectData.place,
                due:reservedKashidashiObjectData.due,
                reserved:true,
                reservedBy:userNameInput,
                reservedByEmail:userEmailInput,
                reservedTime:timeNow,
            })
        });
    }


    // Fetching reseravation Objects data
    const [reservationObjects, setReservationObjects] = useState();
    const unsub = () =>{
        onSnapshot(doc(db, "rooms", props.reservationRoomId), (doc) => {
            setReservationObjects(doc.data().reservationObjects);
        });
    }
    
    useEffect(() => {
        unsub();
    }, [props.reservationRoomId])


    const [displayScene, setDisplayScene] = useState('start');
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
                                        onClick={() => setDisplayScene('reserve')}
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
                                {reservationObjects.map(obj =>{
                                    if (obj.reserved === false) {                         
                                        return (
                                            <CentralKashidashiObject
                                                key={obj.title}
                                                emoji={obj.emoji}
                                                title={obj.title}
                                                place={obj.place}
                                                due={obj.due}
                                                reserved={obj.reserved}
                                                reserveOnClick={()=>{
                                                    setDisplayScene('reservationForm')
                                                    setReservedKashidashiObjectData({
                                                        emoji:obj.emoji,
                                                        title:obj.title,
                                                        place:obj.place,
                                                        due:obj.due,
                                                        reserved:obj.reserved,
                                                    });
                                                }}
                                                reservedBy={obj.reservedBy}
                                                reservedTime={obj.reservedTime}
                                                reservationRoomId={props.reservationRoomId}
                                            />
                                        )
                                    }
                                })}
                            </section>
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
                                {reservationObjects.map(obj =>{
                                    if (obj.reserved === true) {                    
                                        return (
                                            <CentralKashidashiObject
                                                key={obj.title}
                                                emoji={obj.emoji}
                                                title={obj.title}
                                                place={obj.place}
                                                due={obj.due}
                                                reserved={obj.reserved}
                                                reservedBy={obj.reservedBy}
                                                reservedByEmail={obj.reservedByEmail}
                                                reservedTime={obj.reservedTime}
                                                reservationRoomId={props.reservationRoomId}
                                            />
                                        )
                                    }
                                })}
                            </section>
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
                                                {reservedKashidashiObjectData.emoji}
                                            </div>
                                            <h1 style={{fontSize:'1.5em', margin: '0'}}>{reservedKashidashiObjectData.title}</h1>
                                        </AlignItems>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={()=>setDisplayScene('reserve')}
                                            icon={<FiXCircle/>}
                                            float={'right'}
                                        />
                                        <>
                                            <h2>借りる</h2>
                                            <p>
                                                借りる上で名前を書いてください。
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
