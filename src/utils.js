import './typedefs.js';
import { JZLootGenerator as Module } from './jz-loot-generator.js';

/**
 * Utility class
 * @Class
 */
export class Utils {  
  /**
   * Evaluates if a required module is active
   * @param {string} moduleName - The name of the required module
   * @returns {Boolean} True if the module is active, false otherwise
   */
  static requireModule(moduleName) {
    if (!game.modules.get(moduleName)?.active) {
        Module.error(`This function requires the "${moduleName}" module to function!`);
        return false;
    }
    return true;
  }

  /**
   * Evaluates dice roll
   * @param {string} rollString - The roll formula
   * @returns {number} The result of the roll
   */
  static rollDice(rollString) {
    return new Roll(rollString).roll({ async: false }).total;
  }

  /**
   * Rolls in the given table the specified number of times.
   * @param {string} tableName - The name of the table to roll on
   * @param {number} rolls - How many times should roll
   * @returns {Promise<ItemQuantity[]>} The list of items rolled
   */
  static async rollTable(tableName, rolls = 1) {
    const items = [];

    if (rolls < 1)
      return items;

    const table = game.tables.getName(tableName);
    if (!table) {
      Module.warn(`Table ${tableName} not found!`);
      return items;
    }

    const tableResult = await table.drawMany(rolls, { displayChat: false });
    for (let { documentId, documentCollection } of tableResult.results) {
      const itemQuantity = items.find(({ item }) => item._id === documentId);
      if (itemQuantity) {
        Module.debug(false, `Item ${itemQuantity.item.name} rolled from table ${tableName}`);
        itemQuantity.quantity++;
        continue;
      }
      
      let item;
      if (documentCollection === 'Item') {
        item = game.items.get(documentId);
      } else {
        const pack = game.packs.get(documentCollection);
        if (!pack) {
          Module.warn(`Compendium ${documentCollection} not found!`);
          continue;
        }
        item = await pack.getDocument(documentId);
      }

      if (item instanceof Item) {
        items.push({ item, quantity: 1 });
        Module.debug(false, `Item ${item.name} rolled from table ${tableName}`);
      }
    }

    return items;
  }

  /**
   * Parses a list of items into a human readable string.
   * @param {ItemQuantity[]} itemsQuantities - The list of items and quantities to parse
   * @returns {String} The list of items in human readable form
   */
  static parseItemNames(itemsQuantities){
    return itemsQuantities.map(({ item, quantity }) =>
      item.name + (quantity > 1 ? `(x${quantity})` : '')
    ).join(', ');
  }

  /**
   * Parses a group of coins into a human readable string.
   * @param {CoinGroup} coins - The group of coins
   * @returns {String} The group of coins in human readable form
   */
  static parseCoins(coins){
    const result = [];
    for (let coinType in coins) {
        if (coins[coinType]) result.push(`${coins[coinType]}${coinType}`);
    }
    return result.join(' ');
  }

  /**
   * Get the number of attempts that succeed against a given chance.
   * @param {number} attempts - The number of attempts
   * @param {number} chance - The percentage of success
   * @returns {number} The amount of succeeded attempts
   */
  static getHits(attempts, chance) {
    let total = 0;
    for (let i = 0; i < attempts; i++)
      total += Math.random() < chance;
    return total;
  }

  /**
   * Retrieves an item, searching the compendiums if necessary.
   * @param {string | Item} data - The data of the item to search, either the name or an object with the name and the type
   * @param {string[]} extraCompendiums - A list of extra compendiums to search in
   * @returns {Item} The retrieved item, or undefined
   */
  static async getItem(data, extraCompendiums = []) {
    const compendiums = ['dnd5e.items', ...extraCompendiums];
    const { name, type } = typeof data === 'string' ? { name: data } : data;

    Module.debug(false, `Searching item: ${name}${type ? ' [' + type + ']' : ''}`);
    const item = game.items.find(i => i.name === name && (!type || i.type === type));
    if (item) {
      Module.debug(false, `Item found: ${name}${type ? ' [' + type + ']' : ''}`);
      return item;
    }
    
    for (let i = 0; i < compendiums.length; i++) {
      const pack = game.packs.get(compendiums[i]);
      if (!pack) {
        Module.error(`Compendium ${compendiums[i]} not found!`); // TODO: localize
        continue;
      }
      
      const docs = await pack.getDocuments({ name, type });
      if (docs.length) {
        Module.debug(false, `Item found: ${name}${type ? ' [' + type + ']' : ''}`);
        return docs.shift();
      }
    }
    Module.debug(false, `No item found matching: ${name}${type ? ' [' + type + ']' : ''}`);
  }

  static storedSuccessRateSegments = {};
  /**
   * Generate the rate of success with a given chance, from 0 to max.
   * @param {number} chance - The percentage of success
   * @param {number} max - The maximum success rate obtainable
   * @returns {number} The rate of success, 0 means failure, the chance of an aditional success is half the current chance.
   */
  static evaluateSuccessRate(chance, max) {
    if (Math.min(chance, max) < 0)
      return 0;

    const result = Math.random() * 100 - (100 - chance);

    if (!this.storedSuccessRateSegments[max])
      this.storedSuccessRateSegments[max] = this.#getSuccessRateSegments(max);

    const segments = this.storedSuccessRateSegments[max];
    const segmentSize = chance/segments.length;
    const index = Math.floor(result/segmentSize);
    Module.debug(false, `Evaluating success rate. SegmentSize: ${segmentSize}, index: ${index}, segments:`, segments);
    return index >= 0 ? segments[index] : 0;
  }

  static #getSuccessRateSegments(max) {
    const segments = [];

    for (let i = 0; i < max; i++) {
      const groupSize = Math.pow(2, i);
      for (let j = 0; j < groupSize; j++)
        segments.push(max - i);
    }

    segments.reverse();
    Module.debug(false, `Generating segments for ${max}`);
    return segments;
  }

}