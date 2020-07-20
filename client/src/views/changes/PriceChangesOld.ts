import m from "mithril";
import moment from "moment";
import PriceChange from "../../models/PriceChange";
import Layout from "../Layout";
import MaterialCard from "../general/MaterialCard";
import { setCanonicalUrl, setMetaDescription } from "../../util/searchEngines";

const PriceChanges = {
    oninit: function () {
        PriceChange.loadPriceChanges();
    },
    oncreate: function () {
        document.title = "Prisendringer — VinDB";
        setCanonicalUrl("https://vindb.audun.me/pricechangesold");
        setMetaDescription("Alternativ oversikt over prisendringer.");
    },
    view: function () {
        return m(
            Layout,
            m(
                ".row",
                PriceChange.list.map(function (change) {
                    const priceDifference = PriceChange.getPriceDifference(
                        change,
                    );
                    const percent = Math.trunc(priceDifference.percent - 100);

                    if (percent === 0) {
                        return null;
                    }

                    const colorClass =
                        percent > 0 ? "red lighten-1" : "green lighten-1";
                    const chips = [m(".chip " + colorClass, percent, "%")];
                    return m(
                        MaterialCard,
                        {
                            color: colorClass,
                            title: change.varenavn,
                            chips: chips,
                            links: m(
                                m.route.Link,
                                { href: "/product/" + change.varenummer },
                                "Se produkt",
                            ),
                            // image: "https://bilder.vinmonopolet.no/cache/515x515-0/" + change.varenummer + "-1.jpg"
                        },
                        m(
                            "p",
                            "" +
                                Math.abs(percent) +
                                "% " +
                                (percent > 0 ? "dyrere" : "billigere") +
                                ", " +
                                moment(change.time).format("D. MMMM YYYY"),
                        ),
                    );
                }),
            ),
        );
    },
};

export default PriceChanges;
