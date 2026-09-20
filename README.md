This is [part 8 of the fullstack open course](https://fullstackopen.com/en/part8) by <https://studies.cs.helsinki.fi>

[New Course Platform for GraphQL]( https://courses.mooc.fi/org/uh-cs/courses/full-stack-open-graphql )

### Github Actions Test Status

<!-- Branches ... do not have triggered tests through GitHub workflow actions. -->

<!-- <details>
<summary>...</summary>

</details>
<br/> -->

## Chapter 2 | GraphQL Server

### Basics

- Describes the data wanted by the browser before sending it to the API with a HTTP POST request.
- All GraphQL queries are sent to the same API URL.
- All GraphQL requests are POST requests.

### Schema and queries

All GraphQL applications have a [schema](https://graphql.org/learn/schema/) that describes the data sent between the client and server.

Practically every GraphQL schema describes a Query, which tells what kind of queries can be made to the API.

Exclamation marks are used to mark which return values and parameters that cannot be `null`.

A query can be made to return any field described in the schema.

GraphQL query describes only the data moving between a server and the client. On the server, the data can be organized and saved in any way. GraphQL does not have anything to do with databases. It does not care how the data is saved.

A GraphQL server must define resolvers for each field of each type in the schema. Otherwise, [Apollo GraphQL](https://www.apollographql.com/docs/apollo-server/api/apollo-server/) will define [default resolvers](https://www.graphql-tools.com/docs/resolvers/#default-resolver).

### Mutations

All operations that cause change are done with mutations. Mutations are described in the schema as the keys of type `Mutation`.

Mutations also require a resolver.

### Error Handling

Some error handling are automatically done with GraphQL [validation](https://graphql.org/learn/validation/).

## Chapter 3 | React and GraphQL

[Apollo Client](https://www.apollographql.com/docs/react/) handles server communication similar to Axios but is a higher-order library capable of abstracting the unnecessary details of the communication.

Installation

```bash
npm install @apollo/client graphql
```

The application can communicate with a GraphQL server using the `client` object. The client can be made accessible for all components of the application by wrapping the App component with `ApolloProvider` component.

Apollo Client offers a few alternatives for making [queries](https://www.apollographql.com/docs/react/data/queries/). Currently, the use of the hook function [useQuery](https://www.apollographql.com/docs/react/api/react/hooks/#usequery) is the dominant practice.

#### Caching and Mutations

Apollo client saves the responses of queries to [cache](https://www.apollographql.com/docs/react/caching/overview). To optimize performance if the response to a query is already in the cache, the query is not sent to the server at all.

The hook function [useMutation](https://www.apollographql.com/docs/react/api/react/hooks/#usemutation) provides the functionality for making mutations.

A way to keep the cache in sync is to use the useMutation hook's [refetchQueries](https://www.apollographql.com/docs/react/data/refetching/) parameter to define that the query fetching an array for example is done again whenever a new element is created.