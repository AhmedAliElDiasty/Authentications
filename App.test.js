const App = require("./App")
// @ponicode
describe("shareLinkWithShareDialog", () => {
    let inst

    beforeEach(() => {
        inst = new App.default()
    })

    test("0", async () => {
        await inst.shareLinkWithShareDialog()
    })
})
