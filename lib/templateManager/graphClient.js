"use strict";
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
class GraphClient {
    constructor(token) {
        this.token = token;
    }
    async getMe() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
        return new Promise((resolve, reject) => {
            const client = this.getAuthenticatedClient();
            return client
                .api('/me')
                .select('displayName')
                .get((err, res) => {
                if (err !== undefined) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }
    getAuthenticatedClient() {
        return microsoft_graph_client_1.Client.init({
            authProvider: (done) => {
                done(undefined, this.token);
            }
        });
    }
}
exports.GraphClient = GraphClient;
//# sourceMappingURL=graphClient.js.map