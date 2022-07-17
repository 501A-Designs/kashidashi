import React,{useState} from 'react'
import { FiCheck, FiChevronDown, FiChevronUp, FiClock, FiMapPin } from 'react-icons/fi';
import Button from './buttons/Button'
import AlignItems from './style/AlignItems'

import moment from 'moment';
import 'moment/locale/ja'

import { useMediaQuery } from 'react-responsive'

export default function Borrowing(props) {
    const [viewDetails, setViewDetails] = useState(false);
    const [notice, setNotice] = useState(false);
    const isSmallScreen = useMediaQuery({ query: '(max-width: 1000px)' })

    // if (props.due>=24) {
    //     props.dateReserved.split(',').
    // }

    return (
        <div
            key={props.key}
            style={{
                transition: '0.2s',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '0.5em',
                padding:`${viewDetails ? '1em':'0'}`,
                marginTop:'0.8em',
                borderRadius:'15px',
                border: `2px solid ${viewDetails ? '#F0F0F0':'transparent'}`
            }}
        >
            <AlignItems justifyContent={'space-between'}>
                <AlignItems gap={'1em'}>
                    <div
                        style={{
                            backgroundColor:'#F0F0F0',
                            borderRadius:'50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            padding: '1em'
                        }}
                    >
                        {props.emoji}
                    </div>
                    <h4 style={{margin:0,padding:0}}>{props.title}</h4>
                    {notice &&
                        <div
                            style={{ 
                                backgroundColor:'var(--accentColor)',
                                width: '10px',
                                height: '10px',
                                borderRadius:'50px',
                            }}
                        />
                    }
                </AlignItems>
                <AlignItems>
                    <Button
                        onClick={() => 
                            viewDetails ? setViewDetails(false):
                            setViewDetails(true)
                        }
                        icon={viewDetails ? <FiChevronUp/>:<FiChevronDown/>}
                    >
                        {!isSmallScreen && <>{viewDetails ? '閉じる':'詳細'}</>}
                    </Button>
                    <Button onClick={props.onClick} accentColor={'true'}>
                        部屋に入る
                    </Button>
                </AlignItems>
            </AlignItems>
            {
                viewDetails &&
                <>
                    <div style={{padding:'0.5em'}}>
                        <AlignItems gap={'1em'}>
                            <AlignItems><FiMapPin/><span>{props.place}</span></AlignItems>
                            <AlignItems><FiClock/><span>{props.due}時間</span></AlignItems>
                        </AlignItems>
                    </div>
                    <div
                        style={{
                            textAlign:'center',
                            borderRadius:'10px',
                            backgroundColor:'#F0F0F0',
                            color:'black',
                            padding:'0.5em 1em'
                        }}
                    >
                        <AlignItems justifyContent={'center'}><FiCheck/><span>借り始めた日時：{props.dateReserved}</span></AlignItems>
                    </div>
                    {notice &&                    
                        <div
                            style={{
                                textAlign:'center',
                                borderRadius:'10px',
                                backgroundColor:'var(--faintAccentColor)',
                                color:'var(--accentColor)',
                                padding:'0.5em 1em'
                            }}
                        >
                            返却日時が過ぎています
                        </div>
                    }
                </>
            }
        </div>
    )
}
