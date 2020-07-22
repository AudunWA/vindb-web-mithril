import m from "mithril";
import moment from "moment";
import PriceChange from "../../models/PriceChange";
import { Vnode } from "mithril";
import { setCanonicalUrl, setMetaDescription } from "../../util/searchEngines";

let loading = true;

function loadPriceChanges() {
    loading = true;
    PriceChange.loadPriceChanges().then(function () {
        loading = false;
    });
}

const PriceChanges: m.Component = {
    oninit: loadPriceChanges,
    oncreate: function () {
        document.title = "Prisendringer — VinDB";
        setCanonicalUrl("https://vindb.audun.me/pricechanges");
        setMetaDescription(
            "Oversikt over de siste prisendringene i Vinmonopolets utvalg.",
        );
    },
    view: function () {
        if (loading) {
            return m(
                ".container",
                m("h2", "Prisendringer"),
                m(".progress", m(".indeterminate")),
            );
        }
        let lastDate = new Date(1970, 1, 1);

        return m(
            ".container",
            m("h2", "Prisendringer"),
            m(
                "ul.collection.with-header",
                PriceChange.list.map((change) => {
                    const vnodes: Vnode[] = [];

                    const priceDifference = PriceChange.getPriceDifference(
                        change,
                    );
                    const percent = Math.trunc(priceDifference.percent - 100);
                    if (percent === 0) {
                        return vnodes;
                    }

                    // Add date header if new date
                    if (!moment(change.time).isSame(lastDate, "date")) {
                        vnodes.push(
                            m(
                                "li.collection-header",
                                m(
                                    "h5",
                                    moment(change.time).format("D. MMMM YYYY"),
                                ),
                            ),
                        );
                        lastDate = change.time;
                    }

                    vnodes.push(
                        m(
                            "li.collection-item.avatar",
                            m(
                                "i",
                                {
                                    class:
                                        "material-icons circle " +
                                        (percent > 0 ? "red" : "green"),
                                },
                                "arrow_" +
                                    (percent > 0 ? "upward" : "downward"),
                            ),
                            m(
                                "span.title",
                                change.varenavn + " ",
                                m(
                                    "b",
                                    (percent > 0 ? "+" : "") + percent + "%",
                                ),
                            ),
                            m(
                                "p",
                                "Satt " +
                                    (percent > 0 ? "opp" : "ned") +
                                    " fra " +
                                    change.old_value +
                                    ",- til " +
                                    change.new_value +
                                    ",-",
                                m("br"),
                                m(
                                    m.route.Link,
                                    {
                                        href: "/product/" + change.varenummer,
                                    },
                                    "Gå til produkt",
                                ),
                            ),
                        ),
                    );
                    return vnodes;
                }),
            ),
        );
    },
};

export default PriceChanges;
