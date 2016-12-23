'use strict';
var _ = require('lodash');

var BufferUtil = require('./util/buffer');
var networks = [];
var networkMaps = {};

/**
 * A network is merely a map containing values that correspond to version
 * numbers for each bitcoin network. Currently only supporting "livenet"
 * (a.k.a. "mainnet") and "testnet".
 * @constructor
 */
function Network() {}

Network.prototype.toString = function toString() {
  return this.name;
};

/**
 * @function
 * @member Networks#get
 * Retrieves the network associated with a magic number or string.
 * @param {string|number|Network} arg
 * @param {string} key - if set, only check if the magic number associated with this name matches
 * @return Network
 */
function getNetwork(arg, key) {
  if (~networks.indexOf(arg)) {
    return arg;
  }
  if (key) {
    for (var index in networks) {
      if (networks[index][key] === arg) {
        return networks[index];
      }
    }
    return undefined;
  }
  return networkMaps[arg];
}

/**
 * @function
 * @member Networks#add
 * Will add a custom Network
 * @param {Object} data
 * @param {String} data.name - The name of the network
 * @param {String} data.alias - The aliased name of the network
 * @param {Number} data.pubkeyhash - The publickey hash prefix
 * @param {Number} data.privatekey - The privatekey prefix
 * @param {Number} data.scripthash - The scripthash prefix
 * @param {Number} data.xpubkey - The extended public key magic
 * @param {Number} data.xprivkey - The extended private key magic
 * @param {Number} data.networkMagic - The network magic number
 * @param {Number} data.port - The network port
 * @param {Array}  data.dnsSeeds - An array of dns seeds
 * @return Network
 */
function addNetwork(data) {

  var network = new Network();

  _.extend(network, {
    name: data.name,
    alias: data.alias,
    pubkeyhash: data.pubkeyhash,
    privatekey: data.privatekey,
    scripthash: data.scripthash,
    xpubkey: data.xpubkey,
    xprivkey: data.xprivkey,
    networkMagic: BufferUtil.integerAsBuffer(data.networkMagic),
    port: data.port,
    dnsSeeds: data.dnsSeeds
  });

  _.each(_.values(network), function(value) {
    if (!_.isObject(value)) {
      networkMaps[value] = network;
    }
  });

  networks.push(network);

  return network;

}

addNetwork({
  name: 'livenet',
  alias: 'mainnet',
  pubkeyhash: 0x19,
  privatekey: 0x99,
  scripthash: 0x55,
  xpubkey: 0x02cfbede,
  xprivkey: 0x02cfbf60,
  networkMagic: 0x70352205,
  port: 15714,
  dnsSeeds: [
    'rat4.blackcoin.co',
    'seed.blackcoin.co',
    '6.syllabear.us.to',
    'bcseed.syllabear.us.to'
  ]
});

addNetwork({
  name: 'testnet',
  alias: 'testnet',
  pubkeyhash: 0x19,
  privatekey: 0x99,
  scripthash: 0x55,
  xpubkey: 0x02cfbede,
  xprivkey: 0x02cfbf60,
  networkMagic: 0x70352205,
  port: 15714,
  dnsSeeds: [
    'rat4.blackcoin.co',
    'seed.blackcoin.co',
    '6.syllabear.us.to',
    'bcseed.syllabear.us.to'
  ],
});

/**
* @instance
* @member Networks#livenet
*/
var livenet = getNetwork('livenet');

/**
* @instance
* @member Networks#testnet
*/
var testnet = getNetwork('testnet');

/**
 * @namespace Networks
 */
module.exports = {
  add: addNetwork,
  defaultNetwork: livenet,
  livenet: livenet,
  mainnet: livenet,
  testnet: testnet,
  get: getNetwork
};
