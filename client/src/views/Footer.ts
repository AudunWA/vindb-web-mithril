import m from "mithril";
import moment from "moment";

const Footer = {
    view: function () {
        return m(
            "footer.page-footer",
            m(
                ".container",
                m(
                    ".row",
                    m(
                        ".col.l6.s12",
                        m("h5.white-text", "VinDB 0.3"),
                        m(
                            "p.grey-text.text-lighten-4",
                            "En tjeneste utviklet av Audun Wigum Arbo.",
                        ),
                    ),
                    m(
                        ".col.l4.offset-l2.s12",
                        m("h5.white-text", "Kontakt"),
                        m(
                            "ul",
                            //m("li", m("a.grey-text.text-lighten-3[href='mailto:audunwar@stud.ntnu.no']", m("i.material-icons.small.valign-github", "email"), "audunwar@stud.ntnu.no")),
                            m(
                                "li",
                                m(
                                    "a.grey-text.text-lighten-3[href='https://github.com/AudunWA']",
                                    m(
                                        "img.valign-github[src='/img/github/GitHub-Mark-Light-32px.png'][alt='GitHub-logo']",
                                    ),
                                    "AudunWA",
                                ),
                            ),
                        ),
                    ),
                ),
            ),
            m(
                ".footer-copyright",
                m(
                    ".container",
                    `© 2016-${moment().year()} Copyright Audun Wigum Arbo. Varedata fra Vinmonopolet.`,
                ),
            ),
        );
    },
};

export default Footer;
