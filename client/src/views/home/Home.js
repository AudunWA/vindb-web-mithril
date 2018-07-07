var m = require("mithril");

var queryString;

function onSearchClick(e) {
    e.preventDefault();

    if(typeof queryString !== "undefined") {
        m.route.set("/products?query=" + queryString);
    } else {
        m.route.set("/products");
    }
}
var Home = {
    view: function () {
        return m(".center-align.container",
            [
                m("h1", "VinDB"),
                m("h5",
                    [
                        m("p", "VinDB er en tjeneste som tilbyr oversikt over alle endringer gjort i Vinmonopolets vareutvalg. Vi sjekker daglig hvilke endringer Vinmonopolet gjør, og man kan dermed se alt fra prisendringer til rettinger av skrivefeil!\n"),
                        m("p", "Skriv i søkefeltet, eller velg en kategori fra toppmenyen!")
                    ]
                ),
                m("form[action='/products'][id='searchForm']",
                    {
                        onchange: function (e) {
                            queryString = e.target.value;
                        },
                        onsubmit: onSearchClick
                    },
                    [
                        m("input[id='searchQuery'][placeholder='Søk på vare...'][type='search']", {style: {"width": "50%"}}),
                        m("br"),
                        m("button.btn.waves-effect.waves-light.btn-large[type='submit']",
                            [
                                "Søk!", m("i.material-icons.left", "search")
                            ]
                        )
                    ]
                )
            ]
        );
    }
};

module.exports = Home;