/**
 * A group of coins of different types.
 * @typedef {Object} CoinGroup
 * @property {number} pp - Platinum pieces.
 * @property {number} gp - Gold pieces.
 * @property {number} ep - Electrum pieces.
 * @property {number} sp - Silver pieces.
 * @property {number} cp - Copper pieces.
 */

/**
 * An item in foundry.
 * @typedef {Object} Item
 */

/**
 * A representation of a price.
 * @typedef {Object} Price
 * @property {number} value - The amount of coins.
 * @property {string} denomination - The type of coins.
 */

/**
 * An item with its asociated quantity.
 * @typedef {Object} ItemQuantity
 * @property {Item} item - The item object.
 * @property {number} quantity - The quantity.
 */

/**
 * An actor in foundry.
 * @typedef {Object} Actor
 */