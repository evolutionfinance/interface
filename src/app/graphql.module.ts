import {InjectionToken, NgModule} from '@angular/core';
import {Apollo, APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, ApolloLink, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import {WebSocketLink} from '@apollo/client/link/ws';
import {getOperationAST} from 'graphql';
import {environment} from '../environments/environment';

function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
    const http = httpLink.create({uri: environment.mainGraphQLUrl});
    const ws = new WebSocketLink({
        uri: environment.graphQLWebsocketUrl,
        options: {
            reconnect: true,
        }
    });
    return {
        link: ApolloLink.split(
            // 3
            operation => {
                const operationAST = getOperationAST(operation.query, operation.operationName);
                return !!operationAST && operationAST.operation === 'subscription';
            },
            ws,
            http,
        ),
        cache: new InMemoryCache(),
    };
}

@NgModule({
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink],
        },
    ],
})
export class GraphQLModule {
}
