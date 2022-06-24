import React from 'react'
import Button from '../lib/buttons/Button'
import Header from '../lib/Header'
import { FiHome,FiGithub,FiTwitter } from "react-icons/fi";
import { useRouter } from 'next/router';
import AlignItems from '../lib/style/AlignItems';

import axios from 'axios'
import useSWR from 'swr'
import Footer from '../lib/Footer';

export default function About() {
  const router = useRouter();
  const fetcher = url => axios.get(url).then(res => res.data);
  const { data, error } = useSWR('/api/data', fetcher('https://zenn.dev/api/scraps/4dd98c022a4577/blob.json'));
  console.log(data, error);

  const pitchLink = 'https://pitch.com/public/044d2794-42e8-4e7a-a8ed-c3ddee03ebf1';

  return (
    <>
      <Header title={'About'}><Button icon={<FiHome/>} onClick={()=>router.push('/')}>メインに戻る</Button></Header>
      <main className={'grid-1fr-2fr'}>
        <section>
          <h1 className={'title'} style={{marginTop:'1em'}}>目次</h1>
          <ul>
            <li>Kashidashiについて</li>
            <li>使用法</li>
            <li>ユーザー様に関する事</li>
            <li>開発について</li>
          </ul>
        </section>
        <section>
          <h1>Kashidashiについて</h1>
          <p>Kashidashiは誰もが簡単に貸し出しシステムを運用できるウェブアプリです。なお、現在はパソコンを通した使用しかサポートされておりませんのでご了承ください。</p>
          <p>
            Kashidashiにはさまざまな魅力があります。
            <ul>
              <li>使いやすい</li>
              <li>使用価格0円</li>
              <li>こだわりを持ったUI・UX</li>
              <li>Gsuite使用の団体にピッタリなツール</li>
              <li>二種類の使用法</li>
            </ul>
            他にも、Kashidashiに関する情報は視覚的に理解できるために<a href={pitchLink} target={'_blank'}>スライド</a>でもまとめたので興味があれば是非見てください！
          </p>
          <h1>使用法</h1>
          <h2>部屋を作成</h2>
          <h2>他の人に貸し出しをする</h2>
          <h3>ディスペンスモード</h3>
          <p>
            ディスペンスモードの仕組みについては<a href={pitchLink+'/ea304f9e-c745-4af5-8a8e-1407537c4cdd'} target={'_blank'}>こちら</a>のスライドでわかります。
          </p>
          <h3>セントラルモード</h3>
          <p>
            セントラルモードの仕組みについては<a href={pitchLink+'/d28358b2-2b7b-4e3a-aef9-ea24d1f00838'} target={'_blank'}>こちら</a>のスライドでわかります。
          </p>
          <h2>アクセス制限</h2>
          <p>
            新しい部屋を作るとデフォルトでKashidashiにログインしている人誰もがアクセスできるようになっています。Gsuiteをご使用の団体様はご自分の独自メールドメイン（@gmail.comではなく@団体名.jp等のメールアドレス）でアクセスの許可を制限することができます。詳しくは<a>スライド</a>を読むと良いです。
          </p>
          <h1>ユーザー様に関する事</h1>
          <h2>プライバシーポリシー</h2>
          <p>
            Kashidashiのプライバシーポリシーは私（501A）が開発した別サービスであるDeizuのプライバシーポリシーをもとに作成しました。
            Kashidashiをご利用するにあたり、以下のルールを定めまさせていただきます：
          </p>
          <ol>
            <li>ユーザー情報の保存の許可</li>
            <li>第三者サービスの使用の許可</li>
          </ol>
          <p>上記で定めたルールに関する詳しい情報：</p>
          <h3>1.ユーザー情報の保存の許可</h3>
          <h4>使用される上で保存される情報</h4>
          <p>基本的にはDeizu本サイトに入力する情報のみ保存されます</p>
          <ul>
              <li>GoogleアカウントのEmail</li>
              <li>アカウント作成日</li>
              <li>ログインした最終日</li>
              <li>部屋のタイトル</li>
              <li>部屋に追加する「貸し出す要素」のメタデータ：入力したタイトル・絵文字・場所名・貸し出し期間等</li>
          </ul>
          <h3>2.第三者サービスの使用の許可</h3>
          <h4>Kashidashiで利用している第三者サービス</h4>
          <p> Kashidashiは以下の第三者サービスを利用します。</p>
          <h5>Google Analytics</h5>
          <p> Kashidashiを使用する際には匿名で場所・閲覧時間・閲覧されたデバイスなどが記録されます。</p>
          <h5>Firebase (Google Cloud Platform)</h5>
          <p>当サイトは、Firebase (Google Cloud Platform) を通し、ユーザーのアカウント・時間割表のデータを管理させていただいています。ログインし使用する際はFirebaseにデータが保存されます。</p>
          <p>
              ※Google Inc.の<a href="https://policies.google.com/?hl=ja">プライバシーポリシー</a>
          </p>
          <h3>これらの情報収集の目的について</h3>
          <p>
              本ポリシーにおける変更はユーザーに通知する場合はございませんのでご了承下さい：
          </p>
          <ol>
              <li>Kashidashiのユーザー層を理解するため：ユーザーによってサービスにおける改善また新たな機能の追加を行う場合がございます</li>
              <li>Kashidashiの新機能やアップデートに関する連絡</li>
          </ol>
          <h1>開発について</h1>
          <h2>作るにあたって</h2>
          <p>Kashidashiは私（501A）によって作成されたウェブアプリです。</p>
          <AlignItems justifyContent={'space-between'}>
            <h3>開発状況・学び</h3>
            <Button
              onClick={() => router.push('https://zenn.dev/501a/scraps/4dd98c022a4577')}
            >
              Zennで開く
            </Button>
          </AlignItems>

          <h2>ソースコード</h2>
          <p>興味ある方はGitHubからソースコードを閲覧することができます。</p>
          <AlignItems>
            <Button icon={<FiGithub/>}>GitHubでソースコードを見る</Button>
            <Button icon={<FiTwitter/>}>開発者のツイッター</Button>
          </AlignItems>
        </section>
      </main>
      <Footer/>
    </>
  )
}
