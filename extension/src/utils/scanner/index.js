// import { EmagTrackerAPI } from "../../backend"
// import { updateLocalPrice } from "../product"
import priceExtractor from "./extractors/price"

const PRICE_NOT_FOUND = 'x';

@priceExtractor({
    selector: ".product-new-price",
    failFast: false
})
export class Scanner {
    static _findContainer(htmlText) {
        const $html = $(htmlText);
        const form = $html.find("form.main-product-form");
        if (form.length)
            return $(form)
    }
    static scanProductHomepage(product) {
        return new Promise((resolve, reject) => {
            // first load product page
            $.get(product.url)
                .done(data => {
                    if (data && data.length) {
                        // TODO check for captchas and if none found then just update price
                        const container = Scanner._findContainer(data);
                        let newPrice;
                        if (container && container.length) {
                            newPrice = Scanner.prototype._extractPrice(container) || PRICE_NOT_FOUND;
                        }
                        resolve(newPrice);
                    }
                })
                .fail((xhr, status, error) => {
                    console.warn(`Could not scan pid=${product.pid}. Caused by: ${JSON.stringify({xhr: xhr, status: status, error: error})}`);
                    reject(`Could not load product page for pid=${product.pid}`)
                })
        })
    }
}
