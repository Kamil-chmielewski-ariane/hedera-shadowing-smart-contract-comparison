# Hedera Shadowing smart contract comparison

Second part of the shadowing app to compare only a smart contract values and slots using evm_shadowing api

## Recommend tools
* [evm-shadowing](https://github.com/misiekp/evm_shadowing)

## Requirements
* [Node.js](https://nodejs.org/en) >= 22.x
* [PNPM](https://pnpm.io/) >= 9.x
* [Docker](https://www.docker.com/) > 24.x
* [Docker Compose](https://docs.docker.com/compose/) > 2.22.0
* [PM2](https://pm2.keymetrics.io/) - Optional
* Minimum 16GB RAM

## Usage

Add ```logs``` directory in the root of the project for logs

### Installation

To run this project you have first download and install all require packages, also you have to create a erigon api and evm_shadowing app is required for this app to work.

## Shadowing API

The shadowing api will be default set on the ports:
- 3005 - Shadowing api
- 8005 - Shadowing api connection listener

#### PNPM

```
pnpm install
pnpm api
```
to run the shadowing api 

#### Docker

``docker compose up`` to run shadowing api

### Smart contract comparision

```pnpm run dev``` to start app

## Creating logs

The Hedera shadowing smart contract comparison is creating logs for the smart contract details
- Smart contract compare errors
- Blocks with contracts
- All contract with details

