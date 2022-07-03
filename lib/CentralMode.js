import React,{useState} from 'react'
import { useRouter } from 'next/router';
import CentralKashidashiObject from './CentralKashidashiObject';
import AlignItems from './style/AlignItems';

import { modalStyle } from './style/modalStyle';
import Modal from 'react-modal';
import Button from './buttons/Button';
import Input from './Input';
import { FiArrowUp, FiXCircle, FiArrowLeft, FiBookmark } from 'react-icons/fi';

export default function CentralMode(props) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [userNameInput, setUserNameInput] = useState('');

    const reserveKashidashiObject = async(emoji,title,place,due,reservation) =>{
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
                reservedBy:userNameInput,
                reservedByUid:user.uid,
                reservedTime:timeNow,
            })
        });
    }

    const [displayScene, setDisplayScene] = useState('start')

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
            <Modal
                isOpen={modalIsOpen}
                style={modalStyle}
            >
                <Button
                    onClick={()=>setModalIsOpen(false)}
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
                        {userNameInput &&
                            <Button
                                accentColor={true}
                                onClick={() => reserveKashidashiObject()}
                            >
                                部屋を新しく作成
                            </Button>
                        }
                    </div>
                </>
            </Modal>        
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
                        <>                    
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
                        </>
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
                            <section style={{display: 'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap: '1.5em',padding: '2em',overflowY:'scroll'}}>
                                {props.reservationObjects.map(obj =>{
                                    return (
                                        <CentralKashidashiObject
                                            key={obj.title}
                                            emoji={obj.emoji}
                                            title={obj.title}
                                            place={obj.place}
                                            due={obj.due}
                                            reserved={obj.reserved}
                                            reserveOnClick={()=>{
                                                setModalIsOpen(true);
                                                console.log('bruh')

                                                // reserveKashidashiObject(
                                                //     obj.emoji,
                                                //     obj.title,
                                                //     obj.place,
                                                //     obj.due,
                                                //     obj.reserved,
                                                // );
                                            }}
                                            reservedBy={obj.reservedBy}
                                            reservedTime={obj.reservedTime}
                                            reservationRoomId={props.reservationRoomId}
                                        />
                                    )
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
                            <section style={{display: 'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap: '1.5em',padding: '2em',overflowY:'scroll'}}>
                                {props.reservationObjects.map(obj =>{
                                    return (
                                        <CentralKashidashiObject
                                            key={obj.title}
                                            emoji={obj.emoji}
                                            title={obj.title}
                                            place={obj.place}
                                            due={obj.due}
                                            reserved={obj.reserved}
                                            reserveOnClick={()=>{
                                                setModalIsOpen(true);
                                                console.log('bruh')

                                                // reserveKashidashiObject(
                                                //     obj.emoji,
                                                //     obj.title,
                                                //     obj.place,
                                                //     obj.due,
                                                //     obj.reserved,
                                                // );
                                            }}
                                            reservedBy={obj.reservedBy}
                                            reservedTime={obj.reservedTime}
                                            reservationRoomId={props.reservationRoomId}
                                        />
                                    )
                                })}
                            </section>
                        </>
                    }
                </div>
            </section>
        </>
    )
}
