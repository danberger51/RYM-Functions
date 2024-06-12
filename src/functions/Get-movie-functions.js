const { app, input } = require('@azure/functions');

const cosmosInput = input.cosmosDB({
    databaseName: "FilmDatabase",
    containerName: "Movie-Container",
    connection: "CosmosDB",
    qlQuery: "select * from c where c.id = {id}",
});

app.http("getItem", {
    methods: ["GET"],
    authLevel: "anonymous",
    extraInputs: [cosmosInput],
    route: "films/{id}",
    handler: async (request, context) => {
      const item = context.extraInputs.get(cosmosInput);
  
      return { body: JSON.stringify(item), status: 200 };
    },
  });
  