"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const onboardingResponses_1 = require("../responses/onboardingResponses");
var DialogIds;
(function (DialogIds) {
    DialogIds["namePrompt"] = "namePrompt";
    DialogIds["emailPrompt"] = "emailPrompt";
    DialogIds["locationPrompt"] = "locationPrompt";
})(DialogIds || (DialogIds = {}));
class OnboardingDialog extends botbuilder_dialogs_1.ComponentDialog {
    // Constructor
    constructor(botServices, accessor, telemetryClient) {
        super(OnboardingDialog.name);
        this.accessor = accessor;
        this.initialDialogId = OnboardingDialog.name;
        const onboarding = [
            this.askForName.bind(this),
            this.finishOnboardingDialog.bind(this)
        ];
        // To capture built-in waterfall dialog telemetry, set the telemetry client
        // to the new waterfall dialog and add it to the component dialog
        this.telemetryClient = telemetryClient;
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog(this.initialDialogId, onboarding));
        this.addDialog(new botbuilder_dialogs_1.TextPrompt(DialogIds.namePrompt));
    }
    async askForName(sc) {
        this.state = await this.getStateFromAccessor(sc.context);
        if (this.state.name !== undefined && this.state.name.trim().length > 0) {
            return sc.next(this.state.name);
        }
        return sc.prompt(DialogIds.namePrompt, {
            prompt: await OnboardingDialog.responder.renderTemplate(sc.context, onboardingResponses_1.OnboardingResponses.responseIds.namePrompt, sc.context.activity.locale)
        });
    }
    async finishOnboardingDialog(sc) {
        this.state = await this.getStateFromAccessor(sc.context);
        this.state.name = sc.result;
        await this.accessor.set(sc.context, this.state);
        await OnboardingDialog.responder.replyWith(sc.context, onboardingResponses_1.OnboardingResponses.responseIds.haveNameMessage, {
            name: this.state.name
        });
        return sc.endDialog();
    }
    async getStateFromAccessor(context) {
        const state = await this.accessor.get(context);
        if (state === undefined) {
            const newState = {
                email: '',
                location: '',
                name: ''
            };
            await this.accessor.set(context, newState);
            return newState;
        }
        return state;
    }
}
exports.OnboardingDialog = OnboardingDialog;
// Fields
OnboardingDialog.responder = new onboardingResponses_1.OnboardingResponses();
//# sourceMappingURL=onboardingDialog.js.map