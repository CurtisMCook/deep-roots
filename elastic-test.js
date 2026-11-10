const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: process.env.ELASTIC_URL,
  auth: {
    apiKey: process.env.ELASTIC_API_KEY
  }
});

async function main() {
  const response = await client.search({
    index: 'attendees',
    query: {
      match_all: {}
    }
  });

  console.log(
    response.hits.hits.map(hit => hit._source)
  );
}

main().catch(console.error);
