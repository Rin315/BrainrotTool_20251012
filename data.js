const images = [
    //
    { src: './img/fishini.png', name: 'fishini', value: 0, rarity: 'Common' },
    { src: './img/lirili.png', name: 'lirili', value: 0, rarity: 'Common' },
    { src: './img/timcheese.png', name: 'timcheese', value: 0, rarity: 'Common' },
    { src: './img/fluri.png', name: 'fluri', value: 0, rarity: 'Common' },
    { src: './img/penguino.png', name: 'penguino', value: 0, rarity: 'Common' },
    { src: './img/svinina.png', name: 'svinina', value: 0, rarity: 'Common' },
    { src: './img/pipikiwi.png', name: 'pipikiwi', value: 0, rarity: 'Common' },
    { src: './img/pipiavo.png', name: 'pipiavo', value: 0, rarity: 'Common' },
    { src: './img/trippitroppi.png', name: 'trippitroppi', value: 0, rarity: 'Common' },
    { src: './img/tung3.png', name: 'tung3', value: 0, rarity: 'Common' },
    { src: './img/gangster.png', name: 'gangster', value: 0, rarity: 'Common' },
    { src: './img/boneca.png', name: 'boneca', value: 0, rarity: 'Common' },
    { src: './img/pipicorni.png', name: 'pipicorni', value: 0, rarity: 'Common' },
    { src: './img/ta4.png', name: 'ta4', value: 0, rarity: 'Common' },
    { src: './img/burballoni.png', name: 'burballoni', value: 0, rarity: 'Common' },
    { src: './img/pipipoteto.png', name: 'pipipoteto', value: 0, rarity: 'Common' },
    { src: './img/cappuccinoasa.png', name: 'cappuccinoasa', value: 0, rarity: 'Common' },
    { src: './img/brrbrr.png', name: 'brrbrr', value: 0, rarity: 'Common' },
    { src: './img/trulimero.png', name: 'trulimero', value: 0, rarity: 'Common' },
    { src: './img/banananita.png', name: 'banananita', value: 0, rarity: 'Common' },
    { src: './img/loslirili.png', name: 'loslirili', value: 0, rarity: 'Common' },
    { src: './img/salamino.png', name: 'salamino', value: 0, rarity: 'Common' },
    { src: './img/trictrac.png', name: 'trictrac', value: 0, rarity: 'Common' },
    { src: './img/lostung.png', name: 'lostung', value: 0, rarity: 'Common' },
    { src: './img/tukanno.png', name: 'tukanno', value: 0, rarity: 'Common' },
    { src: './img/bluberrinni.png', name: 'bluberrinni', value: 0, rarity: 'Common' },
    { src: './img/spijuniro.png', name: 'spijuniro', value: 0, rarity: 'Common' },
    { src: './img/gingobalo.png', name: 'gingobalo', value: 0, rarity: 'Common' },
    { src: './img/burbalona.png', name: 'burbalona', value: 0, rarity: 'Common' },
    { src: './img/chimpanzini.png', name: 'chimpanzini', value: 0, rarity: 'Common' },
    { src: './img/ballerina.png', name: 'ballerina', value: 0, rarity: 'Common' },
    { src: './img/chef.png', name: 'chef', value: 0, rarity: 'Common' },
    { src: './img/glorbo.png', name: 'glorbo', value: 0, rarity: 'Common' },
    { src: './img/cacto.png', name: 'cacto', value: 0, rarity: 'Common' },
    { src: './img/ballerinolo.png', name: 'ballerinolo', value: 0, rarity: 'Common' },
    { src: './img/leru.png', name: 'leru', value: 0, rarity: 'Common' },
    { src: './img/bambinic.png', name: 'bambinic', value: 0, rarity: 'Common' },
    { src: './img/france.png', name: 'france', value: 0, rarity: 'Common' },
    { src: './img/zibra.png', name: 'zibra', value: 0, rarity: 'Common' },
    { src: './img/bambu.png', name: 'bambu', value: 0, rarity: 'Common' },
    { src: './img/mangolini.png', name: 'mangolini', value: 0, rarity: 'Common' },
    { src: './img/leoraion.png', name: 'leoraion', value: 0, rarity: 'Common' },
    // Mythic
    { src: './img/frigo.png', name: 'frigo', value: 0, rarity: 'Common' },
    { src: './img/orangutini.png', name: 'orangutini', value: 0, rarity: 'Common' },
    { src: './img/bambardiro.png', name: 'bambardiro', value: 0, rarity: 'Common' },
    { src: './img/bombombini.png', name: 'bombombini', value: 0, rarity: 'Common' },
    { src: './img/gorillo.png', name: 'gorillo', value: 0, rarity: 'Common' },
    { src: './img/sigma.png', name: 'sigma', value: 0, rarity: 'Common' },
    { src: './img/matteo.png', name: 'matteo', value: 0, rarity: 'Common' },
    { src: './img/losspi.png', name: 'losspi', value: 0, rarity: 'Common' },
    { src: './img/rhino.png', name: 'rhino', value: 0, rarity: 'Common' },
    { src: './img/ganganze.png', name: 'ganganze', value: 0, rarity: 'Common' },
    { src: './img/te3.png', name: 'te3', value: 0, rarity: 'Common' },
    { src: './img/strawberre.png', name: 'strawberre', value: 0, rarity: 'Common' },
    { src: './img/elefantino.png', name: 'elefantino', value: 0, rarity: 'Common' },
    { src: './img/to3.png', name: 'to3', value: 0, rarity: 'Common' },
    { src: './img/antonio.png', name: 'antonio', value: 0, rarity: 'Common' },//アントニオ
    { src: './img/girafa.png', name: 'girafa', value: 0, rarity: 'Common' },
    { src: './img/mypepper.png', name: 'mypepper', value: 0, rarity: 'Common' },
    { src: './img/perochello.png', name: 'perochello', value: 0, rarity: 'Common' },
    { src: './img/tang.png', name: 'tang', value: 0, rarity: 'Common' },
    { src: './img/patapimus.png', name: 'patapimus', value: 0, rarity: 'Common' },
    { src: './img/tirilikalika.png', name: 'tirilikalika', value: 0, rarity: 'Common' },//室外機
    { src: './img/santonio.png', name: 'santonio', value: 0, rarity: 'Common' },
    { src: './img/losmateo.png', name: 'LosMateo', value: 0, rarity: 'Common' }, //ロスマテオ
    { src: './img/fishinis.png', name: 'fishinis', value: 0, rarity: 'Common' },



    //　Brainrot Got
    { src: './img/cocofanto.png', name: 'cocofanto', value: 10, rarity: 'BrainrotGot' },
    { src: './img/tob.png', name: 'tob', value: 25, rarity: 'BrainrotGot' },
    { src: './img/tralalero.png', name: 'tralalero', value: 50, rarity: 'BrainrotGot' },
    { src: './img/Odin.png', name: 'Odin', value: 75, rarity: 'BrainrotGot' },
    { src: './img/chache.png', name: 'chache', value: 80, rarity: 'BrainrotGot' },//机
    { src: './img/Espressona.png', name: 'Espressona', value: 90, rarity: 'BrainrotGot' },
    { src: './img/lavaca.png', name: 'lavaca', value: 100, rarity: 'BrainrotGot' },
    { src: './img/ecco.png', name: 'ecco', value: 110, rarity: 'BrainrotGot' },
    { src: './img/losvaguitas.png', name: 'losvaguitas', value: 115, rarity: 'BrainrotGot' },
    { src: './img/bulbito.png', name: 'bulbito', value: 120, rarity: 'BrainrotGot' },
    { src: './img/banana.png', name: 'banana', value: 120, rarity: 'BrainrotGot' },
    { src: './img/chillin.png', name: 'chillin', value: 130, rarity: 'BrainrotGot' },
    { src: './img/trippi.png', name: 'trippi', value: 130, rarity: 'BrainrotGot' },//ピラニア
    { src: './img/brri.png', name: 'brri', value: 135, rarity: 'BrainrotGot' },
    { src: './img/ciocco.png', name: 'ciocco', value: 140, rarity: 'BrainrotGot' },
    { src: './img/brrestrh.png', name: 'brrestrh', value: 145, rarity: 'BrainrotGot' },
    { src: './img/torrtuginni.png', name: 'torrtuginni', value: 150, rarity: 'BrainrotGot' },
    { src: './img/losbros.png', name: 'losbros', value: 155, rarity: 'BrainrotGot' },
    { src: './img/bambini.png', name: 'bambini', value: 160, rarity: 'BrainrotGot' },
    { src: './img/hoccci.png', name: 'hoccci', value: 167, rarity: 'BrainrotGot' },
    { src: './img/jiqi.png', name: 'jiqi', value: 165, rarity: 'BrainrotGot' },//時計
    { src: './img/los.png', name: 'los', value: 170, rarity: 'BrainrotGot' },
    { src: './img/agarrini.png', name: 'agarrini', value: 175, rarity: 'BrainrotGot' },//スコップ
    { src: './img/alessio.png', name: 'alessio', value: 180, rarity: 'BrainrotGot' },
    { src: './img/karkerkar.png', name: 'karkerkar', value: 190, rarity: 'BrainrotGot' },
    { src: './img/piccionetama.png', name: 'piccionetama', value: 200, rarity: 'BrainrotGot' },
    { src: './img/popcon.png', name: 'popcon', value: 205, rarity: 'BrainrotGot' },
    { src: './img/iipiccione.png', name: 'iipiccione', value: 210, rarity: 'BrainrotGot' },
    { src: './img/nomypresent.png', name: 'nomypresent', value: 215, rarity: 'BrainrotGot' },
    { src: './img/jobjobjob.png', name: 'jobjobjob', value: 220, rarity: 'BrainrotGot' },//Job
    { src: './img/lassis.png', name: 'lassis', value: 230, rarity: 'BrainrotGot' },//姉妹
    { src: './img/iimastodontico.png', name: 'iimastodontico', value: 240, rarity: 'BrainrotGot' },//テレビサッカー
    { src: './img/loschristmas.png', name: 'loschristmas', value: 245, rarity: 'BrainrotGot' },
    { src: './img/malame.png', name: 'malame', value: 250, rarity: 'BrainrotGot' },
    { src: './img/belugelo.png', name: 'belugelo', value: 270, rarity: 'BrainrotGot' },
    { src: './img/bellaca.png', name: 'bellaca', value: 275, rarity: 'BrainrotGot' },
    { src: './img/miss.png', name: 'miss', value: 300, rarity: 'BrainrotGot' },//ロケット

    //　Secret
    { src: './img/lostralaletitos.png', name: 'lostralaletitos', value: 200, rarity: 'Secret' },
    { src: './img/lostralaleritas.png', name: 'lostralaleritas', value: 200, rarity: 'Secret' },
    { src: './img/trenostruzzo.png', name: 'trenostruzzo', value: 300, rarity: 'Secret' },
    { src: './img/kravilino.png', name: 'kravilino', value: 375, rarity: 'Secret' },
    { src: './img/losorcaleritos.png', name: 'losorcaleritos', value: 400, rarity: 'Secret' },
    { src: './img/loscouples.png', name: 'loscouples', value: 450, rarity: 'Secret' },
    { src: './img/piccione.png', name: 'piccione', value: 500, rarity: 'Secret' },
    { src: './img/peely.png', name: 'peely', value: 500, rarity: 'Secret' },
    { src: './img/pakrah_w.png', name: 'pakrah_w', value: 550, rarity: 'Secret' },//鉛筆女
    { src: './img/pakrah.png', name: 'pakrah', value: 600, rarity: 'Secret' },
    { src: './img/losjob.png', name: 'losjob', value: 700, rarity: 'Secret' },
    { src: './img/4000.png', name: '4000', value: 700, rarity: 'Secret' },//4000
    { src: './img/Babel.png', name: 'Babel', value: 800, rarity: 'Secret' },
    { src: './img/losisu.png', name: 'losisu', value: 900, rarity: 'Secret' },//ロス椅子
    { src: './img/orcalero.png', name: 'orcalero', value: 1000, rarity: 'Secret' },
    { src: './img/frog.png', name: 'frog', value: 1200, rarity: 'Secret' },
    { src: './img/ketchuru.png', name: 'ketchuru', value: 1500, rarity: 'Secret' },
    { src: './img/pothotspotona.png', name: 'pothotspotona', value: 1700, rarity: 'Secret' },//女骨
    { src: './img/pothotspot.png', name: 'pothotspot', value: 2000, rarity: 'Secret' },
    { src: './img/21.png', name: '21', value: 2100, rarity: 'Secret' },
    { src: './img/losmobilis.png', name: 'losmobilis', value: 2200, rarity: 'Secret' },
    { src: './img/nomyhotspot.png', name: 'nomyhotspot', value: 2500, rarity: 'Secret' },
    { src: './img/elf3.png', name: 'elf3', value: 2700, rarity: 'Secret' },
    { src: './img/garamarama.png', name: 'garamarama', value: 3000, rarity: 'Secret' },
    { src: './img/pirulitoita.png', name: 'pirulitoita', value: 3500, rarity: 'Secret' },//飴
    { src: './img/iisacro.png', name: 'iisacro', value: 4000, rarity: 'Secret' },
    { src: './img/chari2.png', name: 'chari2', value: 4500, rarity: 'Secret' },
    { src: './img/lagrande.png', name: 'lagrande', value: 5000, rarity: 'Secret' },//ラグランデ
    { src: './img/lossanta.png', name: 'lossanta', value: 5500, rarity: 'Secret' },
    { src: './img/legolem.png', name: 'legolem', value: 6000, rarity: 'Secret' },
    { src: './img/67.png', name: '67', value: 6700, rarity: 'Secret' },
    { src: './img/loshouse.png', name: 'loshouse', value: 7000, rarity: 'Secret' },
    { src: './img/Coccoblade.png', name: 'Coccoblade', value: 7500, rarity: 'Secret-' },//数字仮
    { src: './img/chicleteira.png', name: 'chicleteira', value: 8000, rarity: 'Secret' },
    { src: './img/lachristmas.png', name: 'lachristmas', value: 9000, rarity: 'Secret' },//クリスマスラグランデ
    { src: './img/pad.png', name: 'pad', value: 10000, rarity: 'Secret' },
    { src: './img/dulduldul.png', name: 'dulduldul', value: 12000, rarity: 'Secret' },
    { src: './img/WorL.png', name: 'WorL', value: 13000, rarity: 'Secret' },
    { src: './img/cookipad.png', name: 'cookipad', value: 14000, rarity: 'Secret-' },
    { src: './img/losgarama.png', name: 'losgarama', value: 12000, rarity: 'Secret-' },
    { src: './img/kaerutoire.png', name: 'kaerutoire', value: 12000, rarity: 'Secret-' },
    { src: './img/ie.png', name: 'ie', value: 12000, rarity: 'Secret-' },
    { src: './img/pitiata.png', name: 'pitiata', value: 12000, rarity: 'Secret-' },
    { src: './img/yule.png', name: 'yule', value: 12000, rarity: 'Secret-' },
    { src: './img/chinpanking.png', name: 'chinpanking', value: 25000, rarity: 'Secret' },//チンパンジー
    { src: './img/25.png', name: '25', value: 25000, rarity: 'Secret-' },
    { src: './img/itigozou.png', name: 'itigozou', value: 12000, rarity: 'Secret-' },
    { src: './img/klombo.png', name: 'klombo', value: 12000, rarity: 'Secret-' },
    { src: './img/shtekerito.png', name: 'shtekerito', value: 12000, rarity: 'Secret-' },
    { src: './img/spageti.png', name: 'spageti', value: 12000, rarity: 'Secret-' },
    { src: './img/santani.png', name: 'santani', value: 12000, rarity: 'Secret-' },//サンタニ
    { src: './img/cabritos.png', name: 'cabritos', value: 12000, rarity: 'Secret-' },//ヤギ2人
    { src: './img/doragon.png', name: 'doragon', value: 12000, rarity: 'Secret-' },
    { src: './img/lacrazy.png', name: 'lacrazy', value: 12000, rarity: 'Secret-' },
    { src: './img/kumo.png', name: 'kumo', value: 12000, rarity: 'Secret-' },
    { src: './img/track.png', name: 'track', value: 12000, rarity: 'Secret-' },
    { src: './img/toire.png', name: 'Skibidi Toilet', value: 12000, rarity: 'Secret-' },








];
