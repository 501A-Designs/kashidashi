import React from 'react'
import Button from './buttons/Button'
import { FiEdit,FiLink,FiAirplay,FiUsers,FiGlobe,FiSlash,FiPlay } from "react-icons/fi";
import { useRouter } from 'next/router';
import AlignItems from './style/AlignItems';

import { toast } from 'react-toastify';

export default function KashidashiRoom(props) {
    const router = useRouter();
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
                <h2
                    style={{
                        margin:'0.5em 0 0 0',
                        // borderBottom: '2px solid var(--faintAccentColor)',
                        // width: 'fit-content',
                        // cursor: 'pointer'
                    }}
                >
                    {props.title}
                </h2>
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
                            <Button
                                icon={<FiPlay/>}
                                onClick={()=> router.push(`/reserve/${props.id}`)}
                            >
                                ユーザーとして利用
                            </Button>
                        </AlignItems>             
                        {reservedAmount > 0 &&                        
                            <div style={{color:'var(--accentColor)'}}>
                                <span>{reservedAmount}個貸出中</span>
                            </div>
                        }
                    </AlignItems>   
                    <AlignItems>
                        <Button
                            icon={<FiLink/>}
                            onClick={() => {
                                navigator.clipboard.writeText(`kashidashi.vercel.app/reserve/${props.id}/`);
                                toast(`${props.title}の貸出用URLがコピーされました。`);
                            }}
                        >
                        </Button>
                        <Button
                            icon={<FiAirplay/>}
                            onClick={() => { router.push(`/centralmode/${props.id}/`)}}
                        >
                        </Button>
                    </AlignItems>
                </AlignItems>
            }
        </div>
    )
}
