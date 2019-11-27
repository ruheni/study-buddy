"use strict";
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const botbuilder_applicationinsights_1 = require("botbuilder-applicationinsights");
const botbuilder_azure_1 = require("botbuilder-azure");
const botbuilder_skills_1 = require("botbuilder-skills");
const botbuilder_solutions_1 = require("botbuilder-solutions");
const botframework_connector_1 = require("botframework-connector");
const i18next_1 = __importDefault(require("i18next"));
// tslint:disable-next-line: match-default-export-name
const i18next_node_fs_backend_1 = __importDefault(require("i18next-node-fs-backend"));
const path = __importStar(require("path"));
const restify = __importStar(require("restify"));
const defaultAdapter_1 = require("./adapters/defaultAdapter");
const appsettings = __importStar(require("./appsettings.json"));
const dialogBot_1 = require("./bots/dialogBot");
const cognitiveModelsRaw = __importStar(require("./cognitivemodels.json"));
const cancelDialog_1 = require("./dialogs/cancelDialog");
const escalateDialog_1 = require("./dialogs/escalateDialog");
const mainDialog_1 = require("./dialogs/mainDialog");
const onboardingDialog_1 = require("./dialogs/onboardingDialog");
const botServices_1 = require("./services/botServices");
const skills_json_1 = require("./skills.json");
// Configure internationalization and default locale
// tslint:disable-next-line: no-floating-promises
i18next_1.default.use(i18next_node_fs_backend_1.default)
    .init({
    fallbackLng: 'en',
    preload: ['de', 'en', 'es', 'fr', 'it', 'zh'],
    backend: {
        loadPath: path.join(__dirname, 'locales', '{{lng}}.json')
    }
})
    .then(async () => {
    await botbuilder_solutions_1.Locales.addResourcesFromPath(i18next_1.default, 'common');
});
const skills = skills_json_1.skills;
const cognitiveModels = new Map();
const cognitiveModelDictionary = cognitiveModelsRaw.cognitiveModels;
const cognitiveModelMap = new Map(Object.entries(cognitiveModelDictionary));
cognitiveModelMap.forEach((value, key) => {
    cognitiveModels.set(key, value);
});
const botSettings = {
    appInsights: appsettings.appInsights,
    blobStorage: appsettings.blobStorage,
    cognitiveModels: cognitiveModels,
    cosmosDb: appsettings.cosmosDb,
    defaultLocale: cognitiveModelsRaw.defaultLocale,
    microsoftAppId: appsettings.microsoftAppId,
    microsoftAppPassword: appsettings.microsoftAppPassword,
    skills: skills
};
function getTelemetryClient(settings) {
    if (settings !== undefined && settings.appInsights !== undefined && settings.appInsights.instrumentationKey !== undefined) {
        const instrumentationKey = settings.appInsights.instrumentationKey;
        return new botbuilder_applicationinsights_1.ApplicationInsightsTelemetryClient(instrumentationKey);
    }
    return new botbuilder_1.NullTelemetryClient();
}
const telemetryClient = getTelemetryClient(botSettings);
const adapterSettings = {
    appId: botSettings.microsoftAppId,
    appPassword: botSettings.microsoftAppPassword
};
let cosmosDbStorageSettings;
if (botSettings.cosmosDb === undefined) {
    throw new Error();
}
cosmosDbStorageSettings = {
    authKey: botSettings.cosmosDb.authKey,
    collectionId: botSettings.cosmosDb.collectionId,
    databaseId: botSettings.cosmosDb.databaseId,
    serviceEndpoint: botSettings.cosmosDb.cosmosDBEndpoint
};
const storage = new botbuilder_azure_1.CosmosDbStorage(cosmosDbStorageSettings);
const userState = new botbuilder_1.UserState(storage);
const conversationState = new botbuilder_1.ConversationState(storage);
const appCredentials = new botframework_connector_1.MicrosoftAppCredentials(botSettings.microsoftAppId || '', botSettings.microsoftAppPassword || '');
const adapter = new defaultAdapter_1.DefaultAdapter(botSettings, adapterSettings, telemetryClient, userState, conversationState);
// const webSocketEnabledHttpAdapter: webSocketEnabledHttpAdapter = (botsettings, adapter))
let bot;
try {
    const botServices = new botServices_1.BotServices(botSettings, telemetryClient);
    const onboardingStateAccessor = userState.createProperty('OnboardingState');
    const skillContextAccessor = userState.createProperty(botbuilder_skills_1.SkillContext.name);
    const onboardingDialog = new onboardingDialog_1.OnboardingDialog(botServices, onboardingStateAccessor, telemetryClient);
    const escalateDialog = new escalateDialog_1.EscalateDialog(botServices, telemetryClient);
    const cancelDialog = new cancelDialog_1.CancelDialog();
    const skillDialogs = skills.map((skill) => {
        const authDialog = buildAuthDialog(skill, botSettings, appCredentials);
        const credentials = new botbuilder_skills_1.MicrosoftAppCredentialsEx(botSettings.microsoftAppId || '', botSettings.microsoftAppPassword || '', skill.msaAppId);
        return new botbuilder_skills_1.SkillDialog(skill, credentials, telemetryClient, skillContextAccessor, authDialog);
    });
    const mainDialog = new mainDialog_1.MainDialog(botSettings, botServices, onboardingDialog, escalateDialog, cancelDialog, skillDialogs, skillContextAccessor, onboardingStateAccessor, telemetryClient);
    bot = new dialogBot_1.DialogBot(conversationState, telemetryClient, mainDialog);
}
catch (err) {
    throw err;
}
// Create server
const server = restify.createServer();
// Enable the Application Insights middleware, which helps correlate all activity
// based on the incoming request.
server.use(restify.plugins.bodyParser());
// tslint:disable-next-line:no-unsafe-any
server.use(botbuilder_applicationinsights_1.ApplicationInsightsWebserverMiddleware);
server.listen(process.env.port || process.env.PORT || '3979', () => {
    // tslint:disable-next-line:no-console
    console.log(`${server.name} listening to ${server.url}`);
    // tslint:disable-next-line:no-console
    console.log(`Get the Emulator: https://aka.ms/botframework-emulator`);
    // tslint:disable-next-line:no-console
    console.log(`To talk to your bot, open your '.bot' file in the Emulator`);
});
// Listen for incoming requests
server.post('/api/messages', async (req, res) => {
    // Route received a request to adapter for processing
    await adapter.processActivity(req, res, async (turnContext) => {
        // route to bot activity handler.
        await bot.run(turnContext);
    });
});
// This method creates a MultiProviderAuthDialog based on a skill manifest.
function buildAuthDialog(skill, settings, credentials) {
    if (skill.authenticationConnections !== undefined && skill.authenticationConnections.length > 0) {
        if (settings.oauthConnections !== undefined) {
            const oauthConnections = settings.oauthConnections.filter((oauthConnection) => {
                return skill.authenticationConnections.some((authenticationConnection) => {
                    return authenticationConnection.serviceProviderId === oauthConnection.provider;
                });
            });
            if (oauthConnections !== undefined) {
                return new botbuilder_solutions_1.MultiProviderAuthDialog(oauthConnections, credentials);
            }
        }
        else {
            throw new Error(`You must configure at least one supported OAuth connection to use this skill: ${skill.name}.`);
        }
    }
    return undefined;
}
//# sourceMappingURL=index.js.map