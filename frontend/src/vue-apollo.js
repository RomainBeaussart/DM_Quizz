import VueApollo from 'vue-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client'

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token'

// Http endpoint
const httpEndpoint = process.env.VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000/graphql'

// Config
const defaultOptions = {
    // You can use `https` for secure connection (recommended in production)
    httpEndpoint,
    // You can use `wss` for secure connection (recommended in production)
    // Use `null` to disable subscriptions
    wsEndpoint: process.env.VUE_APP_GRAPHQL_WS,
    // wsEndpoint: null,
    // LocalStorage token
    tokenName: AUTH_TOKEN,
    // Enable Automatic Query persisting with Apollo Engine
    persisting: false,
    // Use websockets for everything (no HTTP)
    // You need to pass a `wsEndpoint` for this to work
    websocketsOnly: false,
    // Is being rendered on the server?
    ssr: false,

    // Override default apollo link
    // note: don't override httpLink here, specify httpLink options in the
    // httpLinkOptions property of defaultOptions.
    // link: myLink

    // Override default cache
    cache: new InMemoryCache(),

    // Override the way the Authorization header is set
    // getAuth: (tokenName) => ...

    // Additional ApolloClient options
    // apollo: { ... }

    // Client local data (see apollo-link-state)
    // clientState: { resolvers: { ... }, defaults: { ... } }
}

// Call this in the Vue app file
export function createProvider(options = {}) {
    // Create apollo client
    const { apolloClient, wsClient } = createApolloClient({
        ...defaultOptions,
        ...options,
    })
    wsClient.connectionParams = () => ({
        headers: {
            Authorization: localStorage.getItem(AUTH_TOKEN) ? `Bearer ${localStorage.getItem(AUTH_TOKEN)}` : ''
        }
    })
    apolloClient.wsClient = wsClient

    // Create vue apollo provider
    const apolloProvider = new VueApollo({
        defaultClient: apolloClient,
        defaultOptions: {
            $query: {
                fetchPolicy: 'cache-and-network',
            },
        },
        errorHandler(error) {
            console.log("status", error.graphQLErrors)
            if (error.graphQLErrors.find(e => e.name === "AuthError")) {
                window.location.reload()
            }
            // eslint-disable-next-line no-console
            console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
        },
    })

    return apolloProvider
}

// Manually call this when user log in
export async function onLogin(apolloClient, token) {
    if (typeof localStorage !== 'undefined' && token) {
        localStorage.setItem(AUTH_TOKEN, token)
    }
    if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
    try {
        await apolloClient.resetStore()
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log('%cError on cache reset (login)', 'color: orange;', e.message)
    }
}

// Manually call this when user log out
export async function onLogout(apolloClient) {
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN)
    }
    if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
    try {
        await apolloClient.resetStore()
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
    }
}
