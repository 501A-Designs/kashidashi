import { useRouter } from 'next/router';
import React from 'react'

export default function CentralMode() {
    const router = useRouter();
    const reservationRoomId = router.query.id;

    return (
        <div>
            <h1>{reservationRoomId}</h1>
        </div>
    )
}
