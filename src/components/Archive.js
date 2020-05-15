import React, { Component } from 'react';
import { ApolloClient } from 'apollo-boost';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider, Query } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { Token, Endpoint } from '../authorization';
import gql from "graphql-tag";
import "../css/archive.css"

// Setup Client
const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: Token ? `${Token}` : ''
        },
    };
});
const clientCache = new InMemoryCache();
const clientLink = new HttpLink({
    uri: Endpoint,
});
const client = new ApolloClient({
    cache: clientCache,
    link: authLink.concat(clientLink),
});

// Component Class
export default class Archive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 10,
            backClass: 'invisible',
        };
    }
    getForthClass(i) {
        if (i === this.state.size) {
            return 'archiveButton';
        } else {
            return 'invisible';
        }
    }
    render() {
        return (
            <ApolloProvider client={client}>
                <div>
                    <div className="archiveSearchContainer"></div>
                    <div id="contentContainer">
                        <Query query={gql(`query { mapList(size: ${this.state.size}, page: ${this.state.page}) {id mapName creatorName createdAt description}}`)}>
                            {({ loading, error, data }) => {
                                if (loading) return "";
                                if (error) return `Error! ${error.message}`;
                                if (data) {
                                    return <div className="archiveContent">
                                        {Array.from(data.mapList).map(m => {
                                            let mapName = 'Unnamed Map';
                                            let creatorName = 'Anonymous Creator';
                                            let description = '';
                                            if (m.mapName !== null) {
                                                mapName = m.mapName
                                            }
                                            if (m.creatorName !== null) {
                                                creatorName = m.creatorName
                                            }
                                            if (m.description !== null) {
                                                description = m.description
                                            }
                                            return (
                                                <div key={m.id} className="archiveEntryContainer">
                                                    <div className="archiveLeftContainer">
                                                        <div className="archiveTitleContainer">{mapName} by {creatorName}</div>
                                                        <div className="archiveDateContainer">{m.createdAt}</div>
                                                        <div className="archiveLinkContainer">
                                                            <a className="stdLink" href={`./page=viewmap:${m.id}`}>View Map</a></div>
                                                    </div>
                                                    <div className="archiveRightContainer">{description}</div>
                                                </div>);
                                        })}
                                        <div className="archiveButtonContainer">
                                            <button className={this.state.backClass}
                                                onClick={() => {
                                                    if (this.state.page === 1) {
                                                        this.setState({ page: this.state.page - 1, backClass: "invisible" });
                                                    } else {
                                                        this.setState({ page: this.state.page - 1 });

                                                    }
                                                }}>« Back</button>
                                            <button className={this.getForthClass(Array.from(data.mapList).length)} 
                                            onClick={() => this.setState({ page: this.state.page + 1, backClass: "archiveButton" })}>
                                                Forth »</button>
                                        </div>
                                    </div>
                                }
                            }}
                        </Query>
                    </div>
                </div>
            </ApolloProvider>
        );
    }
}