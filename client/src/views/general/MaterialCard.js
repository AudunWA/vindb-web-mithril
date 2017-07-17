var m = require("mithril");

var MaterialCard = {
    view: function (vnode) {
        return m(".col s12 m6 l4 xl3",
            m(".card sample horizontal " + vnode.attrs.color,
                vnode.attrs.image !== null ? m(".card-image  valign-wrapper white",
                    m("img.sample2.responsive-img", { src: vnode.attrs.image}))
                    : null,
                m(".card-stacked",
                    m(".card-content white-text",
                        m("span.card-title", vnode.attrs.title),
                        vnode.children
                    ),
                    vnode.attrs.links !== null ? m(".card-action", vnode.attrs.links) : null
                )
            )
        )
    }
};

module.exports = MaterialCard;