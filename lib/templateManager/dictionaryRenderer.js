"use strict";
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is a simple template engine which has a resource map of template functions
 * let myTemplates  = {
 *      "en" : {
 *        "templateId": (context, data) => $"your name  is {data.name}",
 *        "templateId": (context, data) => { return new Activity(); }
 *    }`
 * }
 * }
 *  To use, simply register with templateManager
 *  templateManager.register(new DictionaryRenderer(myTemplates))
 */
class DictionaryRenderer {
    constructor(templates) {
        this.languages = templates;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
    async renderTemplate(turnContext, language, templateId, data) {
        const templates = this.languages.get(language);
        if (templates !== undefined) {
            const template = templates.get(templateId);
            if (template !== undefined) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
                const result = template(turnContext, data);
                if (result !== undefined) {
                    return result;
                }
            }
        }
        return Promise.resolve(undefined);
    }
}
exports.DictionaryRenderer = DictionaryRenderer;
//# sourceMappingURL=dictionaryRenderer.js.map