const monsterProbabilityRules = [
    {
        range: "〜500",
        threshold: 500,
        monsters: [
            { id: "losvaguitas", percent: 15 },
            { id: "alessio", percent: 40 },
            { id: "tougyu", percent: 30 },
            { id: "lasskop", percent: 15 }
        ]
    },
    {
        range: "501〜750",
        threshold: 750,
        monsters: [
            { id: "alessio", percent: 25 },
            { id: "tougyu", percent: 25 },
            { id: "lasskop", percent: 35 },
            { id: "pickolini", percent: 10 },
            { id: "pothotspot", percent: 5 }
        ]
    },
    {
        range: "751〜1000",
        threshold: 1000,
        monsters: [
            { id: "alessio", percent: 15 },
            { id: "tougyu", percent: 10 },
            { id: "lasskop", percent: 55 },
            { id: "pickolini", percent: 15 },
            { id: "pothotspot", percent: 5 }
        ]
    },
    {
        range: "1001〜1500",
        threshold: 1500,
        monsters: [
            { id: "lasskop", percent: 50 },
            { id: "pickolini", percent: 30 },
            { id: "pothotspot", percent: 20 }
        ]
    },
    {
        range: "1501〜2000",
        threshold: 2000,
        monsters: [
            { id: "lasskop", percent: 30 },
            { id: "pickolini", percent: 30 },
            { id: "pothotspot", percent: 35 },
            { id: "yesmyhot", percent: 5 },
            { id: "wanihikouki", percent: 5 },
            { id: "itigokinnniku", percent: 5 }
        ]
    },
    {
        range: "2001〜3000",
        threshold: 3000,
        monsters: [
            { id: "pickolini", percent: 30 },
            { id: "pothotspot", percent: 55 },
            { id: "yesmyhot", percent: 15 },
            { id: "wanihikouki", percent: 15 },
            { id: "itigokinnniku", percent: 15 }
        ]
    },
    {
        range: "3001〜4000",
        threshold: 4000,
        monsters: [
            { id: "pickolini", percent: 10 },
            { id: "pothotspot", percent: 60 },
            { id: "yesmyhot", percent: 25 },
            { id: "wanihikouki", percent: 25 },
            { id: "itigokinnniku", percent: 25 },
            { id: "cacasito", percent: 5 },
            { id: "wanichari", percent: 5 }
        ]
    },
    {
        range: "4001〜5000",
        threshold: 5000,
        monsters: [
            { id: "pothotspot", percent: 45 },
            { id: "yesmyhot", percent: 35 },
            { id: "wanihikouki", percent: 35 },
            { id: "itigokinnniku", percent: 35 },
            { id: "cacasito", percent: 20 },
            { id: "wanichari", percent: 20 }
        ]
    },
    {
        range: "5001〜6500",
        threshold: 6500,
        monsters: [
            { id: "pothotspot", percent: 25 },
            { id: "yesmyhot", percent: 50 },
            { id: "wanihikouki", percent: 50 },
            { id: "itigokinnniku", percent: 50 },
            { id: "cacasito", percent: 25 },
            { id: "wanichari", percent: 25 }
        ]
    },
    {
        range: "6501〜8000",
        threshold: 8000,
        monsters: [
            { id: "pothotspot", percent: 5 },
            { id: "yesmyhot", percent: 60 },
            { id: "wanihikouki", percent: 60 },
            { id: "itigokinnniku", percent: 60 },
            { id: "cacasito", percent: 30 },
            { id: "wanichari", percent: 30 },
            { id: "nomychari", percent: 5 }
        ]
    },
    {
        range: "8001〜10000",
        threshold: 10000,
        monsters: [
            { id: "yesmyhot", percent: 55 },
            { id: "wanihikouki", percent: 55 },
            { id: "itigokinnniku", percent: 55 },
            { id: "cacasito", percent: 35 },
            { id: "wanichari", percent: 35 },
            { id: "nomychari", percent: 10 }
        ]
    },
    {
        range: "10001〜12000",
        threshold: 12000,
        monsters: [
            { id: "yesmyhot", percent: 35 },
            { id: "wanihikouki", percent: 35 },
            { id: "itigokinnniku", percent: 35 },
            { id: "cacasito", percent: 45 },
            { id: "wanichari", percent: 45 },
            { id: "nomychari", percent: 20 }
        ]
    },
    {
        range: "12001〜16000",
        threshold: 16000,
        monsters: [
            { id: "yesmyhot", percent: 20 },
            { id: "wanihikouki", percent: 20 },
            { id: "itigokinnniku", percent: 20 },
            { id: "cacasito", percent: 40 },
            { id: "wanichari", percent: 40 },
            { id: "nomychari", percent: 35 },
            { id: "chinpanking", percent: 5 },
            { id: "penginkingini", percent: 5 }
        ]
    },
    {
        range: "16001〜20000",
        threshold: 20000,
        monsters: [
            { id: "yesmyhot", percent: 10 },
            { id: "wanihikouki", percent: 10 },
            { id: "itigokinnniku", percent: 10 },
            { id: "cacasito", percent: 35 },
            { id: "wanichari", percent: 35 },
            { id: "nomychari", percent: 45 },
            { id: "chinpanking", percent: 10 },
            { id: "penginkingini", percent: 10 }
        ]
    },
    {
        range: "20001〜25000",
        threshold: 25000,
        monsters: [
            { id: "cacasito", percent: 30 },
            { id: "wanichari", percent: 30 },
            { id: "nomychari", percent: 40 },
            { id: "chinpanking", percent: 15 },
            { id: "penginkingini", percent: 15 },
            { id: "tictac", percent: 5 },
            { id: "wanitrack", percent: 5 }
        ]
    },
    {
        range: "25001〜30000",
        threshold: 30000,
        monsters: [
            { id: "cacasito", percent: 20 },
            { id: "wanichari", percent: 20 },
            { id: "nomychari", percent: 50 },
            { id: "chinpanking", percent: 20 },
            { id: "penginkingini", percent: 20 },
            { id: "tictac", percent: 10 },
            { id: "wanitrack", percent: 10 }
        ]
    },
    {
        range: "30001〜35000",
        threshold: 35000,
        monsters: [
            { id: "cacasito", percent: 15 },
            { id: "wanichari", percent: 15 },
            { id: "nomychari", percent: 40 },
            { id: "chinpanking", percent: 30 },
            { id: "penginkingini", percent: 30 },
            { id: "tictac", percent: 10 },
            { id: "wanitrack", percent: 10 },
            { id: "cabritos", percent: 5 },
            { id: "corngozira", percent: 5 }
        ]
    },
    {
        range: "35001〜40000",
        threshold: 40000,
        monsters: [
            { id: "nomychari", percent: 40 },
            { id: "chinpanking", percent: 35 },
            { id: "penginkingini", percent: 35 },
            { id: "tictac", percent: 15 },
            { id: "wanitrack", percent: 15 },
            { id: "cabritos", percent: 10 },
            { id: "corngozira", percent: 10 }
        ]
    },
    {
        range: "40001〜45000",
        threshold: 45000,
        monsters: [
            { id: "nomychari", percent: 35 },
            { id: "chinpanking", percent: 35 },
            { id: "penginkingini", percent: 35 },
            { id: "tictac", percent: 15 },
            { id: "wanitrack", percent: 15 },
            { id: "cabritos", percent: 10 },
            { id: "corngozira", percent: 10 },
            { id: "gorgon", percent: 5 }
        ]
    },
    {
        range: "45001〜55000",
        threshold: 55000,
        monsters: [
            { id: "nomychari", percent: 29 },
            { id: "chinpanking", percent: 40 },
            { id: "penginkingini", percent: 40 },
            { id: "tictac", percent: 15 },
            { id: "wanitrack", percent: 15 },
            { id: "cabritos", percent: 10 },
            { id: "corngozira", percent: 10 },
            { id: "gorgon", percent: 5 },
            { id: "croissa", percent: 1 },
        ]
    },
    {
        range: "55001〜65000",
        threshold: 65000,
        monsters: [
            { id: "nomychari", percent: 25 },
            { id: "chinpanking", percent: 35 },
            { id: "penginkingini", percent: 35 },
            { id: "tictac", percent: 20 },
            { id: "wanitrack", percent: 20 },
            { id: "cabritos", percent: 13 },
            { id: "corngozira", percent: 13 },
            { id: "gorgon", percent: 5 },
            { id: "croissa", percent: 2 },
        ]
    },
    {
        range: "65001〜80000",
        threshold: 80000,
        monsters: [
            { id: "chinpanking", percent: 49 },
            { id: "penginkingini", percent: 49 },
            { id: "tictac", percent: 25 },
            { id: "wanitrack", percent: 25 },
            { id: "cabritos", percent: 17 },
            { id: "corngozira", percent: 17 },
            { id: "gorgon", percent: 6 },
            { id: "croissa", percent: 2 },
            { id: "humberger", percent: 1 },
            { id: "tiramis", percent: 1 },
            { id: "tralaledon", percent: 1 }
        ]
    },
    {
        range: "80001〜100000",
        threshold: 100000,
        monsters: [
            { id: "chinpanking", percent: 37.5 },
            { id: "penginkingini", percent: 37.5 },
            { id: "tictac", percent: 30 },
            { id: "wanitrack", percent: 30 },
            { id: "cabritos", percent: 20 },
            { id: "corngozira", percent: 20 },
            { id: "gorgon", percent: 8 },
            { id: "croissa", percent: 3 },
            { id: "humberger", percent: 1.5 },
            { id: "tiramis", percent: 1.5 },
            { id: "tralaledon", percent: 1.5 }
        ]
    },
    {
        range: "100001〜",
        threshold: Infinity,
        monsters: [
            { id: "chinpanking", percent: 25 },
            { id: "penginkingini", percent: 25 },
            { id: "tictac", percent: 35 },
            { id: "wanitrack", percent: 35 },
            { id: "cabritos", percent: 25 },
            { id: "corngozira", percent: 25 },
            { id: "gorgon", percent: 10 },
            { id: "croissa", percent: 4 },
            { id: "lasuper", percent: 1 }
        ]
    }
];

// ========== 条件付きモンスター置換ルール ==========
// selectedId: 選択されたモンスターのID
// minCount: 最低何体選択されている必要があるか
// replacements: { 置換元ID: 置換先ID } — 同じIDに置換された場合は自動で1つにまとまる
const monsterReplacementRules = [
    {
        selectedId: "67",
        minCount: 2,
        replacements: { "nomychari": "los67" }
    },
    {
        selectedId: "chinpanking",
        minCount: 1,
        replacements: { "tictac": "lostinpan", "wanitrack": "lostinpan" }
    }
];

// ========== 条件付きルール全体置換 ==========
// selectedIds: この中から minCount 体以上選択された場合に発動
// threshold: 置換対象のルールのthreshold
// monsters: 置換後のモンスターリスト
const monsterRuleOverrides = [
    {
        selectedIds: ["doragon", "pinkkuma", "tiramis", "track"],
        minCount: 2,
        threshold: Infinity,
        monsters: [
            { id: "chinpanking", percent: 22 },
            { id: "penginkingini", percent: 22 },
            { id: "tictac", percent: 35 },
            { id: "wanitrack", percent: 35 },
            { id: "cabritos", percent: 25 },
            { id: "corngozira", percent: 25 },
            { id: "gorgon", percent: 10 },
            { id: "croissa", percent: 4 },
            { id: "lasuper", percent: 4 }
        ]
    }
];
