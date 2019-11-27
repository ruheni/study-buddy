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
const botframework_schema_1 = require("botframework-schema");
const fs_1 = require("fs");
const i18next_1 = __importDefault(require("i18next"));
const path_1 = require("path");
const dictionaryRenderer_1 = require("../templateManager/dictionaryRenderer");
const templateManager_1 = require("../templateManager/templateManager");
class MainResponses extends templateManager_1.TemplateManager {
    // Initialize the responses class properties
    constructor() {
        super();
        this.register(new dictionaryRenderer_1.DictionaryRenderer(MainResponses.responseTemplates));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
    static async buildNewUserGreetingCard(turnContext, data) {
        const introFileName = i18next_1.default.t('main.introGreetingFile');
        const introPath = path_1.join(__dirname, '..', 'content', introFileName);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
        const introCard = JSON.parse(fs_1.readFileSync(introPath, 'UTF8'));
        const attachment = botbuilder_1.CardFactory.adaptiveCard(introCard);
        // eslint-disable-next-line @typescript-eslint/tslint/config
        const response = botbuilder_1.MessageFactory.attachment(attachment, '', attachment.content.speak, botbuilder_1.InputHints.AcceptingInput);
        response.suggestedActions = {
            actions: [
                {
                    title: i18next_1.default.t('main.helpBtnText1'),
                    type: botframework_schema_1.ActionTypes.ImBack,
                    value: i18next_1.default.t('main.helpBtnValue1')
                },
                {
                    title: i18next_1.default.t('main.helpBtnText2'),
                    type: botframework_schema_1.ActionTypes.ImBack,
                    value: i18next_1.default.t('main.helpBtnValue2')
                },
                {
                    title: i18next_1.default.t('main.helpBtnText3'),
                    type: botframework_schema_1.ActionTypes.OpenUrl,
                    value: i18next_1.default.t('main.helpBtnValue3')
                }
            ],
            to: []
        };
        return Promise.resolve(response);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
    static async buildReturningUserGreetingCard(turnContext, data) {
        const introFileName = i18next_1.default.t('main.introReturningFile');
        const introPath = path_1.join(__dirname, '..', 'content', introFileName);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
        const introCard = JSON.parse(fs_1.readFileSync(introPath, 'UTF8'));
        const attachment = botbuilder_1.CardFactory.adaptiveCard(introCard);
        // eslint-disable-next-line @typescript-eslint/tslint/config
        const response = botbuilder_1.MessageFactory.attachment(attachment, '', attachment.content.speak, botbuilder_1.InputHints.AcceptingInput);
        response.suggestedActions = {
            actions: [
                {
                    title: i18next_1.default.t('main.helpBtnText1'),
                    type: botframework_schema_1.ActionTypes.ImBack,
                    value: i18next_1.default.t('main.helpBtnValue1')
                },
                {
                    title: i18next_1.default.t('main.helpBtnText2'),
                    type: botframework_schema_1.ActionTypes.ImBack,
                    value: i18next_1.default.t('main.helpBtnValue2')
                },
                {
                    title: i18next_1.default.t('main.helpBtnText3'),
                    type: botframework_schema_1.ActionTypes.OpenUrl,
                    value: i18next_1.default.t('main.helpBtnValue3')
                }
            ],
            to: []
        };
        return Promise.resolve(response);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
    static async buildHelpCard(turnContext, data) {
        const title = i18next_1.default.t('main.helpTitle');
        const text = i18next_1.default.t('main.helpText');
        const attachment = botbuilder_1.CardFactory.heroCard(title, text);
        const response = botbuilder_1.MessageFactory.attachment(attachment, text, botbuilder_1.InputHints.AcceptingInput);
        response.suggestedActions = {
            actions: [
                {
                    title: i18next_1.default.t('main.helpBtnText1'),
                    type: botframework_schema_1.ActionTypes.ImBack,
                    value: i18next_1.default.t('main.helpBtnValue1')
                },
                {
                    title: i18next_1.default.t('main.helpBtnText2'),
                    type: botframework_schema_1.ActionTypes.ImBack,
                    value: i18next_1.default.t('main.helpBtnValue2')
                },
                {
                    title: i18next_1.default.t('main.helpBtnText3'),
                    type: botframework_schema_1.ActionTypes.OpenUrl,
                    value: i18next_1.default.t('main.helpBtnValue3')
                }
            ],
            to: []
        };
        return Promise.resolve(response);
    }
    static fromResources(name) {
        return () => Promise.resolve(i18next_1.default.t(name));
    }
}
exports.MainResponses = MainResponses;
// Declare here the type of properties and the prompts
MainResponses.responseIds = {
    cancelled: 'cancelled',
    completed: 'completed',
    confused: 'confused',
    greeting: 'greeting',
    help: 'help',
    newUserGreeting: 'newUser',
    returningUserGreeting: 'returningUser'
};
// Declare the responses map prompts
MainResponses.responseTemplates = new Map([
    ['default', new Map([
            [MainResponses.responseIds.cancelled, MainResponses.fromResources('main.cancelled')],
            [MainResponses.responseIds.completed, MainResponses.fromResources('main.completed')],
            [MainResponses.responseIds.confused, MainResponses.fromResources('main.confused')],
            [MainResponses.responseIds.greeting, MainResponses.fromResources('main.greeting')],
            [MainResponses.responseIds.help, MainResponses.buildHelpCard],
            [MainResponses.responseIds.newUserGreeting, MainResponses.buildNewUserGreetingCard],
            [MainResponses.responseIds.returningUserGreeting, MainResponses.buildReturningUserGreetingCard]
        ])]
]);
//# sourceMappingURL=mainResponses.js.map