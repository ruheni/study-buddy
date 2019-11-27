"use strict";
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
const escalateResponses_1 = require("../responses/escalateResponses");
class EscalateDialog extends botbuilder_dialogs_1.ComponentDialog {
    // Constructor
    constructor(botServices, telemetryClient) {
        super(EscalateDialog.name);
        // Fields
        this.responder = new escalateResponses_1.EscalateResponses();
        this.initialDialogId = EscalateDialog.name;
        const escalate = [
            this.sendPhone.bind(this)
        ];
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog(this.initialDialogId, escalate));
        this.telemetryClient = telemetryClient;
    }
    async sendPhone(sc) {
        await this.responder.replyWith(sc.context, escalateResponses_1.EscalateResponses.responseIds.sendPhoneMessage);
        return sc.endDialog();
    }
}
exports.EscalateDialog = EscalateDialog;
//# sourceMappingURL=escalateDialog.js.map