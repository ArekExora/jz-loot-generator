import './typedefs.js';
import { JZLootGenerator as Module } from './jz-loot-generator.js';

export const SYSTEM_PACKS = {
  ITEMS: 'dnd5e.items',
  TRADE_GOODS: 'dnd5e.tradegoods'
}

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
        Module.error('module_required', { moduleName });
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

    const table = await this.getTable(tableName);
    if (!table) {
      Module.warn('element_name_not_found', { element: 'Table', name: tableName });
      return items;
    }

    const tableResult = await table.drawMany(rolls, { displayChat: false });
    for (const { documentId, documentCollection } of tableResult.results) {
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
          Module.warn('element_name_not_found', { element: 'Compendium', name: documentCollection });
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
   * Returns a Roll Table instance.
   * @param {string} tableName - The name of the table to search
   * @returns {Promise<RollTable>} The Roll Table found or undefined;
   */
  static async getTable(tableName) {
    let table = game.tables.getName(tableName);

    if (table) {
      Module.debug(false, `Table ${tableName} found in game table list.`);
    } else {
      const packName = Module.COMPENDIUMS.LOOT_TABLES.fullName;
      const tablePack = game.packs.get(packName);
      if (tablePack) {
        tablePack?.getIndex();
        const id = tablePack.index.find(t => t.name === tableName)?._id;
        table = await tablePack.getDocument(id);
        if (table) {
          Module.debug(false, `Table ${tableName} found in compendium ${packName}`);
        } else {
          Module.debug(false, `Table ${tableName} not found in compendium ${packName}`);
        }
      } else {
        Module.debug(false, `Compendium ${packName} not found!`);
      }
    }

    return table;
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
    
    for (const [coinType, amount] of Object.entries(coins))
      if (amount) result.push(`${amount}${coinType}`);

    return result.join(' ');
  }

  /**
   * Remove all the empty coin types from the group.
   * @param {CoinGroup} coins - The group of coins
   * @returns {CoinGroup} The cleaned group of coins
   */
  static cleanCoinGroup(coins) {
    const newCoins = {};

    for (const [coinType, amount] of Object.entries(coins))
      if (amount) newCoins[coinType] = amount;

    return newCoins;
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
    const compendiums = [SYSTEM_PACKS.ITEMS, SYSTEM_PACKS.TRADE_GOODS, ...Module.COMPENDIUM_LIST.map(pack => pack.fullName), ...extraCompendiums];
    const { name, type } = typeof data === 'string' ? { name: data } : data;

    Module.debug(false, `Searching item: ${name}${type ? ' [' + type + ']' : ''}`);
    const item = game.items.find(i => i.name === name && (!type || i.type === type));
    if (item) {
      Module.debug(false, `Item found: ${name}${type ? ' [' + type + ']' : ''}`);
      return item;
    }
    
    for (const compendium of compendiums) {
      const pack = game.packs.get(compendium);
      if (!pack) {
        Module.warn('element_name_not_found', { element: 'Compendium', name: compendium });
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
   * @param {number} min - The minimum success rate obtainable
   * @param {number} max - The maximum success rate obtainable
   * @returns {number} The rate of success, 0 means failure, the chance of an aditional success is half the current chance.
   */
  static evaluateSuccessRate(chance, min, max) {
    if (min >= max || Math.min(chance, max) <= 0)
      return min;

    const result = Math.random() * 100 - (100 - chance);

    if (!this.storedSuccessRateSegments[max])
      this.storedSuccessRateSegments[max] = this.#getSuccessRateSegments(max);

    const segments = this.storedSuccessRateSegments[max];
    const segmentSize = chance/segments.length;
    const index = Math.floor(result/segmentSize);
    const successRate = index >= 0 ? Math.max(min, segments[index]) : min;
    Module.debug(false, `Success rate: ${successRate}[${min}-${max}]. Size: ${segmentSize}, index: ${index}, segments: ${segments.join(',')}`);
    return successRate;
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