node-ninja-led
================

A simple application to control your Ninja Block's LED

## Requirements
1. Ninja Account
2. Ninja Block (ones with built in RF can do full RGB, older ones not so much)

## Installation
```
git clone https://github.com/thatguydan/node-ninja-led.git
cd node-ninja-led
npm install
```

If you're running locally:
```
# Now register your development application in 
# the 'settings' page of your Ninja Blocks account.
export NINJA_CLIENT_ID=[your client id]
export NINJA_CLIENT_SECRET="[your client secret]"
node app.js
```

When ready to deploy (Heroku example provided)

```
heroku create --stack cedar --addons redistogo:nano
# Register your production application, 
# providing the full URL including the heroku 
# endpoint provided by the previous step.
heroku config:set NINJA_CLIENT_ID=[your client id]
heroku config:set NINJA_CLIENT_SECRET="[your client secret]"
git push heroku master
```



## License
MIT