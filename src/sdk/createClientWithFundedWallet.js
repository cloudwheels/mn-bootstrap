const {
  PrivateKey,
} = require('@dashevo/dashcore-lib');

const Dash = require('dash');

const fundAddress = require('./fundAddress');
const wait = require('../util/wait');

/**
 *  * Create and fund DashJS client
 *
 * @typedef {createClientWithFundedWallet}
 * @param {string} preset
 * @param {string} network
 * @param {string} seed
 * @param {string} faucetPrivateKeyString
 * @return {Promise<Client>}
 */
async function createClientWithFundedWallet(preset, network, seed, faucetPrivateKeyString) {
  // Prepare to fund wallet
  const faucetPrivateKey = PrivateKey.fromString(faucetPrivateKeyString);
  const faucetAddress = faucetPrivateKey
    .toAddress(network)
    .toString();

  const dashClient = new Dash.Client({
    seeds: [seed],
    wallet: {
      mnemonic: null,
    },
    network,
  });

  const account = await dashClient.getWalletAccount();

  const { address: addressToFund } = account.getAddress();

  const amount = 40000;

  await fundAddress(
    dashClient.getDAPIClient(),
    preset,
    network,
    faucetAddress,
    faucetPrivateKey,
    addressToFund,
    amount,
  );

  do {
    await wait(500);
  } while (account.getTotalBalance() < amount);

  return dashClient;
}

module.exports = createClientWithFundedWallet;
