![preview](https://raw.githubusercontent.com/dangerousbeans/scuttleflotilla-live/master/src/assets/solarpunkfleet.png)

# ScuttleShip Dashboard

## About

This is a live stream from Secure Scuttlebutt to show the activities of Alchemist 'scuttleship' and the rest of the #scuttleflotilla


```sh
npm install
```

You need to add your ssb keys to localStorage under 'keys' or it will generate new ones

Inside `main.js` change to match the output from `ssb-server ws.getAddress`

```javascript
Vue.use(ssbclient, { keys: localStorage.keys, remote: "ws://localhost:8989~shs:TXKFQehlyoSn8UJAIVP/k2BjFINC591MlBC2e2d24mA=" })
```

Run the ssb-server configuration or open [Patchwork](https://github.com/ssbc/patchwork) or [Patchbay](https://github.com/ssbc/patchbay)

```sh
node ssb-server.js
```

### run for development with hot reload
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Deploys to ghpages
```
npm run ghpages
```


## License
MIT