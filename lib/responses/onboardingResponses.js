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
class OnboardingResponses extends templateManager_1.TemplateManager {
    // Initialize the responses class properties
    constructor() {
        super();
        this.register(new dictionaryRenderer_1.DictionaryRenderer(OnboardingResponses.responseTemplates));
    }
    static fromResources(name) {
        return () => Promise.resolve(i18next_1.default.t(name));
    }
}
exports.OnboardingResponses = OnboardingResponses;
// Declare here the type of properties and the prompts
OnboardingResponses.responseIds = {
    emailPrompt: 'emailPrompt',
    haveEmailMessage: 'haveEmail',
    haveNameMessage: 'haveName',
    haveLocationMessage: 'haveLocation',
    locationPrompt: 'locationPrompt',
    namePrompt: 'namePrompt'
};
// Declare the responses map prompts
OnboardingResponses.responseTemplates = new Map([
    ['default', new Map([
            [OnboardingResponses.responseIds.emailPrompt, OnboardingResponses.fromResources('onboarding.emailPrompt')],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
            [OnboardingResponses.responseIds.haveEmailMessage, async (context, data) => {
                    const value = i18next_1.default.t('onboarding.haveEmail');
                    // tslint:disable-next-line: no-unsafe-any
                    return value.replace('{0}', data.email);
                }],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
            [OnboardingResponses.responseIds.haveLocationMessage, async (context, data) => {
                    const value = i18next_1.default.t('onboarding.haveLocation');
                    // tslint:disable-next-line: no-unsafe-any
                    return value.replace('{0}', data.name)
                        // tslint:disable-next-line: no-unsafe-any
                        .replace('{1}', data.location);
                }],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
            [OnboardingResponses.responseIds.haveNameMessage, async (context, data) => {
                    const value = i18next_1.default.t('onboarding.haveName');
                    // tslint:disable-next-line: no-unsafe-any
                    return value.replace('{0}', data.name);
                }],
            [OnboardingResponses.responseIds.namePrompt, OnboardingResponses.fromResources('onboarding.namePrompt')],
            [OnboardingResponses.responseIds.locationPrompt, OnboardingResponses.fromResources('onboarding.locationPrompt')]
        ])]
]);
//# sourceMappingURL=onboardingResponses.js.map