/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRemotedbtable = /* GraphQL */ `
  query GetRemotedbtable($id: ID!) {
    getRemotedbtable(id: $id) {
      id
      dbname
      hostname
      username
      userpassword
      bussnessname
      bussnessId
      dbport
      bussnessLocation
      bussnessAdress
      bussnessCountry
      bussnessNbLocation
      dbtype
      
    }
  }
`;
export const listRemotedbtables = /* GraphQL  createdAt updatedAt */ `
  query ListRemotedbtables(
    $filter: ModelRemotedbtableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRemotedbtables(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        dbname
        hostname
        username
        userpassword
        bussnessname
        bussnessId
        dbport
        bussnessLocation
        bussnessAdress
        bussnessCountry
        bussnessNbLocation
        dbtype        
      }
      nextToken
    }
  }
`;
