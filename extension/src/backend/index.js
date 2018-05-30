const googleScriptUrl = "https://script.google.com/macros/s/AKfycbxgE8GodBbU4mZBf75iAz8H7li3uwTwfExaKRWsXVfckIcL_vNB/exec";
const EmagTrackerAPI = {
    getProduct(pid) {
        return $.get(googleScriptUrl + "?a=" + pid)
    },
    addProduct(product) {
        return $.ajax({
            url: googleScriptUrl,
            type: "POST",
            crossDomain: true,
            contentType: "application/json",
            // contentType: "x-www-form-urlencoded",
            data: {
                a: "1",
                b: product.pid,
                c: product.title,
                d: product.url,
                e: product.imgUrl,
                f: product.price
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With'
            }
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
