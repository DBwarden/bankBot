'use strict';
// --------------- Intents -----------------------

/**
 * Called when the user specifies an intent for this skill.
 */
function dispatch(intentRequest, callback) {
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    
    const intentName = intentRequest.currentIntent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'CheckBalance') {
        return checkBalance(intentRequest, callback);
    } else if (intentName === 'PayBills') {
        return payBills(intentRequest, callback);
    } else if (intentName === 'CheckLoans') {
        return checkLoans(intentRequest, callback);
    } else if (intentName === 'LastPersonPaid') {
        return lastPersonPaid(intentRequest, callback);
    } else if (intentName === 'greeting') {
        callback(greeting(intentRequest));
    } else if (intentName === 'Help') {
        callback(help(intentRequest));
    } else if (intentName === 'LastCharge') {
        return lastCharge(intentRequest, callback);
    } else if (intentName === 'Nothing') {
        callback(nothing(intentRequest));
    } else if (intentName === 'BankBotHours') {
        callback(hours(intentRequest));
    } else if (intentName === 'TransferToAgent') {
        callback(transferToAgent(intentRequest));
    } else if (intentName === 'Thanks') {
        callback(thanks(intentRequest));
    } else if (intentName === 'speech') {
        callback(speech(intentRequest));
    } else {
        throw new Error(`Intent with name ${intentName} not supported`);
    }
}

// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    try {
        // By default, treat the user request as coming from the America/New_York time zone.
        process.env.TZ = 'America/New_York';
        console.log(`event.bot.name=${event.bot.name}`);


        if (event.bot.name !== 'BankBot') {
            console.log('checking the bot name.');
            callback('Invalid Bot Name');
        }
       
        dispatch(event, (response) => callback(null, response));
    } catch (err) {
        callback(err);
    }
};

// --------------- Functions that control the bot's behavior -----------------------


function checkBalance(intentRequest, callback) {
    const accountType = intentRequest.currentIntent.slots.AccountType;
    const source = intentRequest.invocationSource;

    if (source === 'DialogCodeHook') {
        const slots = intentRequest.currentIntent.slots;
        const validationResult = validateCheckBalance(accountType);
        if (!validationResult.isValid) {
            console.log('check balance function');
            slots[`${validationResult.violatedSlot}`] = null;
            callback(elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, validationResult.violatedSlot, validationResult.message));
            return;

        }

        const outputSessionAttributes = intentRequest.sessionAttributes || {};
        if (accountType) {
            outputSessionAttributes.Price = accountType.length * 5; // Elegant pricing model
        }
        callback(delegate(outputSessionAttributes, intentRequest.currentIntent.slots));
        return;
    }

    callback(close(intentRequest.sessionAttributes, 'Fulfilled',
        { contentType: 'PlainText', content: `Your ${accountType} account has ` + balance(accountType) + ' in it.' }));
}


function payBills(intentRequest, callback) {
    const billType = intentRequest.currentIntent.slots.BillType;
    const source = intentRequest.invocationSource;

    if (source === 'DialogCodeHook') {
        const slots = intentRequest.currentIntent.slots;
        const validationResult = validatePayBills(billType);
        if (!validationResult.isValid) {
            console.log('pay bills function');
            slots[`${validationResult.violatedSlot}`] = null;
            callback(elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, validationResult.violatedSlot, validationResult.message));
            return;

        }

        const outputSessionAttributes = intentRequest.sessionAttributes || {};
        if (billType) {
            outputSessionAttributes.Price = billType.length * 5; // Elegant pricing model
        }
        callback(delegate(outputSessionAttributes, intentRequest.currentIntent.slots));
        return;
    }

    callback(close(intentRequest.sessionAttributes, 'Fulfilled',
        { contentType: 'PlainText', content: `Your ${billType} has been payed in the amount of ` + bills(billType) }));
}

function checkLoans(intentRequest, callback) {
    const loanType = intentRequest.currentIntent.slots.LoanType;
    const source = intentRequest.invocationSource;

    if (source === 'DialogCodeHook') {
        const slots = intentRequest.currentIntent.slots;
        const validationResult = validateCheckLoans(loanType);
        if (!validationResult.isValid) {
            console.log('check balance function');
            slots[`${validationResult.violatedSlot}`] = null;
            callback(elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, validationResult.violatedSlot, validationResult.message));
            return;

        }

        const outputSessionAttributes = intentRequest.sessionAttributes || {};
        if (loanType) {
            outputSessionAttributes.Price = loanType.length * 5; // Elegant pricing model
        }
        callback(delegate(outputSessionAttributes, intentRequest.currentIntent.slots));
        return;
    }

    callback(close(intentRequest.sessionAttributes, 'Fulfilled',
        { contentType: 'PlainText', content: `Your ${loanType} loan balance is ` + loans(loanType) }));
}




function lastCharge(intentRequest, callback) {
    const accountType = intentRequest.currentIntent.slots.AccountType;
    const source = intentRequest.invocationSource;

    if (source === 'DialogCodeHook') {
        const slots = intentRequest.currentIntent.slots;
        const validationResult = validateLastCharge(accountType);
        if (!validationResult.isValid) {
            console.log('check balance function');
            slots[`${validationResult.violatedSlot}`] = null;
            callback(elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, validationResult.violatedSlot, validationResult.message));
            return;

        }

        const outputSessionAttributes = intentRequest.sessionAttributes || {};
        if (accountType) {
            outputSessionAttributes.Price = accountType.length * 5; // Elegant pricing model
        }
        callback(delegate(outputSessionAttributes, intentRequest.currentIntent.slots));
        return;
    }

    callback(close(intentRequest.sessionAttributes, 'Fulfilled',
        { contentType: 'PlainText', content: `the last charge on your ${accountType} account was ` + charge(accountType)}));
}


function lastPersonPaid(intentRequest, callback) {
    const nameType = intentRequest.currentIntent.slots.nameType;
    const source = intentRequest.invocationSource;

    if (source === 'DialogCodeHook') {
        const slots = intentRequest.currentIntent.slots;
        const validationResult = validateLastPersonPaid(nameType);
        if (!validationResult.isValid) {
            console.log('check last person paid function');
            slots[`${validationResult.violatedSlot}`] = null;
            callback(elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, validationResult.violatedSlot, validationResult.message));
            return;

        }

        const outputSessionAttributes = intentRequest.sessionAttributes || {};
        if (nameType) {
            outputSessionAttributes.Price = nameType.length * 5; // Elegant pricing model
        }
        callback(delegate(outputSessionAttributes, intentRequest.currentIntent.slots));
        return;
    }

    callback(close(intentRequest.sessionAttributes, 'Fulfilled',
        { contentType: 'PlainText', content: `You last paid ${nameType} on  ` + randomDate(new Date(2012, 0, 1), new Date()) + ` for ` + people(nameType) }));
}




function nothing(intent_request) {
    console.log(intent_request);
    console.log('reached nothing');

    return {
        'sessionAttributes': intent_request['sessionAttributes'],
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': 'Thank you. have a great day!'
            },

        }
    };

}

function transferToAgent(intent_request) {
    console.log(intent_request);
    console.log('reached nothing');

    return {
        'sessionAttributes': intent_request['sessionAttributes'],
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': 'No problem. Transferring you now.'
            },

        }
    };

}

function help(intent_request) {
    console.log(intent_request);
    console.log('reached greeting');

    return {
        'sessionAttributes': intent_request['sessionAttributes'],
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': 'Some of the things you can do are check your balance, pay a bill, check the last charge on your account, and check to see when you last paid someone.'
            },

        }
    };

}

function greeting(intent_request) {
    console.log(intent_request);
    console.log('reached greeting');

    return {
        'sessionAttributes': intent_request['sessionAttributes'],
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': 'Hello, thanks for using our banking service you can simply tell me what you\'d like to do or if you need options you may say help.'
            },

        }
    };

}


function speech(intent_request) {
    console.log(intent_request);
    console.log('reached greeting');

    return {
        'sessionAttributes': intent_request['sessionAttributes'],
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': 'Im sorry, but I dont want to be an emperor. Thats not my business. I dont want to rule or conquer anyone. I should like to help everyone - if possible - Jew, Gentile - black man - white. We all want to help one another. Human beings are like that. We want to live by each others happiness - not by each other’s misery. We don’t want to hate.and despise one another. In this world there is room for everyone. And the good earth is rich and can provide for everyone. The way of life can be free and beautiful, but we have lost the way.Greed has poisoned men’s souls, has barricaded the world with hate, has goose-stepped us into misery and bloodshed. We have developed speed, but we have shut ourselves in. Machinery that gives abundance has left us in want. Our knowledge has made us cynical. Our cleverness, hard and unkind. We think too much and feel too little.'
            },

        }
    };

}

function hours(intent_request) {
    console.log(intent_request);
    console.log('reached hours');

    return {
        'sessionAttributes': intent_request['sessionAttributes'],
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': 'We are open from 6-9 monday through saturday and 9-5 on sunday.'
            },

        }
    };

}



function thanks(intent_request) {
    console.log(intent_request);
    console.log('reached nothing');

    return {
        'sessionAttributes': intent_request['sessionAttributes'],
        'dialogAction': {
            'type': 'Close',
            'fulfillmentState': 'Fulfilled',
            'message': {
                'contentType': 'PlainText',
                'content': 'No problem! Have a great day!'
            },

        }
    };

}
  
//------------------Functions that validate slots-----------------------------------


function validateCheckBalance(accountType) {
    const accountTypes = ['checking', 'savings', 'IRA', 'checkings', 'saving'];
    if (accountType && accountTypes.indexOf(accountType.toLowerCase()) === -1) {
        console.log('validating check balance');
        return buildValidationResult(false, 'AccountType', `I do no recoginize ${accountType} as a valid account type. Would you like to check your savings or checking account?`);
    }
    return buildValidationResult(true, null, null);
}

function validatePayBills(billType) {
    const billTypes = ['internet', 'rent', 'phone', 'car', 'electricity', 'heat', 'insurance'];
    if (billType && billTypes.indexOf(billType.toLowerCase()) === -1) {
        console.log('validating pay bills');
        return buildValidationResult(false, 'BillType', `It does not look like you have a ${billType} bill with us. Please enter another bill.`);
    }
    return (true, null, null);
}


function validateCheckLoans(loanType) {
    const loanTypes = ['personal', 'mortgage', 'car', 'payday', 'student', 'auto'];
    if (loanType && loanTypes.indexOf(loanType.toLowerCase()) === -1) {
        console.log('validating check balance');
        return buildValidationResult(false, 'loanType', `It doesn\'t look like you have a ${loanType} loan with us. Please try another one.`);
    }
    return buildValidationResult(true, null, null);
}



function validateLastCharge(accountType) {
    const accountTypes = ['checking', 'savings', 'IRA', 'checkings', 'saving'];
    if (accountType && accountTypes.indexOf(accountType.toLowerCase()) === -1) {
        console.log('validating check balance');
        return buildValidationResult(false, 'AccountType', `I do no recoginize ${accountType} as a valid account type. Would you like to check your savings or checking account?`);
    }
    return buildValidationResult(true, null, null);
}

function validateLastPersonPaid(nameType) {
    const nameTypes = ['travis', 'dalton', 'tom', 'chris', 'dave'];
    if (nameType && nameTypes.indexOf(nameType.toLowerCase()) === -1) {
        console.log('validating last person paid');
        return buildValidationResult(false, 'nameType', `It doesn't look like you paid anyone named ${nameType}. Please try another person.`);
    }
    return buildValidationResult(true, null, null);
}

// ---------------- Helper Functions --------------------------------------------------

function buildValidationResult(isValid, violatedSlot, messageContent) {
    if (messageContent == null) {
        return {
            isValid,
            violatedSlot,
        };
    }
    return {
        isValid,
        violatedSlot,
        message: { contentType: 'PlainText', content: messageContent },
    };
}


function elicitSlot(sessionAttributes, intentName, slots, slotToElicit, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName,
            slots,
            slotToElicit,
            message,
        },
    };
}


function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

function delegate(sessionAttributes, slots) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Delegate',
            slots,
        },
    };
}


function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}




function balance(selectedAccount) {
    //This would probably be a real-world data call, but we'll mock it up here with static data. We could also have a JSON structure but for now we'll just do a little switch case
    switch (selectedAccount) {
        case "checking":
            return '$7,812.23';

        case "savings":
            return '$5,345.76';

        default:
            return '0';
    }
}

  
function charge(selectedAccount) {
    switch (selectedAccount) {
        case "checking":
            return '$879 on rent';
        case "savings":
            return 'a $1,200 withdrawl';
        default:
            return '0';

    }
}



function bills(selectedBill) {
    switch (selectedBill) {
        case 'internet':
            return '$55.98';
        case 'rent':
            return '$980.56';
        case 'phone':
            return '$113.12';
        case 'car':
            return '$230.38';
        case 'electricity':
            return '$60';
        case 'heat':
            return '$50';
        case 'insurance':
            return '$110.78';
        default:
            return '0';
    }
}

function loans(selectedLoan) {
    switch (selectedLoan) {
        case 'student':
            return '$7,563.61';
        case 'payday':
            return '$102.30';
        case 'mortgage':
            return '$56,635';
        case 'personal':
            return '$312.45';
        case 'auto':
            return '$4,352';
        default:
            return '0';
    }
}

function people(selectedPerson) {
    switch (selectedPerson) {
        case 'travis':
            return '$55';
        case 'dalton':
            return '$102.18';
        case 'tom':
            return '$65';
        case 'chris':
            return '$20';
        case 'dave':
            return '$63.08';
    }


}
