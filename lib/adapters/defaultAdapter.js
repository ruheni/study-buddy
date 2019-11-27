"use strict";
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const botbuilder_azure_1 = require("botbuilder-azure");
const botbuilder_solutions_1 = require("botbuilder-solutions");
const i18next_1 = __importDefault(require("i18next"));
class DefaultAdapter extends botbuilder_1.BotFrameworkAdapter {
    constructor(settings, adapterSettings, telemetryClient, userState, conversationState) {
        super(adapterSettings);
        this.skills = [];
        this.onTurnError = async (context, error) => {
            await context.sendActivity({
                type: botbuilder_1.ActivityTypes.Trace,
                text: error.message
            });
            await context.sendActivity({
                type: botbuilder_1.ActivityTypes.Trace,
                text: error.stack
            });
            await context.sendActivity(i18next_1.default.t('main.error'));
            telemetryClient.trackException({ exception: error });
        };
        if (settings.cosmosDb === undefined) {
            throw new Error('There is no cosmosDb value in appsettings file');
        }
        if (settings.blobStorage === undefined) {
            throw new Error('There is no blobStorage value in appsettings file');
        }
        if (settings.appInsights === undefined) {
            throw new Error('There is no appInsights value in appsettings file');
        }
        if (settings.blobStorage === undefined) {
            throw new Error('There is no blobStorage value in appsettings file');
        }
        const transcriptStore = new botbuilder_azure_1.AzureBlobTranscriptStore({
            containerName: settings.blobStorage.container,
            storageAccountOrConnectionString: settings.blobStorage.connectionString
        });
        this.use(new botbuilder_1.TranscriptLoggerMiddleware(transcriptStore));
        this.use(new botbuilder_1.TelemetryLoggerMiddleware(telemetryClient, true));
        this.use(new botbuilder_1.ShowTypingMiddleware());
        this.use(new botbuilder_solutions_1.SetLocaleMiddleware(settings.defaultLocale || 'en-us'));
        this.use(new botbuilder_solutions_1.EventDebuggerMiddleware());
        // Use the AutoSaveStateMiddleware middleware to automatically read and write conversation and user state.
        this.use(new botbuilder_1.AutoSaveStateMiddleware(conversationState, userState));
    }
}
exports.DefaultAdapter = DefaultAdapter;
//# sourceMappingURL=defaultAdapter.js.map