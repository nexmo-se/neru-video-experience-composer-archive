# neru-video-ec-archive-neru


## Prerequisites
- Vonage API account 
    - Experience Composer is ComposerEnabled
- Early Access for VCP/NeRu


## Install

- run `npm install`
- cp `neru.yml.sample` to `neru.yml` and update it with {{VONAGE_APPLICATION_ID}}
- run `neru app configure --app-id {{VONAGE_APPLICATION_ID}}`


## Environment variables
- `OT_API_KEY`, `OT_API_SECRET`:
    Vonage Video Project API KEY and API SECRET.
- `APP_URL`:
    Public URL to the APP server


## Available Scripts

In the project directory, you can run:

### `npm run debug` to start a Debugger
- Run `npm start` in the `../frontend` to start frontend app


### `neru deploy` to deploy it to your neru account
- Before runing `neru deploy`, copy the frontent build directory to `neru/public`: `cd ../front && run npm build && cp ./build ../neru/public`


### `npm start` locally

Open [http://localhost:3002](http://localhost:3002) to view it in your browser.


