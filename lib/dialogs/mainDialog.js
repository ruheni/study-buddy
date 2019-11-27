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
const botbuilder_ai_1 = require("botbuilder-ai");
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const botbuilder_skills_1 = require("botbuilder-skills");
const botbuilder_solutions_1 = require("botbuilder-solutions");
const botframework_schema_1 = require("botframework-schema");
const i18next_1 = __importDefault(require("i18next"));
const cancelResponses_1 = require("../responses/cancelResponses");
const mainResponses_1 = require("../responses/mainResponses");
const cancelDialog_1 = require("./cancelDialog");
const escalateDialog_1 = require("./escalateDialog");
const onboardingDialog_1 = require("./onboardingDialog");
var Events;
(function (Events) {
    Events["timeZoneEvent"] = "va.timeZone";
    Events["locationEvent"] = "va.location";
})(Events || (Events = {}));
class MainDialog extends botbuilder_solutions_1.RouterDialog {
    // Constructor
    constructor(settings, services, onboardingDialog, escalateDialog, cancelDialog, skillDialogs, skillContextAccessor, onboardingAccessor, telemetryClient) {
        super(MainDialog.name, telemetryClient);
        // Fields
        this.luisServiceGeneral = 'general';
        this.luisServiceFaq = 'faq';
        this.luisServiceChitchat = 'chitchat';
        this.responder = new mainResponses_1.MainResponses();
        this.settings = settings;
        this.services = services;
        this.onboardingAccessor = onboardingAccessor;
        this.skillContextAccessor = skillContextAccessor;
        this.telemetryClient = telemetryClient;
        this.addDialog(onboardingDialog);
        this.addDialog(escalateDialog);
        this.addDialog(cancelDialog);
        skillDialogs.forEach((skillDialog) => {
            this.addDialog(skillDialog);
        });
    }
    async onStart(dc) {
        const view = new mainResponses_1.MainResponses();
        const onboardingState = await this.onboardingAccessor.get(dc.context);
        if (onboardingState === undefined || onboardingState.name === undefined || onboardingState.name === '') {
            await view.replyWith(dc.context, mainResponses_1.MainResponses.responseIds.newUserGreeting);
        }
        else {
            await view.replyWith(dc.context, mainResponses_1.MainResponses.responseIds.returningUserGreeting);
        }
    }
    async route(dc) {
        // Get cognitive models for locale
        const locale = i18next_1.default.language.substring(0, 2);
        const cognitiveModels = this.services.cognitiveModelSets.get(locale);
        if (cognitiveModels === undefined) {
            throw new Error('There is no value in cognitiveModels');
        }
        // Check dispatch result
        const dispatchResult = await cognitiveModels.dispatchService.recognize(dc.context);
        const intent = botbuilder_ai_1.LuisRecognizer.topIntent(dispatchResult);
        if (this.settings.skills === undefined) {
            throw new Error('There is no skills in settings value');
        }
        // Identify if the dispatch intent matches any Action within a Skill if so, we pass to the appropriate SkillDialog to hand-off
        const identifiedSkill = botbuilder_skills_1.SkillRouter.isSkill(this.settings.skills, intent);
        if (identifiedSkill !== undefined) {
            // We have identified a skill so initialize the skill connection with the target skill
            const result = await dc.beginDialog(identifiedSkill.id);
            if (result.status === botbuilder_dialogs_1.DialogTurnStatus.complete) {
                await this.complete(dc);
            }
        }
        else if (intent === 'l_general') {
            // If dispatch result is general luis model
            const luisService = cognitiveModels.luisServices.get(this.luisServiceGeneral);
            if (luisService === undefined) {
                throw new Error('The specified LUIS Model could not be found in your Bot Services configuration.');
            }
            else {
                const result = await luisService.recognize(dc.context);
                if (result !== undefined) {
                    const generalIntent = botbuilder_ai_1.LuisRecognizer.topIntent(result);
                    // switch on general intents
                    switch (generalIntent) {
                        case 'Escalate': {
                            // start escalate dialog
                            await dc.beginDialog(escalateDialog_1.EscalateDialog.name);
                            break;
                        }
                        case 'None':
                        default: {
                            // No intent was identified, send confused message
                            await this.responder.replyWith(dc.context, mainResponses_1.MainResponses.responseIds.confused);
                        }
                    }
                }
            }
        }
        else if (intent === 'q_faq') {
            const qnaService = cognitiveModels.qnaServices.get(this.luisServiceFaq);
            if (qnaService === undefined) {
                throw new Error('The specified QnA Maker Service could not be found in your Bot Services configuration.');
            }
            else {
                const answers = await qnaService.getAnswers(dc.context);
                if (answers !== undefined && answers.length > 0) {
                    await dc.context.sendActivity(answers[0].answer, answers[0].answer);
                }
                else {
                    await this.responder.replyWith(dc.context, mainResponses_1.MainResponses.responseIds.confused);
                }
            }
        }
        else if (intent === 'q_chitchat') {
            const qnaService = cognitiveModels.qnaServices.get(this.luisServiceChitchat);
            if (qnaService === undefined) {
                throw new Error('The specified QnA Maker Service could not be found in your Bot Services configuration.');
            }
            else {
                const answers = await qnaService.getAnswers(dc.context);
                if (answers !== undefined && answers.length > 0) {
                    await dc.context.sendActivity(answers[0].answer, answers[0].answer);
                }
                else {
                    await this.responder.replyWith(dc.context, mainResponses_1.MainResponses.responseIds.confused);
                }
            }
        }
        else {
            // If dispatch intent does not map to configured models, send 'confused' response.
            await this.responder.replyWith(dc.context, mainResponses_1.MainResponses.responseIds.confused);
        }
    }
    async onEvent(dc) {
        // Check if there was an action submitted from intro card
        if (dc.context.activity.value) {
            // tslint:disable-next-line: no-unsafe-any
            if (dc.context.activity.value.action === 'startOnboarding') {
                await dc.beginDialog(onboardingDialog_1.OnboardingDialog.name);
                return;
            }
        }
        let forward = true;
        const ev = dc.context.activity;
        if (ev.name !== undefined && ev.name.trim().length > 0) {
            switch (ev.name) {
                case Events.timeZoneEvent: {
                    try {
                        const timezone = ev.value;
                        const tz = new Date().toLocaleString(timezone);
                        const timeZoneObj = {
                            timezone: tz
                        };
                        const skillContext = await this.skillContextAccessor.get(dc.context, new botbuilder_skills_1.SkillContext());
                        skillContext.setObj(timezone, timeZoneObj);
                        await this.skillContextAccessor.set(dc.context, skillContext);
                    }
                    catch (_a) {
                        await dc.context.sendActivity({
                            type: botframework_schema_1.ActivityTypes.Trace,
                            text: `"Timezone passed could not be mapped to a valid Timezone. Property not set."`
                        });
                    }
                    forward = false;
                    break;
                }
                case Events.locationEvent: {
                    const location = ev.value;
                    const locationObj = {
                        location: location
                    };
                    const skillContext = await this.skillContextAccessor.get(dc.context, new botbuilder_skills_1.SkillContext());
                    skillContext.setObj(location, locationObj);
                    await this.skillContextAccessor.set(dc.context, skillContext);
                    forward = true;
                    break;
                }
                case botbuilder_solutions_1.TokenEvents.tokenResponseEventName: {
                    forward = true;
                    break;
                }
                default: {
                    await dc.context.sendActivity({
                        type: botframework_schema_1.ActivityTypes.Trace,
                        text: `"Unknown Event ${ev.name} was received but not processed."`
                    });
                    forward = false;
                }
            }
        }
        if (forward) {
            const result = await dc.continueDialog();
            if (result.status === botbuilder_dialogs_1.DialogTurnStatus.complete) {
                await this.complete(dc);
            }
        }
    }
    async complete(dc, result) {
        // The active dialog's stack ended with a complete status
        await this.responder.replyWith(dc.context, mainResponses_1.MainResponses.responseIds.completed);
    }
    async onInterruptDialog(dc) {
        if (dc.context.activity.type === botframework_schema_1.ActivityTypes.Message) {
            const locale = i18next_1.default.language.substring(0, 2);
            const cognitiveModels = this.services.cognitiveModelSets.get(locale);
            if (cognitiveModels === undefined) {
                throw new Error('There is no cognitiveModels value');
            }
            // check luis intent
            const luisService = cognitiveModels.luisServices.get(this.luisServiceGeneral);
            if (luisService === undefined) {
                throw new Error('The general LUIS Model could not be found in your Bot Services configuration.');
            }
            else {
                const luisResult = await luisService.recognize(dc.context);
                const intent = botbuilder_ai_1.LuisRecognizer.topIntent(luisResult);
                // Only triggers interruption if confidence level is high
                if (luisResult.intents[intent] !== undefined && luisResult.intents[intent].score > 0.5) {
                    switch (intent) {
                        case 'Cancel': {
                            return this.onCancel(dc);
                        }
                        case 'Help': {
                            return this.onHelp(dc);
                        }
                        case 'Logout': {
                            return this.onLogout(dc);
                        }
                        default:
                    }
                }
            }
        }
        return botbuilder_solutions_1.InterruptionAction.NoAction;
    }
    async onCancel(dc) {
        if (dc.activeDialog !== undefined && dc.activeDialog.id !== cancelDialog_1.CancelDialog.name) {
            // Don't start restart cancel dialog
            await dc.beginDialog(cancelDialog_1.CancelDialog.name);
            // Signal that the dialog is waiting on user response
            return botbuilder_solutions_1.InterruptionAction.StartedDialog;
        }
        const view = new cancelResponses_1.CancelResponses();
        await view.replyWith(dc.context, cancelResponses_1.CancelResponses.responseIds.nothingToCancelMessage);
        return botbuilder_solutions_1.InterruptionAction.StartedDialog;
    }
    async onHelp(dc) {
        await this.responder.replyWith(dc.context, mainResponses_1.MainResponses.responseIds.help);
        // Signal the conversation was interrupted and should immediately continue
        return botbuilder_solutions_1.InterruptionAction.MessageSentToUser;
    }
    async onLogout(dc) {
        let adapter;
        const supported = dc.context.adapter instanceof botbuilder_1.BotFrameworkAdapter;
        if (!supported) {
            throw new Error('OAuthPrompt.SignOutUser(): not supported by the current adapter');
        }
        else {
            adapter = dc.context.adapter;
        }
        await dc.cancelAllDialogs();
        // Sign out user
        // PENDING check adapter.getTokenStatusAsync
        const tokens = [];
        tokens.forEach(async (token) => {
            if (token.connectionName !== undefined) {
                await adapter.signOutUser(dc.context, token.connectionName);
            }
        });
        await dc.context.sendActivity(i18next_1.default.t('main.logOut'));
        return botbuilder_solutions_1.InterruptionAction.StartedDialog;
    }
}
exports.MainDialog = MainDialog;
//# sourceMappingURL=mainDialog.js.map