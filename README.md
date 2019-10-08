![ProHacktive](https://prohacktive.io/public/images/logo-prohacktive-grey-dark.svg "uPKI from ProHacktive.io")

# µPKI-WEB
*NOT READY FOR PRODUCTION USE*
This project has only been tested on Debian 9 Strech with Python3.6.
Due to python usage it *SHOULD* works on many other configurations, but it has NOT been tested.

## 1. About
µPki [maɪkroʊ ˈpiː-ˈkeɪ-ˈaɪ] is a small PKI in python that should let you make basic tasks without effort.
It works in combination with:
 - [µPKI-CA](https://github.com/proh4cktive/upki)
 - [µPKI-RA](https://github.com/proh4cktive/upki-ra)
 - [µPKI-CLI](https://github.com/proh4cktive/upki-cli)

µPki-WEB is the administration webapp that interact with the [µPKI-CA](https://github.com/proh4cktive/upki-ca) Certification Authority.

This sub-repository is for developement purpose ONLY, prefer [µPKI-RA](https://github.com/proh4cktive/upki-ra) instead if you are trying to setup a PKI.

### 1.1 Dependencies
This project excpect to have Node.js 10 and VueJS installed.

In order to install Node.js 10 LTS on Debian 9
```bash
curl -sL https://deb.nodesource.com/setup_10.x | sudo bash
sudo apt update
sudo apt -y install gcc g++ make nodejs git
```

Then install VueJS
```bash
npm install -g @vue/cli
```

For detailed instructions see [NPM Install](https://tecadmin.net/install-latest-nodejs-npm-on-debian/) and [VueJs Install](https://cli.vuejs.org/guide/installation.html)

## 2. Install
µPki-WEB is based on vuejs 3.x project. You are allowed to modify and enhanced it for any purpose. Please just tell us if you are making something out of it!! ;)

### 2.1 Project setup
```
npm install
```

#### 2.2 Compiles and hot-reloads for development
```
npm run serve
```

#### 2.3 Compiles and minifies for production
```
npm run build
```

#### 2.4 Run your tests
```
npm run test
```

#### 2.5 Lints and fixes files
```
npm run lint
```

#### 2.6 Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
In order to run your development server you will probably need to adjust the public url in vue.config.js

