import { useRouter } from 'next/router'
import React from 'react'
import Button from '../buttons/Button'
import AlignItems from '../style/AlignItems'

export default function LoginRequired() {
    const router = useRouter();

    return (
        <AlignItems
            height={'100vh'}
            flexDirection={'column'}
        >
            <h1
                style={{
                    marginBottom:'0em',
                    marginTop:'2em'
                }}
            >
                アクセス不可
            </h1>
            <p>ログインする必要があります。</p>
            <AlignItems>
                <Button
                    accentColor={true}
                    onClick={() => router.push('/')}
                >
                    ログイン画面へ
                </Button>
                <Button
                    onClick={() => router.push('/about')}
                >
                    Kashidashiについて
                </Button>
            </AlignItems>
        </AlignItems>
    )
}
