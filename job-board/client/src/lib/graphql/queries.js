import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("http://localhost:9000/graphql");

export async function getJob(id) {
  const query = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        description
        company {
          id
          name
        }
        date
        title
        id
      }
    }
  `;
  const { job } = await client.request(query, { id });

  return job;
}

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        description
        company {
          description
          name
        }
        date
        title
        id
      }
    }
  `;

  const data = await client.request(query);

  return data.jobs;
}

export async function getCompany(id) {
  const query = gql`
    query GetCompanyById($id: ID!) {
      company(id: $id) {
        id
        name
        description
        jobs {
          id
          date
          title
          description
        }
      }
    }
  `;

  const { company } = await client.request(query, { id });
  return company;
}
