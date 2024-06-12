const { app, output, input } = require("@azure/functions");

const cosmosInput = input.cosmosDB({
    databaseName: "FilmDatabase",
    containerName: "Movie-Container",
    connection: "CosmosDB",
    qlQuery: "select * from c where c.id = {id}",
});

const cosmosOutput = output.cosmosDB({
  databaseName: "FilmDatabase",
  containerName: "Movie-Container",
  connection: "CosmosDB",
  createIfNotExists: true,
});

app.http("putItem", {
  methods: ["PUT"],
  authLevel: "anonymous",
  extraInputs: [cosmosInput],
  extraOutputs: [cosmosOutput],
  route: "update/movie/{id}",
  handler: async (request, context) => {
    const item = context.extraInputs.get(cosmosInput);
    const data = await request.json();
    console.log("UPDATE", data);
    data.id = item[0].id;

    context.extraOutputs.set(cosmosOutput, data);

    return {
      body: JSON.stringify(data),
      status: 200,
    };
  },
});
