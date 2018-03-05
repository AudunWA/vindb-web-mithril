var HistoryUtil = {
    getNameForChangeField: function (changeField) {
        switch (changeField) {
            case 0:
                return "Varenummer";
            default:
            case 1:
                return "";
            case 2:
                return "Varenavn";
            case 3:
                return "Volum";
            case 4:
                return "Pris";
            case 5:
                return "Varetype";
            case 6:
                return "Produktutvalg";
            case 7:
                return "Butikkategori";
            case 8:
                return "Fylde";
            case 9:
                return "Friskhet";
            case 10:
                return "Garvestoffer";
            case 11:
                return "Bitterhet";
            case 12:
                return "Sødme";
            case 13:
                return "Farge";
            case 14:
                return "Lukt";
            case 15:
                return "Smak";
            case 16:
                return "Passer til 1";
            case 17:
                return "Passer til 2";
            case 18:
                return "Passer til 3";
            case 19:
                return "Land";
            case 20:
                return "Distrikt";
            case 21:
                return "Underdistrikt";
            case 22:
                return "Årgang";
            case 23:
                return "Råstoff";
            case 24:
                return "Metode";
            case 25:
                return "Alkoholprosent";
            case 26:
                return "Sukker";
            case 27:
                return "Syre";
            case 28:
                return "Lagringsgrad";
            case 29:
                return "Produsent";
            case 30:
                return "Grossist";
            case 31:
                return "Distributor";
            case 32:
                return "Emballasjetype";
            case 33:
                return "Korktype";
        }
    },
    getIconForChangeField: function (changeField) {
        switch (changeField) {
            default:
            case 0:
            case 1:
                return "";
            case 2:
                return "create";
            case 3:
                return "crop_free";
            case 4:
                return "local_atm";
            //return "attach_money";
            case 5:
                return "local_offer";
            case 6:
                return "layers";
            case 7:
                return "local_shipping";
            case 8:
                return "local_drink";
            case 9:
                return "local_drink";
            case 10:
                return "local_drink";
            case 11:
                return "local_drink";
            case 12:
                return "local_drink";
            case 13:
                return "local_drink";
            case 14:
                return "local_drink";
            case 15:
                return "local_drink";
            case 16:
                return "local_dining";
            case 17:
                return "local_dining";
            case 18:
                return "local_dining";
            case 19:
                return "terrain";
            case 20:
                return "terrain";
            case 21:
                return "terrain";
            case 22:
                return "timelapse";
            case 23:
                return "local_drink";
            case 24:
                return "local_drink";
            case 25:
                return "local_drink";
            case 26:
                return "local_drink";
            case 27:
                return "local_drink";
            case 28:
                return "timer";
            case 29:
                return "local_shipping";
            case 30:
                return "local_shipping";
            case 31:
                return "local_shipping";
            case 32:
                return "cached";
            case 33:
                return "cached";
        }
    },
    optionGroups: [
        {
            label: "Grunnleggende",
            options: [
                { label: "Varenavn", value: 2 },
                { label: "Pris", value: 4 },
                { label: "Alkoholprosent", value: 25 },
                { label: "Volum", value: 3 },
                { label: "Årgang", value: 22 },
                { label: "Varetype", value: 5 }
            ]
        },
        {
            label: "Tilgjengelighet",
            options: [
                { label: "Produktutvalg", value: 6 },
                { label: "Butikkategori", value: 7 }
            ]
        },
        {
            label: "Smak og ernæring",
            options: [
                { label: "Fylde", value: 8 },
                { label: "Friskhet", value: 9 },
                { label: "Garvestoffer", value: 10 },
                { label: "Bitterhet", value: 11 },
                { label: "Sødme", value: 12 },
                { label: "Farge", value: 13 },
                { label: "Lukt", value: 14 },
                { label: "Smak", value: 15 },
                { label: "Passer til", value: "16,17,18" },
            ]
        },
        {
            label: "Geografi",
            options: [
                { label: "Land", value: 19 },
                { label: "Distrikt", value: 20 },
                { label: "Underdistrikt", value: 21 }
            ]
        },
        {
            label: "Diverse",
            options: [
                { label: "Lagringsgrad", value: 28 },
                { label: "Produsent", value: 29 },
                { label: "Grossist", value: 30 },
                { label: "Distributør", value: 31 },
                { label: "Emballasjetype", value: 32 },
                { label: "Korktype", value: 33 }
            ]
        }
    ]
};

module.exports = HistoryUtil;