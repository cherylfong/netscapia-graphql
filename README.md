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
