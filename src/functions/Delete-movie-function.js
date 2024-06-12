const { CosmosClient } = require("@azure/cosmos");
const { app } = require("@azure/functions");

const endpoint = "https://cosmosdb-acc01.documents.azure.com:443/";
const key = "6lVs5FWWfXB8FxVdEj9kdnZ5oYcknvKfbV4tpfNx13fB8z23MNONSz76pHSU2nX3jhxw5RosDvslACDbpfCAIg==";

const client = new CosmosClient({ endpoint, key });

const databaseId = "FilmDatabase";
const containerId = "Movie-Container";

app.http("deleteItem", {
    methods: ["DELETE"],
    authLevel: "anonymous",
    route: "movies/{id}",
    handler: async (request, context) => {
        const database = client.database(databaseId);
        const container = database.container(containerId);

        const itemId = request.params.id;

        // Use a parameterized query to check if the item exists before attempting to delete
        const { resources: items } = await container.items.query({
            query: "SELECT * FROM c WHERE c.id = @filmId",
            parameters: [
                { name: "@filmId", value: itemId }
            ]
        }).fetchAll();

        if (items.length === 0) {
            return {
                body: "Entity with the specified id does not exist.",
                status: 404
            };
        }

        // Delete the item if it exists
        const { resource: deletedItem } = await container.item(itemId, itemId).delete();

        return {
            body: JSON.stringify(deletedItem),
            status: 200
        };
    }
});
