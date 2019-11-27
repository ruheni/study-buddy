"use strict";
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const botframework_schema_1 = require("botframework-schema");
class TemplateManager {
    constructor() {
        this.templateRenders = [];
        this.languageFallback = [];
    }
    /**
     * Add a template engine for binding templates
     */
    register(renderer) {
        if (!this.templateRenders.some((x) => x === renderer)) {
            this.templateRenders.push(renderer);
        }
        return this;
    }
    /**
     * List registered template engines
     */
    list() {
        return this.templateRenders;
    }
    setLanguagePolicy(languageFallback) {
        this.languageFallback = languageFallback;
    }
    getLanguagePolicy() {
        return this.languageFallback;
    }
    /**
     * Send a reply with the template
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
    async replyWith(turnContext, templateId, data) {
        if (turnContext === undefined) {
            throw new Error('turnContext is null');
        }
        // apply template
        const boundActivity = await this.renderTemplate(turnContext, templateId, turnContext.activity.locale, data);
        if (boundActivity !== undefined) {
            await turnContext.sendActivity(boundActivity);
            return;
        }
        return;
    }
    async renderTemplate(turnContext, templateId, language, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
    data) {
        const fallbackLocales = this.languageFallback;
        if (language !== undefined) {
            fallbackLocales.push(language);
        }
        fallbackLocales.push('default');
        // try each locale until successful
        for (const locale of fallbackLocales) {
            for (const renderer of this.templateRenders) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
                const templateOutput = await renderer.renderTemplate(turnContext, locale, templateId, data);
                if (templateOutput) {
                    if (typeof templateOutput === 'string' || templateOutput instanceof String) {
                        const def = { type: botframework_schema_1.ActivityTypes.Message, text: templateOutput };
                        return def;
                    }
                    else {
                        return templateOutput;
                    }
                }
            }
        }
        return undefined;
    }
}
exports.TemplateManager = TemplateManager;
//# sourceMappingURL=templateManager.js.map