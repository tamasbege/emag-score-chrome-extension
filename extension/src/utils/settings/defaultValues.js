import { PRICE_DECREASE } from "../../utils/product/priceChangeType"

export default {
    general: {
        onlineData: true,
        language: 'en',
        caching: true
    },
    notifications: {
        allow: true,
        priceVariation: PRICE_DECREASE
    },
    scan: {
        timeout: 10
    }
}
