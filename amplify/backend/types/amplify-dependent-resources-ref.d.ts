export type AmplifyDependentResourcesAttributes = {
  "api": {
    "apigraphqlbussnessdb": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string",
      "GraphQLAPIKeyOutput": "string"
    },
    "apirestforbusdb": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "function": {
    "ConnectToBusDb": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "teststoragevtwo": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}