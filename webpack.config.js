import path from "path";

export default {
    mode: "development",
    entry: {
        map: "./src/map.js"
    }, 
    output: {
        filename: "[name].js",
        path: path.resolve("public/js")
    }
}