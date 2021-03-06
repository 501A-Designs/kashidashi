import { useRouter } from 'next/router';
import React,{useState} from 'react'

import Header from '../../lib/Header'
import DispenseKashidashiObject from '../../lib/DispenseKashidashiObject'

import { FiBookmark, FiEdit,FiHome, FiShield, FiXCircle } from "react-icons/fi";

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

Modal.setAppElement('#__next');
import Modal from 'react-modal';
import { modalStyle } from '../../lib/style/modalStyle';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import {ja} from 'react-date-range/dist/locale';
import { addDays } from 'date-fns';
import TextArea from '../../lib/TextArea';

export default function ReservationRoom() {
    const router = useRouter();
    const reservationRoomId = router.query.id;
    const [progress, setProgress] = useState(0)

    const auth = getAuth(app);
    const [user] = useAuthState(auth);
    const db = getFirestore(app);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [reserveModalSection, setReserveModalSection] = useState('');
    const [reserveModalObject, setReserveModalObject] = useState('');
    const [reservationReasonInput, setReservationReasonInput] = useState('');

    const roomDataDocumentRef = doc(db, `rooms/${reservationRoomId && reservationRoomId}/`)
    const [roomData] =  useDocument(roomDataDocumentRef);

    const reviewsCollectionRef = collection(db, `rooms/${reservationRoomId && reservationRoomId}/reservationObjects/`);
    const [reservationObjects] = useCollection(reviewsCollectionRef);
    
    const 
    reserveKashidashiObject
     = async() =>{
        const check = confirm(`???????????????????????????`);
        if (check) {            
            let timeNow = moment().format('MMMM Do YYYY, h:mm a');
            await setDoc(doc(db, `rooms/${reservationRoomId && reservationRoomId}/reservationObjects/${reserveModalObject.id}/reservedUser/${user && user.uid}`), {
                reservedBy:user && user.displayName,
                reservedByEmail:user && user.email,
                reservedByPhoto: user && user.photoURL,

                reservedReason:reservationReasonInput,
                reservedSlotStart:calendarState[0].startDate,
                reservedSlotEnd:calendarState[0].endDate,
                reservedTime:timeNow,
            });
            await setDoc(doc(db, `user/${user && user.uid}/reservedObjects/${reserveModalObject.id}/`), {
                emoji:reserveModalObject.data().emoji,
                title:reserveModalObject.data().title,
                place:reserveModalObject.data().place,
                due:reserveModalObject.data().due,
    
                reservedTime:timeNow,
                reservedRoomId:reservationRoomId,
                reservedSlotStart:calendarState[0].startDate,
                reservedSlotEnd:calendarState[0].endDate,
                reservedReason:reservationReasonInput,
            });
            setModalIsOpen(false);
            setReservationReasonInput('');
        }else{
            alert("???????????????????????????????????????")
        }
    }

    const isSmallScreen = useMediaQuery({ query: '(max-width: 1200px)' });
    const isVerySmallScreen = useMediaQuery({ query: '(max-width: 800px)' });

    const [calendarState, setCalendarState] = useState([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 1),
          key: 'selection'
        }
    ]);

    const getDates = (startDate, stopDate) => {
        var dateArray = [];
        var currentDate = moment(startDate);
        var stopDate = moment(stopDate);
        while (currentDate <= stopDate) {
            dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
            currentDate = moment(currentDate).add(1, 'days');
        }
        return dateArray;
    }

    const betweenDatesArray = (startDate, stopDate) =>{
        let datesFormatedArray = [];
        getDates(startDate, stopDate).map(date =>{
            datesFormatedArray.push(new Date(date))
        })
        return datesFormatedArray;
    }
    
    const [reservedUserId] = useCollection(collection(db, `rooms/${reservationRoomId && reservationRoomId}/reservationObjects/${reserveModalObject.id}/reservedUser/`));
    
    let temporaryArray = [];
    reserveModalObject && reservedUserId && reservedUserId.docs.map((doc) =>{
        temporaryArray.push(
            betweenDatesArray(doc.data().reservedSlotStart.toDate().toDateString(),doc.data().reservedSlotEnd.toDate().toDateString())
        )
    })

    return (
        <>
            <LoadingBar
                color='var(--accentColor)'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
                waitingTime={500}
            />
            <Head>
                <title>???????????????</title>
                <meta property="og:title" content="????????????????????????????????????????????????" key="title" />
            </Head>

            {user ? 
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
                        <h2>???{reserveModalObject && reserveModalObject.data().title}????????????</h2>
                        <form
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: '0.5em'
                            }}
                        >
                        {reserveModalSection === 'date' &&
                            <>
                                <div
                                    style={{
                                        border: '2px solid #f0f0f0',
                                        padding: `${isSmallScreen ? '0px':'1em'}`,
                                        borderRadius: `${isSmallScreen ? '0px':'10px'}`,
                                    }}
                                    >
                                    <DateRange
                                        rangeColors={['var(--accentColor)','var(--faintAccentColor)','#f0f0f0']}
                                        editableDateInputs={true}
                                        onChange={item => setCalendarState([item.selection])}
                                        moveRangeOnFirstSelection={false}
                                        ranges={calendarState}
                                        locale={ja}

                                        minDate={addDays(new Date(), 0)}
                                        maxDate={addDays(new Date(), 90)}
                                        disabledDates={temporaryArray.flat()}
                                    />
                                </div>
                                {calendarState[0].startDate && calendarState[0].endDate &&
                                    <Button
                                        accentColor={true}
                                        // icon={<FiRefreshCw/>}
                                        onClick={() => setReserveModalSection('reserve')}
                                    >
                                        ??????
                                    </Button>
                                }
                            </>
                        }
                        {reserveModalSection === 'reserve' &&
                            <>
                                <p>??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>
                                <TextArea
                                    placeholder="?????????????????????"
                                    value={reservationReasonInput}
                                    onChange={(e) => setReservationReasonInput(e.target.value)}
                                />
                                {reservationReasonInput &&
                                    <Button
                                        accentColor={true}
                                        icon={<FiBookmark/>}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            reserveKashidashiObject();
                                        }}
                                    >
                                        ??????
                                    </Button>
                                }
                            </>
                        }
                        </form>
                    </Modal> 
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
                                        {!isSmallScreen && 'Dashboard?????????'}
                                    </Button>
                                }
                                {roomData.data().admin === user.uid && 
                                    <>
                                        <Button
                                            icon={<FiEdit/>}
                                            onClick={()=>router.push(`/admin/${reservationRoomId}`)}
                                            accentColor={true}
                                        >
                                            {!isSmallScreen && '???????????????????????????'}
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
                                                setReserveModalObject(doc);
                                                setModalIsOpen(true);
                                                setReserveModalSection('date');
                                            }}
                                            reservationRoomId={reservationRoomId}
                                            currentUserObject={user}
                                        />
                                    })}
                                </section>
                            </main>
                        </>:<Nothing icon={<FiShield/>}>
                            <p>????????????????????????????????????????????????Gsuite???????????????????????????????????????????????????????????????????????????</p>
                        </Nothing>
                    }
                </>:<LoginRequired/>
            }
        </>
    )
}
