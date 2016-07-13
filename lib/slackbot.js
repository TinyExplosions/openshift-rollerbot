process.env.SLACK_BOT_COMMAND = process.env.SLACK_BOT_COMMAND || '/roll';

var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    Logger = require('fh-logger-helper'),
    data = {};
    Droll = require('droll');


function slackbot() {
    var app = express();
    app.use(cors());
    app.use(bodyParser());

    // Slack POST's all requests, so this will capture em
    app.post('/', function authRoute(req, res) {
        if (!req.body.token || req.body.token !== process.env.VERIFY_TOKEN) {
            res.status(400)
            return res.send("Invalid Verification Token");
        }
        var identifier = req.body.team_id + req.body.user_id;
        var defaultFormula = data[identifier] || "D20";
        // a request will look like the following:
        // {
        //     token: 'X9RFSFDobd7hkJUwfa2bWgiQ',
        //     team_id: 'T0GV70483',
        //     team_domain: 'testing',
        //     channel_id: 'C0GV0VEJ1',
        //     channel_name: 'general',
        //     user_id: 'U0GUZGERA',
        //     user_name: 'Test',
        //     command: '/roll',
        //     text: 'help',
        //     response_url: 'https://hooks.slack.com/commands/T0GV70483/28877560285/Eehah8yGIXhUa15W67hYc2iM'
        // }

        // First check the command is what we want
        var command = req.body.text.toUpperCase().trim();
        Logger.info("The command is", command);
        if (command == "HELP") {
            return res.send(helpText(req.body.command));
        }
        if (command == "DEFAULT") {
            return res.send({ text: "Your default roll is " + defaultFormula });
        }
        if (command.indexOf("DEFAULT") !== -1) {
            var defaultFormula = command.replace(/default/gi, "").trim();
            if (Droll.validate(defaultFormula)) {
                data[identifier] = defaultFormula;
                return res.send({ text: "Your new default is " + defaultFormula });
            } else {
                return res.send({ text: "I'm sorry, I can't parse " + defaultFormula + ", have you used <https://en.wikipedia.org/wiki/Dice_notation|Standard Dice Notation>? Your default has not been updated." });
            }
        } else {
            var formula = req.body.text.replace(/ /g, "");
            if (!formula) {
                formula = defaultFormula;
            }
            var result = Droll.roll(formula);
            if (!result) {
                return res.send({ text: "I'm sorry, I can't parse " + req.body.text + ", have you used <https://en.wikipedia.org/wiki/Dice_notation|Standard Dice Notation>?" });
            } else {
                return res.send({
                    // "response_type": "in_channel",
                    "text": "Rolling " + formula,
                    "attachments": [{
                        "text": "Result: " + result
                    }]
                });
            }
        }
    });

    return app;
}

function helpText(command) {
    var helpText = "" +
        "`" + command + " default` display current default\n" +
        "`" + command + " default <formula>` set default for your team to <formula>\n" +
        "`" + command + " help` show this message again!\n";
    return {
        "text": "Saving you from arithmetic since 2016!",
        "attachments": [{
            "color": "good",
            "title": "Rolling a dice",
            "text": "`" + command + "` Roll the default formula\n" +
                "`" + command + " <formula>` Get the result of the given formula (in <https://en.wikipedia.org/wiki/Dice_notation|Standard Dice Notation>)\n",
            "mrkdwn_in": [
                "text"
            ]
        }, {
            "title": "Configuring RollerBot",
            "text": helpText,
            "mrkdwn_in": [
                "text"
            ]
        }]
    }
}

module.exports = slackbot;
