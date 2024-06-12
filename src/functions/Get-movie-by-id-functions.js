const { app, output, input } = require("@azure/functions");

const cosmosInput = input.cosmosDB({
  databaseName: "FilmDatabase",
  containerName: "Movie-Container",
  connection: "CosmosDB",
  sqlQuery: "select * from c where c.id = {id}",
  parameters: [
    {
        name: "@filmId",
        value: ""
    }
]
});

app.http("getItem", {
  methods: ["GET"],
  authLevel: "anonymous",
  extraInputs: [cosmosInput],
  route: "movies/{id}",
  handler: async (request, context) => {
    const item = context.extraInputs.get(cosmosInput);

    return { body: JSON.stringify(item), status: 200 };
  },
});
