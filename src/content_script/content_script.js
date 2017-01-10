/**
 * Extracts price as a string value from a page
 * with multiple products (grid)
 *
 * @param container
 * @returns {string}
 */
function extractPriceGrid(container) {
    var price = $(".price-over", container)
    if (price.length) {
        var int = price.find(".money-int"),
            dec = price.find(".money-decimal")
        if (int.length) {
            return int.text().replace(/\D+/g, "") +
                (dec.length ?  "." + dec.text().replace(/\D+/g, '') : "")
        }
    }
}
/**
 * Extracts price from the product's home page
 *
 * @param container
 * @returns {string}
 */
function extractPriceProductPage(container) {
    var price = $(".product-new-price", container)
    if (price.length) {
        var dec = price.find("sup")
        price = price.clone().children().remove().end().text()
        return price.replace(/\D+/g, "") +
            (dec.length ?  "." + dec.text().replace(/\D+/g, '') : "")
    }
}
/**
 * Adds product id to sync store
 *
 * @param pid
 * @param callback
 */
function addProductToSyncStore(pid, callback) {
    var pidObj = {}
    pidObj[pid] = {}
    chrome.storage.sync.set(pidObj, function () {
        if (chrome.runtime.lastError) {
            callback(chrome.runtime.lastError.message)
        } else {
            chrome.storage.sync.getBytesInUse(null, function(bytesInUse) {
                if (chrome.runtime.lastError) {
                    callback(chrome.runtime.lastError.message)
                } else {
                    callback(null, bytesInUse)
                }
            })
        }
    })
}
/**
 * Adds product to local store
 *
 * @param pid
 * @param product
 */
function addProductToLocalStore(pid, product) {
    // TODO
}
/**
 * Adds price-checker button to product grid
 * Template for grid:
 *
 <button class="emg-button add-to-price-checker">
    <div class="emg-btn-icon">
        <span class="icon-i52-list-add"></span>
    </div>
    add to price-checker
 </button>
*/
function addGridButton(target) {
    var pid = $(target).attr("p")
    if (!pid) {
        var container = $(target).closest("form") || $(target).closest(".product-holder-grid")
        pid = container.find("input[type='hidden']").first().val()
    }
    chrome.storage.sync.get(pid, function(item) {
        if ($.isEmptyObject(item)) {
            var cloned = $('<button/>', {
                type: "button",
                text: "track price", // urmareste pret
                class: "emg-button add-to-price-checker",
                click: function () {
                    var crashed, result = {};
                    var container = $(target).closest("form") || $(target).closest(".product-holder-grid")
                    if (container.length) {
                        var priceValue = extractPriceGrid(container)
                        if (priceValue) {
                            result.price = [ priceValue ]

                            var link = container.find("a")
                            if (link.attr("href") && (link.attr("title") || link.attr("text"))) {
                                result.title = link.attr("title") || link.attr("text")
                                result.link = location.origin + link.attr("href")
                            } else {
                                crashed = true
                            }
                        } else {
                            crashed = true
                        }
                    } else {
                        crashed = true
                    }

                    var self = this;
                    if (crashed) {
                        swal("Oops...", "Something went wrong! (DOM structure change)", "error")
                    } else {
                        addProductToSyncStore(pid, function(err, bytesInUse) {
                            addProduct(pid, result)
                                .done(function() {
                                    swal("Added", "Product " + pid + " is now tracked: " + JSON.stringify(result)
                                        + "\n\nSpace usage: " + Math.round(bytesInUse * 10000/102400)/100 + "%", "success")
                                    $(self).hide()
                                })
                                .fail(function(xhr) {
                                    swal("Oops...", "Something went wrong! (API: " + xhr.responseText + ")", "error")
                                })
                                .always(function() {
                                    // TODO add product to local store anyways - make this configurable
                                    addProductToLocalStore(pid, result)
                                })
                        })
                    }
                }
            }).append(
                $('<div/>', {
                    class: "emg-btn-icon"
                }).append(
                    $('<span/>', {
                        class: "icon-i52-list-add"
                    })
                )
            )
            cloned.insertAfter(target)
        }
    })
}
/**
 * Adds price-checker button to product home page
 * Template for product home page:
 *
 <button class="btn btn-primary btn-emag btn-xl btn-block">
    <i class="emg-btn-icon" />
    add to price-checker
 </button>
*/
function addProductPageButton(target) {
    var pid = $(target).attr("data-offer-id")
    if (!pid) {
        var container = $(target).closest("form") || $(target).closest(".product-holder-grid")
        pid = container.find("input[type='hidden']").first().val()
    }
    chrome.storage.sync.get(null, function(item) {
        console.log("Store is: ")
        console.log(item)
    })
    chrome.storage.sync.get(pid, function(item) {
        if ($.isEmptyObject(item)) {
            var cloned = $('<button/>', {
                type: "button",
                text: "track price", // urmareste pret
                class: "btn btn-primary btn-emag btn-xl btn-block",
                click: function () {
                    var crashed, result = {};
                    var container = $(target).closest("form.main-product-form")
                    if (container.length) {
                        var priceValue = extractPriceProductPage(container)
                        if (priceValue) {
                            result.price = priceValue

                            var link = $(".page-title")
                            if (link.length) {
                                result.title = link.text().trim()
                                result.link = location.href
                            } else {
                                crashed = true
                            }
                        } else {
                            crashed = true
                        }
                    } else {
                        crashed = true
                    }

                    var self = this;
                    if (crashed) {
                        swal("Oops...", "Something went wrong! (DOM structure change)", "error")
                    } else {
                        addProductToSyncStore(pid, function(err, bytesInUse) {
                            addProduct(pid, result)
                                .done(function() {
                                    swal("Added", "Product " + pid + " is now tracked: " + JSON.stringify(result)
                                        + "\n\nSpace usage: " + Math.round(bytesInUse * 10000/102400)/100 + "%", "success")
                                    $(self).hide()
                                })
                                .fail(function(xhr) {
                                    swal("Oops...", "Something went wrong! (API: " + xhr.responseText + ")", "error")
                                })
                                .always(function() {
                                    // TODO add product to local store anyways - make this configurable
                                    addProductToLocalStore(pid, result)
                                })
                        })
                    }
                }
            }).append(
                $('<i/>', {
                    class: "em em-list-add_fill"
                })
            )
            cloned.insertAfter(target)
        }
    })
}

$("button.add-to-cart-new").each(function (index, value) {
    addGridButton(this)
})

$(".main-container-inner button.yeahIWantThisProduct").each(function (index, value) {
    addProductPageButton(this)
})
