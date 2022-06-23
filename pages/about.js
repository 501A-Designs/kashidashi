import React from 'react'
import Button from '../lib/buttons/Button'
import Header from '../lib/Header'
import { FiHome,FiGithub,FiTwitter } from "react-icons/fi";
import { useRouter } from 'next/router';
import AlignItems from '../lib/style/AlignItems';

export default function About() {
  const router = useRouter();
  return (
    <>
      <Header title={'About'}><Button icon={<FiHome/>} onClick={()=>router.push('/')}>メインに戻る</Button></Header>
      <main>
          <p>Kashidashiは誰もが簡単に貸し出しシステムを運用できるソフトウェアサービスです。</p>
          <h2>アクセス制限の有効</h2>
          <p>
            新しい部屋を作るとデフォルトでKashidashiにログインしている人誰もがアクセスできるようになっています。Gsuiteをご使用の団体様はご自分の独自メールドメイン（@gmail.comではなく@団体名.jp等のメールアドレス）でアクセスの許可を制限することができます。
          </p>
          <h2>開発について</h2>
          <p>Kashidashiは私（501A）によって作成されたウェブアプリです。コードはオープンソースなので、興味ある方はGitHubからソースコードを閲覧することができます。</p>
          <AlignItems>
            <Button icon={<FiGithub/>}>GitHubでソースコードを見る</Button>
            <Button icon={<FiTwitter/>}>開発者のツイッター</Button>
          </AlignItems>
      </main>
    </>
  )
}
