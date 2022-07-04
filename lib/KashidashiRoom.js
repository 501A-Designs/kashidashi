import React from 'react'
import Button from './buttons/Button'
import { FiEdit,FiLink,FiAirplay,FiUsers,FiGlobe,FiSlash,FiPlay } from "react-icons/fi";
import { useRouter } from 'next/router';
import AlignItems from './style/AlignItems';

import { toast } from 'react-toastify';

import { FullScreen, useFullScreenHandle } from "react-full-screen";
import CentralMode from './CentralMode';


export default function KashidashiRoom(props) {
    const router = useRouter();
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
    let reservedAmount = 0;
    props.reservationObjects.map(obj => {
        if (obj.reserved) {
            reservedAmount++
        }
    })
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
                                編集
                            </Button>
                            {roomType === 'dispenseMode' &&
                                <Button
                                    icon={<FiPlay/>}
                                    onClick={()=> router.push(`/reserve/${props.id}`)}
                                >
                                    ユーザーとして利用
                                </Button>
                            }
                        </AlignItems>             
                        {reservedAmount > 0 &&                        
                            <div style={{color:'var(--accentColor)'}}>
                                <span>{reservedAmount}個貸出中</span>
                            </div>
                        }
                    </AlignItems>   
                    <AlignItems>
                        {roomType === 'dispenseMode' &&
                            <Button
                                title={'ディスペンスモード'}
                                icon={<FiLink/>}
                                onClick={() => {
                                    navigator.clipboard.writeText(`kashidashi.vercel.app/reserve/${props.id}/`);
                                    toast(`${props.title}の貸出用URLがコピーされました。`);
                                }}
                            >
                                リンクをコピー
                            </Button>
                        }
                        {roomType === 'centralMode' &&
                            <Button
                                title={'セントラルモード'}
                                icon={<FiAirplay/>}
                                onClick={handle.enter}
                            >
                                貸し出しを始める
                            </Button>
                        }
                    </AlignItems>
                </AlignItems>
            }
        </div>
    )
}
