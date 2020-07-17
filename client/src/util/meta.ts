export function setMetaDescription(description: string) {
    const element = document.querySelector("meta[name='Description']");
    if (element == null) {
        const meta = document.createElement("meta");
        meta.name = "Description";
        meta.content = description;
        document.getElementsByTagName("head")[0].appendChild(meta);
    } else {
        element.setAttribute("content", description);
    }
}
