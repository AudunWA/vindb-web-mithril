import m from "mithril";
import Product from "../../models/Product";

const node = m("ul.pagination");

function onButtonClick(e: Event) {
    e.preventDefault();

    const pageId = getCorrectPage(e.target as HTMLElement);
    const newParams = m.route.param();
    newParams.page = pageId;

    m.route.set("/products", newParams);
    Product.loadList(m.route.param());
}

function getCorrectPage(target: HTMLElement): number {
    const child = target.firstChild as HTMLElement | null;
    const value = target.innerText ?? child?.innerText;

    switch (value) {
        case "chevron_left": // Previous
            return Product.currentPage - 1;
        case "first_page":
            return 1;
        case "chevron_right": // Next
            return Product.currentPage + 1;
        case "last_page":
            return Product.pageCount;
        default:
            return Number(value) || 1;
    }
}

function generatePageNodes() {
    let start = Product.currentPage === 1 ? 1 : Product.currentPage - 1;
    let end = Product.currentPage === 1 ? 3 : Product.currentPage + 1;
    if (Product.currentPage === Product.pageCount) {
        start = Product.currentPage - 2;
    }
    if (Product.pageCount === 1) {
        {
            start = 1;
            end = 1;
        }
    }
    if (end > Product.pageCount) {
        end = Product.pageCount;
    }

    const vnodes: m.Vnode[] = [];
    for (let i = start; i <= end; i++) {
        vnodes.push(
            m(
                "li",
                {
                    class:
                        i === Product.currentPage ? "active" : "waves-effect",
                },
                m(
                    "a.page-button",
                    i === Product.currentPage
                        ? {}
                        : {
                              href: `/#!/products?page=${i}`,
                              onclick: onButtonClick,
                          },
                    i,
                ),
            ),
        );
    }
    return vnodes;
}

const Pagination: m.Component = {
    view: function () {
        // TODO: Disable all buttons while searching
        return m("ul.pagination", [
            m(
                "li",
                {
                    class:
                        Product.currentPage === 1 ? "disabled" : "waves-effect",
                },
                [
                    Product.currentPage === 1
                        ? m("i.material-icons", "first_page")
                        : m(
                              m.route.Link,
                              {
                                  selector: "a.page-first",
                                  href: "/products",
                                  onclick: onButtonClick,
                              },
                              m("i.material-icons", "first_page"),
                          ),
                ],
            ),
            m(
                "li",
                {
                    class:
                        Product.currentPage === 1 ? "disabled" : "waves-effect",
                },
                [
                    m(
                        "a.page-previous",
                        Product.currentPage === 1
                            ? {}
                            : {
                                  test: "tsd",
                                  href: `/products?page=${
                                      Product.currentPage - 1
                                  }`,
                                  onclick: onButtonClick,
                              },
                        m("i.material-icons", "chevron_left"),
                    ),
                ],
            ),
            generatePageNodes(),
            m(
                "li",
                {
                    class:
                        Product.currentPage === Product.pageCount
                            ? "disabled"
                            : "waves-effect",
                },
                [
                    m(
                        "a.page-next",
                        Product.currentPage === Product.pageCount
                            ? {}
                            : {
                                  href: `/products?page=${
                                      Product.currentPage + 1
                                  }`,
                                  onclick: onButtonClick,
                              },
                        m("i.material-icons", "chevron_right"),
                    ),
                ],
            ),
            m(
                "li",
                {
                    class:
                        Product.currentPage === Product.pageCount
                            ? "disabled"
                            : "waves-effect",
                },
                [
                    m(
                        "a.page-last",
                        Product.currentPage === Product.pageCount
                            ? {}
                            : {
                                  href: `/products?page=${Product.pageCount}`,
                                  onclick: onButtonClick,
                              },
                        m("i.material-icons", "last_page"),
                    ),
                ],
            ),
        ]);
    },
};

export default Pagination;
