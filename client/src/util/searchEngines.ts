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

export function setCanonicalUrl(url: string | null) {
    const element = document.querySelector("link[rel='canonical']");
    if (element == null) {
        if (url == null) {
            return;
        }

        const link = document.createElement("link");
        link.rel = "canonical";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    } else {
        if (url == null) {
            document.getElementsByTagName("head")[0].removeChild(element);
        } else {
            element.setAttribute("href", url);
        }
    }
}
