import * as chai from "chai"
import { Flow } from "../src/directusTypes/v1/flow"
import { FlowImporter } from "../src/logic/import/flowsImporter"
import Directus from "../src/services/directus"
const {assert} = chai

describe('test integration', () => {
    it("Upload flow", async () => {
        const directus = new Directus("http://localhost:8055")
        const flowImporter = new FlowImporter(directus)

        const flowToImport: Flow = {
            "name": "flow1",
            "icon": "bolt",
            "color": null,
            "description": "description",
            "status": "active",
            "trigger": "event",
            "accountability": "all",
            "options": {
                "type": "action",
                "scope": [
                    "items.create"
                ],
                "collections": [
                    "order"
                ]
            },
            "operation": {
                "name": "log",
                "key": "log",
                "type": "log",
                "position_x": 19,
                "position_y": 1,
                "options": {},
                "resolve": {
                    name: "resolve",
                    key: "resolve",
                    "type": "log",
                    options: {},
                    "position_x": 37,
                    "position_y": 1,
                },
                "reject": {
                    name: "reject",
                    key: "reject",
                    "type": "log",
                    options: {},
                    "position_x": 37,
                    "position_y": 17,
                },
            }
        }

        await flowImporter.createFlow(flowToImport)

        assert.equal("bla", "bla")
    })
})