# openshift-rollerbot
A Slackbot running on OpenShift that's a auto dice roller!

* Go to https://<slackteam>.slack.com/apps, and click on 'Build'
* Click 'Get Started with Slack Apps'
* Click 'Your Apps'
* "Create App'
* Fill in fields, some can be left blank
* Click on 'Create App'
* Success, your app is created!
* Click on 'App Credentials' and Copy both ClientID and Client Secret
* Set those on Openshift, using 
  * `rhc env set CLIENT_ID=<client_id> -a <appname>`
  * `rhc env set CLIENT_SECRET=<client_secret> -a <appname>`
* Set redirect URL to your openshift url
* Got to Slash Commands
* 'Create new command'
* Fill in details and then 'Save'
* Back to 'App Credentials'
* Copy Verification Token, and add to OpenShift
  *  `rhc env set VERIFY_TOKEN=<verify_token> -a <appname>` 
* Commit, push your project and hit the Openshift url to install
