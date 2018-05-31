const googleScriptUrl = "https://script.google.com/macros/s/AKfycbxgE8GodBbU4mZBf75iAz8H7li3uwTwfExaKRWsXVfckIcL_vNB/exec";
const EmagTrackerAPI = {
    getProduct(pid) {
        return $.get(googleScriptUrl + "?a=" + pid)
    },
    addProduct(product) {
        return $.ajax({
            url: "https://us-central1-emag-price-tracker.cloudfunctions.net/addProduct",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                "pid": product.pid,
                "title": product.title,
                "url": product.url,
                "imgUrl": product.imgUrl,
                "price": product.price
            })
        })
    },
    updatePrice(pid, newPrice) {
        return $.ajax({
            url: googleScriptUrl,
            type: "POST",
            contentType: "application/json",
            data: {
                a: "2",
                b: pid,
                c: newPrice
            }
        })
    }
};

export { EmagTrackerAPI }
