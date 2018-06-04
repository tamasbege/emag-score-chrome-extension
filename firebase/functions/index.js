// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const cors = require('cors')({
    origin: true
});

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

/*
    FIREBASE FUNCTION IMPLEMENTATIONS
 */

/**
 * Returns a product based on the pid from the query parameters.
 * @type {HttpsFunction}
 */
exports.getProduct = functions.https.onRequest((req, res) => {
    if (req.method === `OPTIONS`) {
        cors(req, res, () => {
            return res.status(200)
                .set('Access-Control-Allow-Origin', "*")
                .set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
                .set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Request-With')
                .json({
                    message: "Hello from Firebase"
                });
        });
    } else if (req.method !== 'GET') {
        return res.status(500)
            .json({
                message: `The method ${req.method} is not allowed for reading!`
            })
    }
    return admin.database().ref(`/${req.query.pid}`)
        .once('value')
        .then(function (snapshot) {
            if (snapshot) {
                console.info(`Product with PID ${req.query.pid} was read`);
                res.json(JSON.stringify(snapshot));
            } else {
                console.warn(`There is no product with the PID ${req.query.pid}`);
            }
            return res;
        });
});

/**
 * Adds a new product to the database.
 * It checks the important properties of the product before saving.
 * @type {HttpsFunction}
 */
exports.addProduct = functions.https.onRequest((req, res) => {
    if (req.method === `OPTIONS`) {
        cors(req, res, () => {
            return res.status(200)
                .set('Access-Control-Allow-Origin', "*")
                .set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
                .set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Request-With')
                .json({
                    message: "Hello from Firebase"
                });
        });
    } else if (req.method !== 'POST') {
        return res.status(500)
            .json({
                message: `The method ${req.method} is not allowed for writing!`
            })
    }
    const product = JSON.parse(JSON.stringify(req.body));
    console.info(`Received the product with \n PID ${product.pid} \n title ${product.title} \n URL ${product.url} \n imgURL ${product.imgUrl} \n price ${product.price}`);
    const history = {};
    const currentDate = new Date().setHours(0, 0, 0, 0) / 100000;
    if (testPid(product.pid) && product.title && product.title.length < 512 && testPrice(product.price) && testProductUrl(product.url) && testImageUrl(product.imgUrl)) {
        history[currentDate] = product.price;
        admin.database().ref(`/${product.pid}`)
            .set({
                title: product.title,
                url: product.url,
                imgUrl: product.imgUrl,
                history: history
            }, function (error) {
                if (error) {
                    console.error('An error occurred: ' + error);
                    res.status(500).json({
                        message: 'Product could not be saved.'
                    })
                } else {
                    console.info(`Product with PID ${product.pid} and price ${product.price} was saved.`);
                    res.status(200).json({
                        status: 'ok'
                    })
                }
            })
    } else {
        console.warn('Validation error');
        res.status(500).json({
            message: 'Validation error, please check the data!'
        })
    }
    return res;
});

/**
 * Updates the price of a product if it is not already in the database.
 * @type {HttpsFunction}
 */
exports.updateProduct = functions.https.onRequest((req, res) => {
    if (req.method === `OPTIONS`) {
        cors(req, res, () => {
            return res.status(200)
                .set('Access-Control-Allow-Origin', "*")
                .set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
                .set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Request-With')
                .json({
                    message: "Hello from Firebase"
                });
        });
    } else if (req.method !== 'POST') {
        return res.status(500)
            .json({
                message: `The method ${req.method} is not allowed for writing!`
            })
    }
    const product = JSON.parse(JSON.stringify(req.body));
    console.info(`Received product for update with PID ${product.pid} and price ${product.newPrice}`);
    const currentDate = new Date().setHours(0, 0, 0, 0) / 100000;
    console.info(currentDate);
    if (testPid(product.pid) && testPrice(product.newPrice)) {
        console.info(`Updating the price for PID ${product.pid} to ${product.newPrice}`);
        const updates = {};
        updates[`${product.pid}/history/${currentDate}`] = product.newPrice;
        admin.database().ref().update(updates, function (error) {
            if (error) {
                console.error('An error occurred: ' + error);
                res.status(500).json({
                    message: 'Product could not be updated.'
                })
            } else {
                console.info(`Product with PID ${product.pid} and price ${product.newPrice} was updated.`);
                res.json({
                    status: 'ok'
                })
            }
        });
    } else {
        console.warn('Validation error');
        res.status(500).json({
            message: 'Validation error, please check the data!'
        })
    }
    return res;
});

/*
    UTILS
 */
const pidRegex = /^\d+$/;
const priceRegex = /^\d+(?:\.\d{0,2})$/;

function startsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

function testPid(pid) {
    return typeof pid === "string" && pid && pid.length < 10 && pidRegex.test(pid);
}

function testPrice(price) {
    return typeof price === "string" && price && price.length < 12 && priceRegex.test(price);
}

function testProductUrl(url) {
    return url && url.length < 512 &&
        // check if product URL
        startsWith(url, "http://www.emag.") || startsWith(url, "https://www.emag.") || startsWith(url, "http://emag.") || startsWith(url, "https://emag.");
}

function testImageUrl(url) {
    return !url || (url && url.length < 512 &&
        (startsWith(url, "http://") && (url.indexOf("s0emagst") > 0 || url.indexOf("akamaized") > 0 || url.indexOf("images") > 0 || url.indexOf(".jpg") > 0)) ||
        (startsWith(url, "https://") && (url.indexOf("s0emagst") > 0 || url.indexOf("akamaized") > 0 || url.indexOf("images") > 0 || url.indexOf(".jpg") > 0)));
}
