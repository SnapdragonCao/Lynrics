import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { 
  insertWord, 
  insertLyrics, 
  deleteWord, 
  deleteLyrics, 
  listWords,
  listLyricsTitle,
  clearWords,
  clearLyrics,
  showLyrics
} from "~/utils/utils.server";
import { getUserId } from "~/utils/session.server";
import { requireUserId } from "../utils/session.server";

export async function loader({ request }) {
  // await Promise.all(testCases2.map(lyrics => insertLyrics(lyrics)));
  // await insertWord(testCases[2]);
  // await insertWord(testCases[1]);
  // await insertWord(testCases[0]);
  // await deleteLyrics({ userId: 2, url: "https://www.google.com/" });
  // const results = await listLyricsTitle({userId: 1});
  // return json(results);
  const userId = await requireUserId({request});
  console.log(userId);
  return null;
}

export async function action({ request }) {
  console.log("enter the action part");
  console.dir(request)
  // const formData = await request.formData();
  // const lyricsId = formData.get("lyricsId");
  // const lyrics = await showLyrics(lyricsId);
  // return json(lyrics);
  return null;
}

export default function Test() {

  const results = useLoaderData();
  const lyrics = useActionData();

  const updateOne = {
    acknowledged: true,
    modifiedCount: 0,
    upsertedId: "ObjectId",
    upsertedCount: 1,
    matchedCount: 0
  }

  const findOneAndUpdate = {
    lastErrorObject: { n: 1, updatedExisting: true },
    value: {
      _id: "ObjectId",
      userId: 1,
      word: '你好'
    },
    ok: 1
  }

  const findOneAndUpdate2 = {
    lastErrorObject: {
      n: 1,
      updatedExisting: false,
      upserted: "ObjectId"
    },
    value: null,
    ok: 1
  }

  const lyricsTitle = {
    title:'',
    artist:'',
    url:'',
    coverart:'',
    lyrics:'', 
    userId:'',
  }

  const temp = (
    <form method="get" action="/results/Shirushi/lyrics" enctype="application/x-www-form-urlencoded">
      <button type="submit">
        <img src="https://is2-ssl.mzstatic.com/image/thumb/Music124/v4/d2/e2/99/d2e29967-83b7-9ea3-761a-3373cd204098/jacket_SVWC70060B00Z_550.jpg/400x400cc.jpg" width="140" height="140" alt="Shirushi" />
        <input name="title" readonly="" value="Shirushi" />
        <input name="artist" readonly="" value="LiSA" />
        <p><a href="/results/https://www.shazam.com/track/163082089/%E3%82%B7%E3%83%AB%E3%82%B7">Open in Shazam</a></p>
      </button>
    </form>
  )

  const resultFromIkiru = {
    highlightsurls: {},
    hub: {
      displayname: 'APPLE MUSIC',
      explicit: false,
      image: 'https://images.shazam.com/static/icons/hub/android/v5/applemusic_{scalefactor}.png',        
      options: [ [Object] ],
      providers: [ [Object], [Object], [Object] ],
      type: 'APPLEMUSIC'
    },
    key: '51806470',
    layout: '5',
    sections: [
      { metadata: [Array], metapages: [], tabname: 'Song', type: 'SONG' },
      {
        tabname: 'Video',
        type: 'VIDEO',
        youtubeurl: 'https://cdn.shazam.com/video/v3/-/US/android/51806470/youtube/video?q=Tokyo+Jihen+%22Ikiru%22'
      }
    ],
    share: {
      href: 'https://www.shazam.com/track/51806470/ikiru',
      html: 'https://www.shazam.com/snippets/email-share/51806470?lang=en&country=US',
      snapchat: 'https://www.shazam.com/partner/sc/track/51806470',
      subject: 'Ikiru - Tokyo Jihen',
      text: 'I used Shazam to discover Ikiru by Tokyo Jihen.',
      twitter: 'I used @Shazam to discover Ikiru by Tokyo Jihen.'
    },
    subtitle: 'Tokyo Jihen',
    title: 'Ikiru',
    type: 'MUSIC',
    url: 'https://www.shazam.com/track/51806470/ikiru',
    urlparams: { '{trackartist}': 'Tokyo+Jihen', '{tracktitle}': 'Ikiru' }
  }

  const resultTranslation = [
    {
      "normalizedSource": "fly",
      "displaySource": "fly",
      "translations": [
        {
          "normalizedTarget": "volar",
          "displayTarget": "volar",
          "posTag": "VERB",
          "confidence": 0.4081,
          "prefixWord": "",
          "backTranslations": [
            {
              "normalizedText": "fly",
              "displayText": "fly",
              "numExamples": 15,
              "frequencyCount": 4637
            },
            {
              "normalizedText": "flying",
              "displayText": "flying",
              "numExamples": 15,
              "frequencyCount": 1365
            },
            {
              "normalizedText": "blow",
              "displayText": "blow",
              "numExamples": 15,
              "frequencyCount": 503
            },
            {
              "normalizedText": "flight",
              "displayText": "flight",
              "numExamples": 15,
              "frequencyCount": 135
            }
          ]
        },
        {
          "normalizedTarget": "mosca",
          "displayTarget": "mosca",
          "posTag": "NOUN",
          "confidence": 0.2668,
          "prefixWord": "",
          "backTranslations": [
            {
              "normalizedText": "fly",
              "displayText": "fly",
              "numExamples": 15,
              "frequencyCount": 1697
            },
            {
              "normalizedText": "flyweight",
              "displayText": "flyweight",
              "numExamples": 0,
              "frequencyCount": 48
            },
            {
              "normalizedText": "flies",
              "displayText": "flies",
              "numExamples": 9,
              "frequencyCount": 34
            }
          ]
        },
        {
          "normalizedTarget": "operan",
          "displayTarget": "operan",
          "posTag": "VERB",
          "confidence": 0.1144,
          "prefixWord": "",
          "backTranslations": [
            {
              "normalizedText": "operate",
              "displayText": "operate",
              "numExamples": 15,
              "frequencyCount": 1344
            },
            {
              "normalizedText": "fly",
              "displayText": "fly",
              "numExamples": 1,
              "frequencyCount": 422
            }
          ]
        },
        {
          "normalizedTarget": "pilotar",
          "displayTarget": "pilotar",
          "posTag": "VERB",
          "confidence": 0.095,
          "prefixWord": "",
          "backTranslations": [
            {
              "normalizedText": "fly",
              "displayText": "fly",
              "numExamples": 15,
              "frequencyCount": 104
            },
            {
              "normalizedText": "pilot",
              "displayText": "pilot",
              "numExamples": 15,
              "frequencyCount": 61
            }
          ]
        },
        {
          "normalizedTarget": "moscas",
          "displayTarget": "moscas",
          "posTag": "VERB",
          "confidence": 0.0644,
          "prefixWord": "",
          "backTranslations": [
            {
              "normalizedText": "flies",
              "displayText": "flies",
              "numExamples": 15,
              "frequencyCount": 1219
            },
            {
              "normalizedText": "fly",
              "displayText": "fly",
              "numExamples": 15,
              "frequencyCount": 143
            }
          ]
        },
        {
          "normalizedTarget": "marcha",
          "displayTarget": "marcha",
          "posTag": "NOUN",
          "confidence": 0.0514,
          "prefixWord": "",
          "backTranslations": [
            {
              "normalizedText": "march",
              "displayText": "March",
              "numExamples": 15,
              "frequencyCount": 5355
            },
            {
              "normalizedText": "up",
              "displayText": "up",
              "numExamples": 15,
              "frequencyCount": 1277
            },
            {
              "normalizedText": "running",
              "displayText": "running",
              "numExamples": 15,
              "frequencyCount": 752
            },
            {
              "normalizedText": "going",
              "displayText": "going",
              "numExamples": 15,
              "frequencyCount": 570
            },
            {
              "normalizedText": "fly",
              "displayText": "fly",
              "numExamples": 15,
              "frequencyCount": 253
            }
          ]
        }
      ]
    }
  ]

  return (
    <>
      <p>
        This page is used to test the http request sent by other routers<br />
        and should be removed in official product.
      </p>
      <ul>
        {results && results.map(result => (
          <li key={result._id}>
            <ul>
            <img src={result.coverart} alt={result.title} />
            <li>{result.title}</li>
            <li>{result.artist}</li>
            <li>{result.url}</li>
            <Form method="post">
              <input name="lyricsId" value={result._id} readOnly/>
              <button type="submit">Submit</button>
            </Form>
            </ul>
          </li>
        ))}
      </ul>
      <pre>{lyrics}</pre>
    </>
  )
}

const testCases1 = [
  {
    userId: 1,
    word: "Hello"
  },
  {
    userId: 1,
    word: "你好"
  },
  {
    userId: 1,
    word: "こんにちは"
  },
]

const testCases2 = [
  {
    userId: 2,
    title: "Greatest Works of Art",
    artist: "Jay Chou",
    url: "https://www.google.com/",
    coverart: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
    lyrics: `
    [周杰倫「最偉大的作品」歌詞]
    
    [主歌 1]
    哥穿著復古西裝
    拿著手杖彈著魔法樂章
    漫步走在莎瑪麗丹
    被歲月翻新的時光
    望不到邊界的帝國
    用音符築成的王座
    我用琴鍵穿梭
    一九二零錯過的不朽 (Ahh)
    偏執是那馬格利特
    被我變出的蘋果
    超現實的是我
    還是他原本想畫的小丑
    不是煙斗的煙斗
    臉上的鴿子沒有飛走
    請你記得他是個畫家
    不是什麼調酒
    達利翹鬍是誰給他的思索 (思索)
    彎了湯匙借你靈感不用還我 (還我)
    融化的是牆上時鐘還是乳酪
    龍蝦電話那頭你都不回我 (Ha)
    浪蕩是世俗畫作裡
    最自由不拘的水墨
    花都優雅的雙腿
    是這宇宙筆下的一抹
    飄洋過海的鄉愁
    種在一無所有的溫柔
    寂寞的枝頭才能長出
    常玉要的花朵
    [副歌]
    小船靜靜往返
    馬諦斯的海岸
    星空下的夜晚
    交給梵谷點燃
    夢美的太短暫
    孟克橋上吶喊
    這世上的熱鬧
    出自孤單
    
    [間奏]
    
    [主歌 2]
    花園流淌的陽光
    空氣搖晃著花香
    我請莫內幫個忙
    能不能來張自畫像
    大師眺望著遠方
    研究色彩的形狀
    突然回頭要我說
    說我對我自己的印象 (Ahh, ahh)
    世代的狂 音樂的王
    萬物臣服在我樂章
    路還在闖 我還在創
    指尖的旋律在渴望
    世代的狂 音樂的王
    我想我不需要畫框
    它框不住 琴鍵的速度
    我的音符全部是未來藝術
    日出在印象的港口來回
    光線喚醒了睡著的花葉
    草地正為一場小雨歡悅
    我們彼此深愛這個世界
    停在康橋上的那隻蝴蝶 (Ooh-oooh)
    飛往午夜河畔的翡冷翠 (Ooh-oooh)
    遺憾被偶然藏在了詩頁 (Ooh-oooh)
    是微笑都透不進的世界 (Ooh-oooh)
    巴黎的鱗爪 感傷的文法
    要用音樂翻閱
    晚風的燈下 旅人的花茶
    我換成了咖啡
    之後他就愛上了
    苦澀這個複雜詞彙
    因為這才是揮手
    向雲彩道別的滋味
    
    [副歌]
    小船靜靜往返
    馬諦斯的海岸
    星空下的夜晚
    交給梵谷點燃
    夢美的太短暫
    孟克橋上吶喊
    這世上的熱鬧
    出自孤單`
  },
  {
    userId: 1,
    title: "Greatest Works of Art",
    artist: "Jay Chou",
    url: "https://www.google.com/",
    coverart: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
    lyrics: `
    [周杰倫「最偉大的作品」歌詞]
    
    [主歌 1]
    哥穿著復古西裝
    拿著手杖彈著魔法樂章
    漫步走在莎瑪麗丹
    被歲月翻新的時光
    望不到邊界的帝國
    用音符築成的王座
    我用琴鍵穿梭
    一九二零錯過的不朽 (Ahh)
    偏執是那馬格利特
    被我變出的蘋果
    超現實的是我
    還是他原本想畫的小丑
    不是煙斗的煙斗
    臉上的鴿子沒有飛走
    請你記得他是個畫家
    不是什麼調酒
    達利翹鬍是誰給他的思索 (思索)
    彎了湯匙借你靈感不用還我 (還我)
    融化的是牆上時鐘還是乳酪
    龍蝦電話那頭你都不回我 (Ha)
    浪蕩是世俗畫作裡
    最自由不拘的水墨
    花都優雅的雙腿
    是這宇宙筆下的一抹
    飄洋過海的鄉愁
    種在一無所有的溫柔
    寂寞的枝頭才能長出
    常玉要的花朵
    [副歌]
    小船靜靜往返
    馬諦斯的海岸
    星空下的夜晚
    交給梵谷點燃
    夢美的太短暫
    孟克橋上吶喊
    這世上的熱鬧
    出自孤單
    
    [間奏]
    
    [主歌 2]
    花園流淌的陽光
    空氣搖晃著花香
    我請莫內幫個忙
    能不能來張自畫像
    大師眺望著遠方
    研究色彩的形狀
    突然回頭要我說
    說我對我自己的印象 (Ahh, ahh)
    世代的狂 音樂的王
    萬物臣服在我樂章
    路還在闖 我還在創
    指尖的旋律在渴望
    世代的狂 音樂的王
    我想我不需要畫框
    它框不住 琴鍵的速度
    我的音符全部是未來藝術
    日出在印象的港口來回
    光線喚醒了睡著的花葉
    草地正為一場小雨歡悅
    我們彼此深愛這個世界
    停在康橋上的那隻蝴蝶 (Ooh-oooh)
    飛往午夜河畔的翡冷翠 (Ooh-oooh)
    遺憾被偶然藏在了詩頁 (Ooh-oooh)
    是微笑都透不進的世界 (Ooh-oooh)
    巴黎的鱗爪 感傷的文法
    要用音樂翻閱
    晚風的燈下 旅人的花茶
    我換成了咖啡
    之後他就愛上了
    苦澀這個複雜詞彙
    因為這才是揮手
    向雲彩道別的滋味
    
    [副歌]
    小船靜靜往返
    馬諦斯的海岸
    星空下的夜晚
    交給梵谷點燃
    夢美的太短暫
    孟克橋上吶喊
    這世上的熱鬧
    出自孤單`
  },
  {
    userId: 1,
    title: "Shirushi",
    artist: "LiSA",
    url: "https://www.baidu.com/",
    coverart: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
    lyrics: `
    [LiSA「シルシ」歌詞]

    「バース１」
    街明かり照らした　賑やかな笑い声と
    路地裏の足跡
    伝えたい想いは　どれだけ届いたんだろう
    いつも振り向いて確かめる

    「ポストコーラス」
    いつだって迷わず　キミはきっとどんなボクも追
    かけてくれるから

    「コーラス」
    じっと見つめた　キミの瞳に
    映ったボクが生きたシルシ
    何度も途切れそうな鼓動
    強く強く鳴らした　今日を越えてみたいんだ

    「バース２」
    手にした幸せを　失うことを恐れて
    立ち止まっているより
    一つ一つ大きな　出来るだけ多くの
    笑顔咲かせようと　たくらむ

    「ポストコーラス」
    思い出す　ボクらの　通り過ぎた日々
    がいつも輝いて見える様に

    「コーラス」
    ぎゅっと握った　キミの温もりで
    感じた　ボクら繋いだ証
    キミと今同じ速さで
    あの日描いた未来を　歩いている

    「ブリッジ」
    いくつ願い叶えても
    キミと過ごしたい新しい明日をすぐに
    次々にボクは
    きっとまた願ってしまうから

    「コーラス」
    流れてく時間は容赦無く
    いつかボクらをさらってくから
    瞬きした一瞬の隙に
    キミの見せる全てを見落とさないように

    じっと見つめた　キミの瞳に映った
    ボクが生きたシルシ、あ
    何度も途切れそうな鼓動
    強く強く鳴らした
    今日を越えていけなくても
    キミと生きた今日をボクは忘れない`
  },
  {
    userId: 1,
    title: "The Adult Code",
    artist: "Sheena Ringo",
    url: "https://www.bing.com/?mkt=zh-CN",
    coverart: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
    lyrics: `
    Sighs in the blackest black abiding
    As soon as one dies, one is rising
    With the night so dark and cold
    The wishes I make are swallowed up and hidden away
    Breath of the whitest white is
    What I most with to say down deep now inside
    Can a voice so numb and cold have some song to sing?
    It could be false, or reality
    The things I like, or hate, or things I want to gain
    Whatever's feeling good is what my lines would say
    For setting off the black from white, it'd work perfectly
    Though like a chant of ruination it'd be
    Why did I think that since I'd studied
    The latest schoolbook I'd know clearly
    What's right from what's wrong, and which is which one
    That I could choose, I could really know?
    I live according to stage-right, stage-left, exit
    Improvisation's not been in my bag of tricks
    So much of what I want to say pours out noisily
    But never when you're not here alone with me

    What I know that I hold in my hands I want to set free
    Think of how much lighter you and I would feel then
    Every word, every wall, every curse and sparing nothing, strip it
    Take it all away to once again see eye to eye

    The things I like, or hate, or things I want, expect
    Though if I let them out, I think, what happens next?
    Well, setting off the white from black is fearful indeed
    It's even more so when you live honestly

    This life is long, so long, the world is wide, I say
    And when we've freedom won, it all becomes one gray
    Yes, happiness, unhappiness, it's only the heart
    That knows no quietude that makes itself known
    While an adult can keep a secret alone`
  },
]