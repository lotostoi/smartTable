
export default {
    namespaced: true,
    state: {
        content: [
            { id: 1, url: require("@/assets/images/Thumb1.jpg"), ref: "img1", active: false, type: 'image' },
            { id: 2, url: require("@/assets/images/Thumb2.jpg"), ref: "img2", active: false, type: 'image' },
            { id: 3, url: "https://inter-cat.net/", ref: "img3", active: false, type: 'link' },
            { id: 4, url: "http://ds-client.ifrm.ru/dkutv1", ref: "img3", active: false, type: 'link' },
            { id: 5, url: "https://inter-cat.net/", ref: "img3", active: false, type: 'link' },
            { id: 6, url: "http://ds-client.ifrm.ru/dkutv1", ref: "img3", active: false, type: 'link' },
        ],
    },
    getters: {
        getContent: (state) => state.content
    }

}