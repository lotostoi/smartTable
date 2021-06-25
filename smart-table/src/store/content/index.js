
export default {
    namespaced: true,
    state: {
        content: [
            { id: 'i1', url: require("@/assets/images/Thumb1.jpg"), ref: "img1", active: false, type: 'image' },
            { id: 'i2', url: require("@/assets/images/Thumb2.jpg"), ref: "img2", active: false, type: 'image' },
            { id: 'i3', url: "https://inter-cat.net/", ref: "img4", active: false, type: 'link' },
            { id: 'i4', url: "http://ds-client.ifrm.ru/dkutv1", ref: "img5", active: false, type: 'link' },
            { id: 'i5', url: "https://inter-cat.net/", ref: "img6", active: false, type: 'link' },
            { id: 'i6', url: "http://ds-client.ifrm.ru/dkutv1", ref: "img7", active: false, type: 'link' },
        ],
    },
    getters: {
        getContent: (state) => state.content
    }

}