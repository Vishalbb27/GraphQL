import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { getAccessToken } from "../auth";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient as createwsClient } from "graphql-ws";
import { Kind, OperationTypeNode } from "graphql";

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

const httpLink = concat(
  authLink,
  createHttpLink({ uri: "http://localhost:9001/graphql" })
);

const wsLink = new GraphQLWsLink(
  createwsClient({
    url: "ws://localhost:9001/graphql",
    connectionParams: {
      accessToken: getAccessToken(),
    },
  })
);

export const apolloClient = new ApolloClient({
  link: split(isSubscripton, wsLink, httpLink), //Redirect the request based on it is query or mutation
  cache: new InMemoryCache(),
});

function isSubscripton(operation) {
  const definition = getMainDefinition(operation.query);
  console.log(definition);
  return (
    definition.kind === Kind.OPERATION_DEFINITION &&
    definition.operation === OperationTypeNode.SUBSCRIPTION
  );
}
