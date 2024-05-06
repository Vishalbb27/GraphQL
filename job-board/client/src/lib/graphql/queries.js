import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "../auth";
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  gql,
  InMemoryCache,
  concat,
} from "@apollo/client";

// const client = new GraphQLClient("http://localhost:9000/graphql", {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       return { Authorization: `Bearer ${accessToken}` };
//     }
//     return {};
//   },
// });

const httpLink = createHttpLink({
  uri: "http://localhost:9000/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: "network-only",
  //   },
  //   watchQuery: {
  //     fetchPolicy: "network-only",
  //   }, //To re-render the react component when the data changes
  // },
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    description
    company {
      id
      name
    }
    date
    title
    id
  }
`;

export const JobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;
export async function getJob(id) {
  // const { job } = await client.request(query, { id });

  const { data } = await apolloClient.query({
    query: JobByIdQuery,
    variables: { id },
  });

  return data.job;
}

export const jobQuery = gql`
  query Jobs($limit: Int!, $offset: Int!) {
    jobs(limit: $limit, offset: $offset) {
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

export async function getJobs() {
  const query = gql`
    query Jobs {
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

  // const data = await client.request(query);

  const { data } = await apolloClient.query({
    query,
    fetchPolicy: "network-only",
  });

  return data.jobs;
}
export const companyByIdQuery = gql`
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
export async function companyById(id) {
  // const { company } = await client.request(query, { id });
  // return company;

  const { data } = await apolloClient.query({
    companyByIdQuery,
    variables: { id },
  });

  return data.company;
}

export const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${jobDetailFragment}
  `;

  // const { job } = await client.request(mutation, {
  //   input: { title, description },
  // });
  // return job;

  const { data } = await apolloClient.mutate({
    mutation,
    variables: { input: { title, description } },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: JobByIdQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  }); // Manipulating the cache in a manual way

  return data.job;
}
