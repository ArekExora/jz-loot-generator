import './typedefs.js';
import { JZLootGenerator as Module } from './jz-loot-generator.js';
import { Utils } from './utils.js';
import { coinValues } from './constants.js';
import { LootBuilder } from './loot-builder.js';

const treasureTables = [...LootBuilder.gems, ...LootBuilder.artObjects].map(({ valueInGp, tableName }) => ({ valueInGp, tableName })).sort((a, b) => b.valueInGp - a.valueInGp);

/**
 * Converts a set of coins on a list of treasure items.
 * @Class
 */
export class TreasureConverter {
  static get conversionRate () {
    return Module.getConfig(Module.SETTINGS.TREASURE.CONVERSION_RATE);
  }

  /**
   * Generates a random number of treasure items based on the amount of coins available, consuming some of them in the process.
   * @param {CoinGroup} coins - The group of coins to convert to treasure rolls
   * @returns {Promise<{ coins: CoinGroup, treasures: ItemQuantity[] }>} The remaining coins and a group of treasure rolls grouped by table name
   */
  static async convertCoinsToTreasures(coins) {
    let treasures = [];

    if (this.conversionRate) {
      ({ coins, treasures } = await this.#getTreasuresAndCoins(coins, this.conversionRate/100));
      if (treasures.length)
        Module.log(false, `Converted ${this.conversionRate}% coins into treasure: ${Utils.parseItemNames(treasures)} ${Object.keys(coins).length ? 'AND ' + Utils.parseCoins(coins) : ''}`);
      else 
        Module.log(false, `No treasure to generate`);
    } else {
      Module.log(false, 'Skipping coins conversion into treasure');
    }

    return { coins, treasures };
  }

  static async #getTreasuresAndCoins(coins, conversionRate) {
    const rollsByTable = {};
    const updatedCoins = {};

    for (const coinType in coins) {
      updatedCoins[coinType] = coins[coinType];
      const rollsByCoin = this.#getRollsPerTable(updatedCoins[coinType] * coinValues[coinType].gp);

      for (const tableName in rollsByCoin) {
        const rolls = Utils.getHits(rollsByCoin[tableName].rolls, conversionRate);
        if (rolls) {
          updatedCoins[coinType] -= Math.ceil(rolls * rollsByCoin[tableName].table.valueInGp / coinValues[coinType].gp);
          rollsByTable[tableName] = (rollsByTable[tableName] || 0) + rolls;
        }
      }
    }

    const treasures = await this.#getTreasuresFromRolls(rollsByTable);

    return { coins: Utils.cleanCoinGroup(updatedCoins), treasures };
  }

  static async #getTreasuresFromRolls(treasureRolls) {
    const treasures = [];

    for (const tableName in treasureRolls) {
      treasures.push(... await Utils.rollTable(tableName, treasureRolls[tableName]));
    }
    
    return treasures;
  }

  static #getRollsPerTable(valueLeft, treasureIndex = 0, usedLevels = 0, rollsPerTable = {}) {
    const usageFactor = 2/3;        // How much value use in the current table (reduces the amounts to roll in lower tables)
    const maxLevelDiff = 4;         // How many lower tables to check after finding a match (the higher the more varied the treasure values)
    const maxRollsPerLevel = 10;    // How many rolls can a single level have
    const minimumValue = treasureTables[treasureTables.length - 1].valueInGp;

    // If the value left is below the value of the last table, skip everything
    if (valueLeft < minimumValue) return rollsPerTable;

    const tt = treasureTables[treasureIndex];
    let rolls = Math.floor(valueLeft/tt.valueInGp);
    usedLevels += (rolls || usedLevels) ? 1 : 0;

    if (rolls) {
        // If we are going deeper, leave something for later
        if (usedLevels < maxLevelDiff && treasureIndex < treasureTables.length - 1) {
            rolls = Math.ceil(rolls * usageFactor);
        }
        // Avoid having more rolls than the maximum allowed
        rolls = Math.min(maxRollsPerLevel, rolls);
        // Add the rolls to the accumulated result
        rollsPerTable[tt.tableName] = { table: tt, rolls };
        // Update the value left
        valueLeft -= rolls * tt.valueInGp;
    }

    // If there are no more levels, exit
    if (usedLevels >= maxLevelDiff || treasureIndex >= treasureTables.length - 1)
        return rollsPerTable;
    return this.#getRollsPerTable(valueLeft, treasureIndex + 1, usedLevels, rollsPerTable);
  }
}