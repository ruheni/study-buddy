"use strict";
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_ai_1 = require("botbuilder-ai");
const botframework_config_1 = require("botframework-config");
class BotServices {
    constructor(settings, telemetryClient) {
        this.cognitiveModelSets = new Map();
        const luisPredictionOptions = {
            telemetryClient: telemetryClient,
            logPersonalInformation: true
        };
        if (settings.cognitiveModels !== undefined) {
            settings.cognitiveModels.forEach((value, key) => {
                const language = key;
                const config = value;
                const dispatchModel = new botframework_config_1.DispatchService(config.dispatchModel);
                const dispatchApp = {
                    applicationId: dispatchModel.appId,
                    endpointKey: dispatchModel.subscriptionKey,
                    endpoint: dispatchModel.getEndpoint()
                };
                const cognitiveModelSet = {
                    dispatchService: new botbuilder_ai_1.LuisRecognizer(dispatchApp, luisPredictionOptions),
                    luisServices: new Map(),
                    qnaServices: new Map()
                };
                if (config.languageModels !== undefined) {
                    config.languageModels.forEach((model) => {
                        const luisService = new botframework_config_1.LuisService(model);
                        const luisApp = {
                            applicationId: luisService.appId,
                            endpointKey: luisService.subscriptionKey,
                            endpoint: luisService.getEndpoint()
                        };
                        cognitiveModelSet.luisServices.set(luisService.id, new botbuilder_ai_1.LuisRecognizer(luisApp, luisPredictionOptions));
                    });
                }
                config.knowledgeBases.forEach((kb) => {
                    const qnaEndpoint = {
                        knowledgeBaseId: kb.kbId,
                        endpointKey: kb.endpointKey,
                        host: kb.hostname
                    };
                    cognitiveModelSet.qnaServices.set(kb.id, new botbuilder_ai_1.QnAMaker(qnaEndpoint, undefined, telemetryClient, true));
                });
                this.cognitiveModelSets.set(language, cognitiveModelSet);
            });
        }
    }
}
exports.BotServices = BotServices;
//# sourceMappingURL=botServices.js.map