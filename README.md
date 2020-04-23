# lgtm-in-clone-backend
My node.js practice repository for Single Page Application. This repo focuses on backend api.

When you want to work this with frontend, check lgtm-in-clone-dev repository out. You can see how to build local environment for this there.

## Get Started
### Start Server
```
$ git clone https://github.com/pipopotamasu/lgtm-in-clone-backend.git
$ cd lgtm-in-clone-backend
$ yarn install
$ yarn start:mongodb
$ yarn build && yarn start # => start at http://localhost:3000
```

### Test
```
$ yarn start:mongodb
$ yarn test
```

## Technologies
- Node.js
- Express.js
- Mongodb
- TypeScript
- Jest
- supertest
- Passport.js
- etc...

## Commands
```
# start node.js server
yarn start

# build typescript
yarn build

# build and start node.js server by watch build mode
yarn watch

# run tests
yarn test

# run tests by watch mode
yarn watch-test

# run eslint
yarn lint

# build and start node.js server by debug mode
yarn debug

# start mongodb
yarn start:mongodb

# set mongodb data
yarn seed
```

## Signup with email activation
Default signup does not need email activation process.
When you need it, set SMTP server credentials on `.env` file and enable activation endpoints at `src/app.ts`.

I recommend to use https://mailtrap.io/ for local SMTP server.

## LICENSE
MIT
