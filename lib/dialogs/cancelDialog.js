"use strict";
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const cancelResponses_1 = require("../responses/cancelResponses");
var DialogIds;
(function (DialogIds) {
    DialogIds["cancelPrompt"] = "cancelprompt";
})(DialogIds || (DialogIds = {}));
class CancelDialog extends botbuilder_dialogs_1.ComponentDialog {
    // Constructor
    constructor() {
        super(CancelDialog.name);
        // Fields
        this.responder = new cancelResponses_1.CancelResponses();
        this.initialDialogId = CancelDialog.name;
        const cancel = [
            this.askToCancel.bind(this),
            this.finishCancelDialog.bind(this)
        ];
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog(this.initialDialogId, cancel));
        this.addDialog(new botbuilder_dialogs_1.ConfirmPrompt(DialogIds.cancelPrompt));
    }
    async endComponent(outerDC, result) {
        const doCancel = result;
        if (doCancel) {
            // If user chose to cancel
            await this.responder.replyWith(outerDC.context, cancelResponses_1.CancelResponses.responseIds.cancelConfirmedMessage);
            // Cancel all in outer stack of component i.e. the stack the component belongs to
            return outerDC.cancelAllDialogs();
        }
        else {
            // else if user chose not to cancel
            await this.responder.replyWith(outerDC.context, cancelResponses_1.CancelResponses.responseIds.cancelDeniedMessage);
            // End this component. Will trigger reprompt/resume on outer stack
            return outerDC.endDialog();
        }
    }
    async askToCancel(sc) {
        return sc.prompt(DialogIds.cancelPrompt, {
            prompt: await this.responder.renderTemplate(sc.context, sc.context.activity.locale, cancelResponses_1.CancelResponses.responseIds.cancelPrompt)
        });
    }
    async finishCancelDialog(sc) {
        return sc.endDialog(sc.result);
    }
}
exports.CancelDialog = CancelDialog;
//# sourceMappingURL=cancelDialog.js.map