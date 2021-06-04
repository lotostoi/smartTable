
export default {
    namespaced: true,
    state: {
        content: [
            { id: 1, url: require("@/assets/images/Thumb1.jpg"), ref: "img1", active: false },
            { id: 2, url: require("@/assets/images/Thumb2.jpg"), ref: "img2", active: false },
            { id: 3, url: require("@/assets/images/Thumb3.jpg"), ref: "img3", active: false },
        ],
    },
    getters: {
        getContent: (state) => state.content
    }

}