/**
 * ラッキーロット フィルタ設定
 * 各カテゴリに対応するモンスターIDを指定します。
 * モンスターIDは data.js の id フィールドと一致させてください。
 * 
 * 変更方法：各配列にモンスターIDを追加・削除するだけでフィルタが更新されます。
 */

const luckyrotFilter = {
    // ========== 通常ラッキーロット ==========
    normal: {
        mythic: [
            // ここに通常Mythicラッキーロットのモンスターidを記載
            "gorillo",
            "bombombini",
            "matteo",
            "sigma",
            "losspi",
            "ganganze",
            "strawberre",
            "to3",
            "girafa",
            "antonio",
            "tirilikalika",
            "lossiguma"
        ],
        brainGot: [
            // ここに通常BrainGotラッキーロットのモンスターidを記載
            "tralalero",
            "Odin",
            "lavaca",
            "bulbito",
            "brri",
            "banana",
            "brrestrh",
            "Espressona",
            "torrtuginni",
            "bambini",
            "los",
            "bim",
            "karkerkar",
            "iipiccione",
            "malame",
            "belugelo",
        ],
        secret: [
            // ここに通常Secretラッキーロットのモンスターidを記載
            "piccione",
            "Babel",
            "orcalero",
            "frog",
            "ketchuru",
            "iisacro",
            "lagrande",
            "nomyhotspot",
            "67",
            "loshouse",
            "pad",
            "losgarama",
            "WorL",
            "niwatorisouryo",

        ],
    },

    // ========== グランデラッキーロット ==========
    grande: {
        mythic: [
            // ここにグランデMythicラッキーロットのモンスターidを記載
            "elefantino",
            "yakanzou",
            "perochello",
            "losmateo",
        ],
        brainGot: [
            // ここにグランデBrainGotラッキーロットのモンスターidを記載
            "chache",
            "trippi",
            "agarrini",
            "lassis",
            "miss",
            "suikahana",

        ],
        secret: [
            // ここにグランデSecretラッキーロットのモンスターidを記載
            "4000",
            "pirulitoita",
            "penginking",
            "kaerutoire",
            "shtekerito",
            "lacrazy",
            "pinkkuma",
        ],
    },
};
