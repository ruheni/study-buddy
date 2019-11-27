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
const botbuilder_solutions_1 = require("botbuilder-solutions");
const botframework_schema_1 = require("botframework-schema");
const i18next_1 = __importDefault(require("i18next"));
const dictionaryRenderer_1 = require("../templateManager/dictionaryRenderer");
const templateManager_1 = require("../templateManager/templateManager");
class EscalateResponses extends templateManager_1.TemplateManager {
    // Initialize the responses class properties
    constructor() {
        super();
        this.register(new dictionaryRenderer_1.DictionaryRenderer(EscalateResponses.responseTemplates));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
    static async buildEscalateCard(turnContext, data) {
        const response = botbuilder_solutions_1.ActivityExtensions.createReply(turnContext.activity);
        const text = i18next_1.default.t('escalate.phoneInfo');
        response.attachments = [botbuilder_1.CardFactory.heroCard(text, undefined, [
                {
                    title: i18next_1.default.t('escalate.btnText1'),
                    type: botframework_schema_1.ActionTypes.OpenUrl,
                    value: i18next_1.default.t('escalate.btnValue1')
                },
                {
                    title: i18next_1.default.t('escalate.btnText2'),
                    type: botframework_schema_1.ActionTypes.OpenUrl,
                    value: i18next_1.default.t('escalate.btnValue2')
                }
            ])];
        return Promise.resolve(response);
    }
}
exports.EscalateResponses = EscalateResponses;
// Declare here the type of properties and the prompts
EscalateResponses.responseIds = {
    sendPhoneMessage: 'sendPhoneMessage'
};
// Declare the responses map prompts
EscalateResponses.responseTemplates = new Map([
    ['default', new Map([
            [
                EscalateResponses.responseIds.sendPhoneMessage,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
                (context, data) => EscalateResponses.buildEscalateCard(context, data)
            ]
        ])]
]);
//# sourceMappingURL=escalateResponses.js.map