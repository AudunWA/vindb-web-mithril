import m from "mithril";
import { setCanonicalUrl, setMetaDescription } from "../../util/searchEngines";

let queryString: string;

function onSearchClick(e: Event) {
    e.preventDefault();

    if (typeof queryString !== "undefined") {
        m.route.set("/products?query=" + queryString);
    } else {
        m.route.set("/products");
    }
}

const Home: m.Component = {
    oncreate: function () {
        document.title = "VinDB";
        setCanonicalUrl("https://vindb.audun.me/");
        setMetaDescription(
            "VinDB gir oversikt over alle endringer gjort i Vinmonopolets vareutvalg. Vi sjekker daglig varenes endringer, og holder styr på alt fra prisendringer til rettinger av skrivefeil!",
        );
    },
    view: function () {
        return m(".center-align.container", [
            m("h1", "VinDB"),
            m("h5", [
                m(
                    "p",
                    "Vi gir oversikt over alle endringer gjort i Vinmonopolets vareutvalg. Vi sjekker daglig varenes endringer, og holder styr på alt fra prisendringer til rettinger av skrivefeil!\n",
                ),
                m(
                    "p",
                    "Skriv i søkefeltet, eller velg en kategori fra menyen.",
                ),
            ]),
            m(
                "form[action='/products'][id='searchForm']",
                {
                    onchange: function (e: { target: { value: string } }) {
                        queryString = e.target.value;
                    },
                    onsubmit: onSearchClick,
                },
                [
                    m(
                        "input[id='searchQuery'][placeholder='Søk på vare...'][type='search']",
                        { style: { width: "50%" } },
                    ),
                    m("br"),
                    m(
                        "button.btn.waves-effect.waves-light.btn-large[type='submit']",
                        ["Søk!", m("i.material-icons.left", "search")],
                    ),
                ],
            ),
        ]);
    },
};

export default Home;
