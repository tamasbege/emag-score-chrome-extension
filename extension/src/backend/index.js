const firebaseCloudUrl = "https://us-central1-emag-price-tracker.cloudfunctions.net/";
const EmagTrackerAPI = {
    getProduct(pid) {
        return $.get(firebaseCloudUrl + "getProduct?pid=" + pid);
    },
    addProduct(product) {
        return $.ajax({
            url: firebaseCloudUrl + "addProduct",
            type: "POST",
            contentType: "application/json",
            data: {
                pid: product.pid,
                title: product.title,
                url: product.url,
                imgUrl: product.imgUrl,
                price: product.price
            }
        });
    },
    updatePrice(pid, newPrice) {
        return $.ajax({
            url: firebaseCloudUrl + 'updateProduct',
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
