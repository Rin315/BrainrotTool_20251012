const images = [
    { src: './img/fishini.png', name: 'フィッシーニボッシーニ', value: 0, rarity: 'Common' },
    { src: './img/lirili.png', name: 'リリリラリラ', value: 0, rarity: 'Common' },
    { src: './img/timcheese.png', name: 'チムチーズ', value: 0, rarity: 'Common' },
    { src: './img/fluri.png', name: 'フルリハルラ(サングラスペンギン)', value: 0, rarity: 'Common' },
    { src: './img/penguino.png', name: 'ペンギーノココシン', value: 0, rarity: 'Common' },
    { src: './img/svinina.png', name: '爆弾豚', value: 0, rarity: 'Common' },
    { src: './img/pipikiwi.png', name: 'ピピキウイ', value: 0, rarity: 'Common' },
    { src: './img/pipiavo.png', name: 'ピピアボカド', value: 0, rarity: 'Common' },
    { src: './img/trippitroppi.png', name: 'トリッピトロッピ', value: 0, rarity: 'Common' },
    { src: './img/tung3.png', name: 'タンタンタン', value: 0, rarity: 'Common' },
    { src: './img/gangster.png', name: 'ギャングスター', value: 0, rarity: 'Common' },
    { src: './img/boneca.png', name: 'タイヤ', value: 0, rarity: 'Common' },
    { src: './img/pipicorni.png', name: 'とうもろこし', value: 0, rarity: 'Common' },
    { src: './img/ta4.png', name: 'タタタタサフー', value: 0, rarity: 'Common' },
    { src: './img/burballoni.png', name: 'スイカカピバラ', value: 0, rarity: 'Common' },
    { src: './img/pipipoteto.png', name: 'ピピポテト', value: 0, rarity: 'Common' },
    { src: './img/cappuccinoasa.png', name: 'カプチーノアサシーノ', value: 0, rarity: 'Common' },
    { src: './img/brrbrr.png', name: 'ブルーブルーパタピン', value: 0, rarity: 'Common' },
    { src: './img/trulimero.png', name: 'トロリメーロトロリチーナ', value: 0, rarity: 'Common' },
    { src: './img/banananita.png', name: 'バナナイルカ', value: 0, rarity: 'Common' },
    { src: './img/loslirili.png', name: 'ロス象', value: 0, rarity: 'Common' },
    { src: './img/salamino.png', name: 'サラミーロペンギン', value: 0, rarity: 'Common' },
    { src: './img/trictrac.png', name: 'トリックトラックバナブーム', value: 0, rarity: 'Common' },
    { src: './img/lostung.png', name: 'ロスタンタン', value: 0, rarity: 'Common' },
    { src: './img/tukanno.png', name: 'ツカンノバナナ(鳥)', value: 0, rarity: 'Common' },
    { src: './img/bluberrinni.png', name: 'ブルーベリー', value: 0, rarity: 'Common' },
    { src: './img/spijuniro.png', name: 'ペンギン', value: 0, rarity: 'Common' },
    { src: './img/gingobalo.png', name: 'リンゴ豚', value: 0, rarity: 'Common' },
    { src: './img/burbalona.png', name: 'バーバローナ', value: 0, rarity: 'Common' },
    { src: './img/chimpanzini.png', name: 'チンパンジーバナナ', value: 0, rarity: 'Common' },
    { src: './img/ballerina.png', name: 'バレリーナカプチーノ', value: 0, rarity: 'Common' },
    { src: './img/chef.png', name: 'シェフカタブラ', value: 0, rarity: 'Common' },
    { src: './img/glorbo.png', name: 'スイカワニ', value: 0, rarity: 'Common' },
    { src: './img/cacto.png', name: 'サボテンカバ', value: 0, rarity: 'Common' },
    { src: './img/ballerinolo.png', name: 'バレリーナムキムキ', value: 0, rarity: 'Common' },
    { src: './img/leru.png', name: 'レルレルレルレ', value: 0, rarity: 'Common' },
    { src: './img/bambinic.png', name: 'クロワッサンキツネ', value: 0, rarity: 'Common' },
    { src: './img/france.png', name: 'フランシスコ(メガネブロッコリー)', value: 0, rarity: 'Common' },
    { src: './img/zibra.png', name: 'スイカシマウマ', value: 0, rarity: 'Common' },
    { src: './img/bambu.png', name: '竹ぶた', value: 0, rarity: 'Common' },
    { src: './img/mangolini.png', name: 'マンゴー鳥', value: 0, rarity: 'Common' },
    { src: './img/leoraion.png', name: 'サボテンライオン', value: 0, rarity: 'Common' },
    // Mythic
    { src: './img/frigo.png', name: 'フリゴカメロ', value: 0, rarity: 'Common' },
    { src: './img/orangutini.png', name: 'パイナップルゴリラ', value: 0, rarity: 'Common' },
    { src: './img/bambardiro.png', name: 'ボンバラティーノクロコディーノ', value: 0, rarity: 'Common' },
    { src: './img/bombombini.png', name: 'ボンボンビーニグシン', value: 0, rarity: 'Common' },
    { src: './img/gorillo.png', name: 'スイカゴリラ', value: 0, rarity: 'Common' },
    { src: './img/sigma.png', name: 'シグマボーイ', value: 0, rarity: 'Common' },
    { src: './img/matteo.png', name: 'マテヨー', value: 0, rarity: 'Common' },
    { src: './img/losspi.png', name: 'ロスひよこ', value: 0, rarity: 'Common' },
    { src: './img/rhino.png', name: 'トースターサイ', value: 0, rarity: 'Common' },
    { src: './img/ganganze.png', name: 'ガンガンゼーニ', value: 0, rarity: 'Common' },
    { src: './img/te3.png', name: 'テテテサフー(合成限定)', value: 0, rarity: 'Common' },
    { src: './img/strawberre.png', name: 'ストロベリーフラミンゴ', value: 0, rarity: 'Common' },
    { src: './img/elefantino.png', name: '冷蔵庫ゾウ', value: 0, rarity: 'Common' },
    { src: './img/to3.png', name: 'トトトサフー(細長いやつ)', value: 0, rarity: 'Common' },
    { src: './img/antonio.png', name: 'アントニオー', value: 0, rarity: 'Common' },//アントニオ
    { src: './img/girafa.png', name: 'スイカキリン(合成限定)', value: 0, rarity: 'Common' },
    { src: './img/mypepper.png', name: 'マイペッパーミント(クリスマス合成限定)', value: 0, rarity: 'Common' },
    { src: './img/perochello.png', name: 'レモン鳥(グランデラッキーロット)', value: 0, rarity: 'Common' },
    { src: './img/tang.png', name: 'タンタンタンカラタン', value: 0, rarity: 'Common' },
    { src: './img/patapimus.png', name: '戦士', value: 0, rarity: 'Common' },
    { src: './img/tirilikalika.png', name: '室外機ニワトリ', value: 0, rarity: 'Common' },//室外機
    { src: './img/santonio.png', name: 'サントニオー(クリスマス合成限定)', value: 0, rarity: 'Common' },
    { src: './img/losmateo.png', name: 'ロスマテオ', value: 0, rarity: 'Common' }, //ロスマテオ
    { src: './img/fishinis.png', name: 'フィーシーニ2人(クリスマス合成限定)', value: 0, rarity: 'Common' },


    //　Brainrot Got
    { src: './img/cocofanto.png', name: 'ココファント', value: 10, rarity: 'BrainrotGot' },
    { src: './img/tob.png', name: 'トットビ', value: 25, rarity: 'BrainrotGot' },
    { src: './img/tralalero.png', name: 'トララ', value: 50, rarity: 'BrainrotGot' },
    { src: './img/Odin.png', name: 'オディンディン', value: 75, rarity: 'BrainrotGot' },
    { src: './img/chache.png', name: '机', value: 80, rarity: 'BrainrotGot' },//机
    { src: './img/Espressona.png', name: 'エスプレッソ', value: 90, rarity: 'BrainrotGot' },
    { src: './img/lavaca.png', name: 'ラバッカ', value: 100, rarity: 'BrainrotGot' },
    { src: './img/ecco.png', name: 'ウマオルガン', value: 110, rarity: 'BrainrotGot' },
    { src: './img/losvaguitas.png', name: 'ロスラバッカ(合成限定)', value: 115, rarity: 'BrainrotGot' },
    { src: './img/bulbito.png', name: 'ボルビトバンビートトラックリート', value: 120, rarity: 'BrainrotGot' },
    { src: './img/banana.png', name: 'サングラスバナナ', value: 120, rarity: 'BrainrotGot' },
    { src: './img/chillin.png', name: 'チリンチリン', value: 130, rarity: 'BrainrotGot' },
    { src: './img/trippi.png', name: 'ピラニア', value: 130, rarity: 'BrainrotGot' },//ピラニア
    { src: './img/brri.png', name: 'ブリブリ戦士', value: 135, rarity: 'BrainrotGot' },
    { src: './img/ciocco.png', name: 'チョコレートパンチョンチョーニ', value: 140, rarity: 'BrainrotGot' },
    { src: './img/brrestrh.png', name: 'ジュース', value: 145, rarity: 'BrainrotGot' },
    { src: './img/torrtuginni.png', name: 'トゲゾー', value: 150, rarity: 'BrainrotGot' },
    { src: './img/losbros.png', name: 'ロスブロス', value: 155, rarity: 'BrainrotGot' },
    { src: './img/bambini.png', name: 'バンビーニ戦車', value: 160, rarity: 'BrainrotGot' },
    { src: './img/hoccci.png', name: 'ケーキ(クリスマス合成限定)', value: 167, rarity: 'BrainrotGot' },
    { src: './img/jiqi.png', name: '時計', value: 165, rarity: 'BrainrotGot' },//時計
    { src: './img/los.png', name: 'ロスワニ', value: 170, rarity: 'BrainrotGot' },
    { src: './img/agarrini.png', name: 'スコップ', value: 175, rarity: 'BrainrotGot' },//スコップ
    { src: './img/alessio.png', name: 'アレシオー', value: 180, rarity: 'BrainrotGot' },
    { src: './img/karkerkar.png', name: 'イス', value: 190, rarity: 'BrainrotGot' },
    { src: './img/piccionetama.png', name: 'ハト女', value: 200, rarity: 'BrainrotGot' },
    { src: './img/popcon.png', name: 'ポップコーンチャリ', value: 205, rarity: 'BrainrotGot' },
    { src: './img/iipiccione.png', name: 'ムキムキハト', value: 210, rarity: 'BrainrotGot' },
    { src: './img/nomypresent.png', name: 'ノーマイプレゼント(クリスマス合成限定)', value: 215, rarity: 'BrainrotGot' },
    { src: './img/jobjobjob.png', name: 'ジョブジョブ', value: 220, rarity: 'BrainrotGot' },//Job
    { src: './img/lassis.png', name: 'ラスシス', value: 230, rarity: 'BrainrotGot' },//姉妹
    { src: './img/iimastodontico.png', name: 'テレビサッカー', value: 240, rarity: 'BrainrotGot' },//テレビサッカー
    { src: './img/loschristmas.png', name: 'ロスクリスマス(クリスマス合成限定)', value: 245, rarity: 'BrainrotGot' },
    { src: './img/malame.png', name: 'マラメアラメ', value: 250, rarity: 'BrainrotGot' },
    { src: './img/belugelo.png', name: 'ベルーガ', value: 270, rarity: 'BrainrotGot' },
    { src: './img/bellaca.png', name: 'クリスマス犬(クリスマス合成限定)', value: 275, rarity: 'BrainrotGot' },
    { src: './img/miss.png', name: 'ロケット', value: 300, rarity: 'BrainrotGot' },//ロケット

    //　Secret
    { src: './img/lostralaletitos.png', name: 'ロストララ男', value: 200, rarity: 'Secret' },
    { src: './img/lostralaleritas.png', name: 'ロストララ女', value: 200, rarity: 'Secret' },
    { src: './img/trenostruzzo.png', name: '汽車鳥', value: 300, rarity: 'Secret' },
    { src: './img/kravilino.png', name: 'トンカチ', value: 375, rarity: 'Secret' },
    { src: './img/losorcaleritos.png', name: 'ロスオルカ', value: 400, rarity: 'Secret' },
    { src: './img/loscouples.png', name: 'ロスカップル', value: 450, rarity: 'Secret' },
    { src: './img/piccione.png', name: 'ハト', value: 500, rarity: 'Secret' },
    { src: './img/peely.png', name: 'ピーリー', value: 500, rarity: 'Secret' },
    { src: './img/pakrah_w.png', name: 'えんぴつ女', value: 550, rarity: 'Secret' },//鉛筆女
    { src: './img/pakrah.png', name: 'えんぴつ', value: 600, rarity: 'Secret' },
    { src: './img/losjob.png', name: 'ロスジョブ', value: 700, rarity: 'Secret' },
    { src: './img/4000.png', name: '新幹線鳥', value: 700, rarity: 'Secret' },//4000
    { src: './img/Babel.png', name: 'アンパリーバベル', value: 800, rarity: 'Secret' },
    { src: './img/losisu.png', name: 'ロスイス', value: 900, rarity: 'Secret' },//ロス椅子
    { src: './img/orcalero.png', name: 'オルカ', value: 1000, rarity: 'Secret' },
    { src: './img/frog.png', name: 'カエル', value: 1200, rarity: 'Secret' },
    { src: './img/ketchuru.png', name: 'ケチュマチュ', value: 1500, rarity: 'Secret' },
    { src: './img/pothotspotona.png', name: '骨女', value: 1700, rarity: 'Secret' },//女骨
    { src: './img/pothotspot.png', name: '骨', value: 2000, rarity: 'Secret' },
    { src: './img/21.png', name: '21', value: 2100, rarity: 'Secret' },
    { src: './img/losmobilis.png', name: 'ロスモバイル', value: 2200, rarity: 'Secret' },
    { src: './img/nomyhotspot.png', name: 'ノーマイ', value: 2500, rarity: 'Secret' },
    { src: './img/elf3.png', name: 'エルフエルフ(クリスマス合成限定)', value: 2700, rarity: 'Secret' },
    { src: './img/garamarama.png', name: 'ガラマ', value: 3000, rarity: 'Secret' },
    { src: './img/pirulitoita.png', name: 'ペロペロキャンディー', value: 3500, rarity: 'Secret' },//飴
    { src: './img/iisacro.png', name: '合成ヤギ', value: 4000, rarity: 'Secret' },
    { src: './img/chari2.png', name: 'チャリ女', value: 4500, rarity: 'Secret' },
    { src: './img/lagrande.png', name: 'ラグランデ', value: 5000, rarity: 'Secret' },//ラグランデ
    { src: './img/lossanta.png', name: 'ロスサンタ', value: 5500, rarity: 'Secret' },
    { src: './img/legolem.png', name: '合成のロボ', value: 6000, rarity: 'Secret' },
    { src: './img/67.png', name: '67', value: 6700, rarity: 'Secret' },
    { src: './img/loshouse.png', name: 'ロス家', value: 7000, rarity: 'Secret' },
    { src: './img/Coccoblade.png', name: 'ココバルーデ', value: 7500, rarity: 'Secret-' },//数字仮
    { src: './img/chicleteira.png', name: 'チャリ', value: 8000, rarity: 'Secret' },
    { src: './img/lachristmas.png', name: 'クリスマスラグランデ(クリスマス合成限定)', value: 9000, rarity: 'Secret' },//クリスマスラグランデ
    { src: './img/pad.png', name: 'ケパット', value: 10000, rarity: 'Secret' },
    { src: './img/dulduldul.png', name: 'サル', value: 12000, rarity: 'Secret' },
    { src: './img/WorL.png', name: 'WorL', value: 13000, rarity: 'Secret' },
    { src: './img/cookipad.png', name: 'クッキーパット', value: 14000, rarity: 'Secret-' },
    { src: './img/losgarama.png', name: 'ロスガラマ', value: 12000, rarity: 'Secret-' },
    { src: './img/kaerutoire.png', name: 'カエルトイレ', value: 12000, rarity: 'Secret-' },
    { src: './img/ie.png', name: '家', value: 12000, rarity: 'Secret-' },
    { src: './img/pitiata.png', name: '竜', value: 12000, rarity: 'Secret-' },
    { src: './img/yule.png', name: 'ツリートナカイ(クリスマス合成限定)', value: 12000, rarity: 'Secret-' },
    { src: './img/chinpanking.png', name: 'チンパンジニーキング', value: 25000, rarity: 'Secret' },//チンパンジー
    { src: './img/25.png', name: '25(クリスマス合成限定)', value: 25000, rarity: 'Secret-' },
    { src: './img/itigozou.png', name: 'ストロベリーエレファント', value: 12000, rarity: 'Secret-' },
    { src: './img/klombo.png', name: 'クロムボ', value: 12000, rarity: 'Secret-' },
    { src: './img/shtekerito.png', name: '電球', value: 12000, rarity: 'Secret-' },
    { src: './img/spageti.png', name: 'スパゲティトイレ', value: 12000, rarity: 'Secret-' },
    { src: './img/santani.png', name: 'サンタツリー(クリスマス合成限定)', value: 12000, rarity: 'Secret-' },//サンタニ
    { src: './img/cabritos.png', name: 'ヤギ2人', value: 12000, rarity: 'Secret-' },//ヤギ2人
    { src: './img/doragon.png', name: 'ドラゴン', value: 12000, rarity: 'Secret-' },
    { src: './img/lacrazy.png', name: 'ラクレイジー', value: 12000, rarity: 'Secret-' },
    { src: './img/kumo.png', name: 'クモ', value: 12000, rarity: 'Secret-' },
    { src: './img/track.png', name: 'トラック', value: 12000, rarity: 'Secret-' },
    { src: './img/toire.png', name: 'スケビティートイレ', value: 12000, rarity: 'Secret-' },










];
