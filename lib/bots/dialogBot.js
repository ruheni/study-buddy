"use strict";
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
class DialogBot extends botbuilder_1.ActivityHandler {
    constructor(conversationState, telemetryClient, dialog) {
        super();
        this.solutionName = 'studyBuddy';
        this.rootDialogId = dialog.id;
        this.telemetryClient = telemetryClient;
        this.dialogs = new botbuilder_dialogs_1.DialogSet(conversationState.createProperty(this.solutionName));
        this.dialogs.add(dialog);
        this.onTurn(this.turn.bind(this));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/tslint/config
    async turn(turnContext, next) {
        // Client notifying this bot took to long to respond (timed out)
        if (turnContext.activity.code === botbuilder_1.EndOfConversationCodes.BotTimedOut) {
            this.telemetryClient.trackTrace({
                message: `Timeout in ${turnContext.activity.channelId} channel: Bot took too long to respond`,
                severityLevel: botbuilder_1.Severity.Information
            });
            return;
        }
        const dc = await this.dialogs.createContext(turnContext);
        if (dc.activeDialog !== undefined) {
            await dc.continueDialog();
        }
        else {
            await dc.beginDialog(this.rootDialogId);
        }
        await next();
    }
}
exports.DialogBot = DialogBot;
//# sourceMappingURL=dialogBot.js.map