import React from 'react'
import Button from './buttons/Button'
import { FiEdit,FiLink,FiAirplay,FiPlay } from "react-icons/fi";
import { useRouter } from 'next/router';
import AlignItems from './style/AlignItems';

import { toast } from 'react-toastify';

import { FullScreen, useFullScreenHandle } from "react-full-screen";
import CentralMode from './CentralMode';
import { collection, getFirestore } from 'firebase/firestore';
import { app } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

import { useMediaQuery } from 'react-responsive'

export default function KashidashiRoom(props) {
    const router = useRouter();
    const db = getFirestore(app);

    const handle = useFullScreenHandle();
    const roomType = props.roomType;

    const kashidashiRoom = {
        borderRadius: '15px',
        padding: '1em',
        border: `2px solid ${props.recentlyViewed ? '#F8F8F8': '#F0F0F0'}`,
        backgroundColor: `${props.recentlyViewed ? '#F0F0F0': 'white'}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%'
    }

    let reservationObjectsNum = 0

    const roomReservationCollectionRef = collection(db, `rooms/${props.id}/reservationObjects/`);
    const [reservationObjects] = useCollection(roomReservationCollectionRef);

    reservationObjects && reservationObjects.docs.map((obj) => {
        if (roomType =='centralMode' && obj.data().reserved == true) {
            reservationObjectsNum++
        }
    })

    const isSmallScreen = useMediaQuery({ query: '(max-width: 1000px)' });

    return (
        <div style={kashidashiRoom} key={props.key}>
            <AlignItems justifyContent={'space-between'}>
                <h2 style={{margin:'0.5em 0 0 0',}}>
                    {props.title}
                </h2>
                <FullScreen handle={handle}>
                    {handle.active && 
                        <CentralMode
                            name={props.title}
                            description={props.description}
                            reservationRoomId={props.id}
                        />
                    }
                </FullScreen>
            </AlignItems>
            <p>{props.description}</p>
            {!props.recentlyViewed &&
                <AlignItems justifyContent={'space-between'}>    
                    <AlignItems gap={'1em'}>
                        <AlignItems>
                            <Button
                                accentColor={true}
                                icon={<FiEdit/>}
                                onClick={() => router.push(`/admin/${props.id}/`)}
                            >
                                {!isSmallScreen && '??????'}
                            </Button>
                            {roomType === 'dispenseMode' &&
                                <Button
                                    icon={<FiPlay/>}
                                    onClick={()=> router.push(`/reserve/${props.id}`)}
                                >
                                    {!isSmallScreen && '???????????????????????????'}
                                </Button>
                            }
                        </AlignItems>             
                        {reservationObjectsNum > 0 &&                        
                            <div style={{color:'var(--accentColor)'}}>
                                <span>{reservationObjectsNum}????????????</span>
                            </div>
                        }
                    </AlignItems>   
                    <AlignItems>
                        {roomType === 'dispenseMode' &&
                            <Button
                                title={'???????????????????????????'}
                                icon={<FiLink/>}
                                onClick={() => {
                                    navigator.clipboard.writeText(`kashidashi.vercel.app/reserve/${props.id}/`);
                                    toast(`???${props.title}???????????????URL??????????????????????????????`);
                                }}
                            >
                                ?????????????????????
                            </Button>
                        }
                        {roomType === 'centralMode' &&
                            <Button
                                title={'????????????????????????'}
                                icon={<FiAirplay/>}
                                onClick={handle.enter}
                            >
                                ????????????????????????
                            </Button>
                        }
                    </AlignItems>
                </AlignItems>
            }
        </div>
    )
}
