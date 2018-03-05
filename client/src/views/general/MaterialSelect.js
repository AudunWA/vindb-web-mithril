var m = require("mithril");

var MaterialSelect = {
    oncreate: function () {
        $('select').material_select();
    },
    view: function (vnode) {
        var selectAttributes = vnode.attrs.multiple ? { multiple: "true"} : { };
        if(vnode.attrs.onchange) {
            selectAttributes["onchange"] = vnode.attrs.onchange;
        }
        return m("select", selectAttributes,
            m("option[value=''][disabled][selected]", vnode.attrs.defaultText),
            vnode.attrs.optionGroups.map(function (optionGroup) {
                return m("optgroup", { label: optionGroup.label },
                    optionGroup.options.map(function (option) {
                        var optionAttributes = { value: option.value || "" };
                        if(option.disabled === true) {
                            optionAttributes.disabled = "true";
                        }
                        if(option.selected === true) {
                            optionAttributes.selected = "true";
                        }
                        return m("option", optionAttributes, option.label);
                    })
                );
            })
        )
    }
};

module.exports = MaterialSelect;