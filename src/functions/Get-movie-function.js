const { app, input } = require('@azure/functions');

const cosmosInput = input.cosmosDB({
    databaseName: "FilmDatabase",
    containerName: "Movie-Container",
    connection: "CosmosDB",
    sqlQuery: "Select * from c",
});

app.http("getItems", {
    methods: ["GET"],
    authLevel: "anonymous",
    extraInputs: [cosmosInput],
    route: "films",
    handler: async (request, context) => {
      const items = context.extraInputs.get(cosmosInput);
  
      return { body: JSON.stringify(items), status: 200 };
    },
  });
  
