"use strict";
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const dictionaryRenderer_1 = require("../templateManager/dictionaryRenderer");
const templateManager_1 = require("../templateManager/templateManager");
class CancelResponses extends templateManager_1.TemplateManager {
    // Initialize the responses class properties
    constructor() {
        super();
        this.register(new dictionaryRenderer_1.DictionaryRenderer(CancelResponses.responseTemplates));
    }
    static fromResources(name) {
        return () => Promise.resolve(i18next_1.default.t(name));
    }
}
exports.CancelResponses = CancelResponses;
// Declare here the type of properties and the prompts
CancelResponses.responseIds = {
    cancelPrompt: 'cancelPrompt',
    cancelConfirmedMessage: 'cancelConfirmed',
    cancelDeniedMessage: 'cancelDenied',
    nothingToCancelMessage: 'nothingToCancel'
};
// Declare the responses map prompts
CancelResponses.responseTemplates = new Map([
    ['default', new Map([
            [CancelResponses.responseIds.cancelConfirmedMessage, CancelResponses.fromResources('cancel.cancelConfirmed')],
            [CancelResponses.responseIds.cancelDeniedMessage, CancelResponses.fromResources('cancel.cancelDenied')],
            [CancelResponses.responseIds.cancelPrompt, CancelResponses.fromResources('cancel.cancelPrompt')],
            [CancelResponses.responseIds.nothingToCancelMessage, CancelResponses.fromResources('cancel.nothingToCancel')]
        ])]
]);
//# sourceMappingURL=cancelResponses.js.map