import createApp from "../reactive-mini.js";


class Controlador {

}
// Model
// fill model
let model = {};
(async function fillModel(params) {
    const response = await fetch('jobs.json')
    const jobs = await response.json()
    model.jobs = jobs
    const app = createApp({
        data: () => model,
        functions: Controlador
    })
    app.mount();
})();

//Controlador




