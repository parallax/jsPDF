if (typeof(Object.create) !== "function" || typeof(document.createElement("canvas").getContext) !== "function") {
    var global = (typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global ||  Function('return typeof this === "object" && this.content')() || Function('return this')())
    global.html2canvas = function() {
        return Promise.reject("No canvas support");
    };
}
