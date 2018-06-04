const EmagTrackerAPI = {
    getFireBaseUrl() {
        return "https://us-central1-emag-price-tracker.cloudfunctions.net/";
    },
    getProduct(pid) {
        return $.get(getFireBaseUrl() + "getProduct?pid=" + pid);
    },
    addProduct(product) {
        return $.ajax({
            url: getFireBaseUrl() + "addProduct",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                "pid": product.pid,
                "title": product.title,
                "url": product.url,
                "imgUrl": product.imgUrl,
                "price": product.price
            })
        });
    },
    updatePrice(pid, newPrice) {
        return $.ajax({
            url: getFireBaseUrl() + 'updateProduct',
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                pid: pid,
                newPrice: newPrice
            })
        });
    }
};

export { EmagTrackerAPI }
