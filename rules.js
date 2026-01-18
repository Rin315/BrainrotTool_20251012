const monsterProbabilityRules = [
    {
        range: "〜500",
        threshold: 500,
        monsters: [
            { id: "lavaca", percent: 15 },
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
            { id: "yesmyhot", percent: 5 }
        ]
    },
    {
        range: "2001〜3000",
        threshold: 3000,
        monsters: [
            { id: "pickolini", percent: 30 },
            { id: "pothotspot", percent: 55 },
            { id: "yesmyhot", percent: 15 }
        ]
    },
    {
        range: "3001〜4000",
        threshold: 4000,
        monsters: [
            { id: "pickolini", percent: 10 },
            { id: "pothotspot", percent: 60 },
            { id: "yesmyhot", percent: 25 },
            { id: "cacasito", percent: 5 }
        ]
    },
    {
        range: "4001〜5000",
        threshold: 5000,
        monsters: [
            { id: "pothotspot", percent: 45 },
            { id: "yesmyhot", percent: 35 },
            { id: "cacasito", percent: 20 }
        ]
    },
    {
        range: "5001〜6500",
        threshold: 6500,
        monsters: [
            { id: "pothotspot", percent: 25 },
            { id: "yesmyhot", percent: 50 },
            { id: "cacasito", percent: 25 }
        ]
    },
    {
        range: "6501〜8000",
        threshold: 8000,
        monsters: [
            { id: "pothotspot", percent: 5 },
            { id: "yesmyhot", percent: 60 },
            { id: "cacasito", percent: 30 },
            { id: "nomychari", percent: 5 }
        ]
    },
    {
        range: "8001〜10000",
        threshold: 10000,
        monsters: [
            { id: "yesmyhot", percent: 55 },
            { id: "cacasito", percent: 35 },
            { id: "nomychari", percent: 10 }
        ]
    },
    {
        range: "10001〜12000",
        threshold: 12000,
        monsters: [
            { id: "yesmyhot", percent: 35 },
            { id: "cacasito", percent: 45 },
            { id: "nomychari", percent: 20 }
        ]
    },
    {
        range: "12001〜16000",
        threshold: 16000,
        monsters: [
            { id: "yesmyhot", percent: 20 },
            { id: "cacasito", percent: 40 },
            { id: "nomychari", percent: 35 },
            { id: "chinpanking", percent: 5 }
        ]
    },
    {
        range: "16001〜20000",
        threshold: 20000,
        monsters: [
            { id: "yesmyhot", percent: 10 },
            { id: "cacasito", percent: 35 },
            { id: "nomychari", percent: 45 },
            { id: "chinpanking", percent: 10 }
        ]
    },
    {
        range: "20001〜25000",
        threshold: 25000,
        monsters: [
            { id: "cacasito", percent: 30 },
            { id: "nomychari", percent: 50 },
            { id: "chinpanking", percent: 15 },
            { id: "tictac", percent: 5 }
        ]
    },
    {
        range: "25001〜30000",
        threshold: 30000,
        monsters: [
            { id: "cacasito", percent: 30 },
            { id: "nomychari", percent: 50 },
            { id: "chinpanking", percent: 20 },
            { id: "tictac", percent: 10 }
        ]
    },
    {
        range: "30001〜35000",
        threshold: 35000,
        monsters: [
            { id: "cacasito", percent: 15 },
            { id: "nomychari", percent: 40 },
            { id: "chinpanking", percent: 30 },
            { id: "tictac", percent: 10 },
            { id: "cabritos", percent: 5 }
        ]
    },
    {
        range: "35001〜40000",
        threshold: 40000,
        monsters: [
            { id: "nomychari", percent: 40 },
            { id: "chinpanking", percent: 35 },
            { id: "tictac", percent: 15 },
            { id: "cabritos", percent: 10 }
        ]
    },
    {
        range: "40001〜",
        threshold: Infinity,
        monsters: [
            { id: "nomychari", percent: 35 },
            { id: "chinpanking", percent: 35 },
            { id: "tictac", percent: 15 },
            { id: "cabritos", percent: 10 },
            { id: "gorgon", percent: 5 }
        ]
    }
];
