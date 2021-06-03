
export default {
    namespaced: true,
    state: {
        content: [
            { id: 1, url: require("@/assets/images/Thumb1.jpg"), ref: "img1" },
             { id: 2, url: require("@/assets/images/Thumb2.jpg"), ref: "img2" },
            { id: 3, url: require("@/assets/images/Thumb3.jpg"), ref: "img3" }, 
        ],
    },
    getters: {
        getContent: (state) => state.content
    }

}