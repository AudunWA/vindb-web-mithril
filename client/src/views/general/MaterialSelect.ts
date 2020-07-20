import m from "mithril";

const MaterialSelect: m.Component<{
    multiple: boolean;
    onchange?: unknown;
    defaultText?: string;
    optionGroups: {
        label: string;
        options: {
            value: number | string;
            disabled?: boolean;
            label: string;
            selected?: boolean;
        }[];
    }[];
}> = {
    oncreate: () => {
        M.FormSelect.init(document.querySelectorAll("select"));
    },
    view: (vnode) => {
        const selectAttributes: Record<string, unknown> = vnode.attrs.multiple
            ? { multiple: "true" }
            : {};
        if (vnode.attrs.onchange) {
            selectAttributes["onchange"] = vnode.attrs.onchange;
        }
        return m(
            "select",
            selectAttributes,
            m("option[value=''][disabled][selected]", vnode.attrs.defaultText),
            vnode.attrs.optionGroups.map(function (optionGroup) {
                return m(
                    "optgroup",
                    { label: optionGroup.label },
                    optionGroup.options.map(function (option) {
                        const optionAttributes = {
                            value: option.value ?? "",
                            disabled:
                                option.disabled === true ||
                                option.selected === true
                                    ? "true"
                                    : undefined,
                        };
                        return m("option", optionAttributes, option.label);
                    }),
                );
            }),
        );
    },
};

export default MaterialSelect;
