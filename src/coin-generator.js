import './typedefs.js';
import { JZLootGenerator as Module } from './jz-loot-generator.js';
import { Utils } from './utils.js';
import { coinValues } from './constants.js';

/**
 * Generates a bunch of coins for a given actor.
 * @Class
 */
export class CoinGenerator {
  static get chance() {
    return Module.getConfig(Module.SETTINGS.COINS.PERCENTAGE);
  }
  static get maxFactor() {
    return Module.getConfig(Module.SETTINGS.COINS.MAX_FACTOR);
  }

  /**
   * Generates a random amount of coins based on the Challenge Rating of the received NPC or a fixed number, as well as the factor to multiply the rolls by.
   * @param {(number | Actor)} actorOrCR - The actor to generate the loot for, or a fixed CR
   * @param {number} [rolls = 1] - How many times the rolls should be made (usefull for treasure piles)
   * @returns {CoinGroup} A group of coins
   */
  static generateIndividualTreasure(actorOrCR, rolls = 1, minFactor = 0) {
    if (typeof actorOrCR !== 'number' && actorOrCR.type !== 'npc') {
      Module.logError(false, `Trying to generate individual treasure with invalid actorOrCR`, actorOrCR, rolls);
      return {};
    }

    const cr = actorOrCR.system?.details?.cr ?? actorOrCR;
    return this.#individualTreasureRollGroup(cr, minFactor, rolls);
  }

  /**
   * Returns the amount of highest kind of coin possible for a given amount and kind of coin (used to round prices).
   * @param {Price} coins - The actor to generate the loot for, or a fixed CR
   * @returns {Price} The amount and kind of coins calculated 
   */
  static getClosestPrice({ value, denomination }) {
    const valueInCopper = Math.floor(value * coinValues[denomination].cp);
    const coinTypes = Object.keys(coinValues).reverse();
    for (let i = 0; i < coinTypes.length; i++) {
      denomination = coinTypes[i];
      value = valueInCopper * coinValues.cp[denomination];
      if (value % 1 === 0)
        return { value, denomination };
    }
  }

  static #individualTreasureRollGroup(cr, minFactor, rolls) {
    const coins = { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
    const factors = [];

    for (let i = 0; i < rolls; i++) {
      const factor = Math.max(minFactor, Utils.evaluateSuccessRate(this.chance, minFactor, this.maxFactor));
      factors.push(factor);
      if (factor < 1)
        continue;

      const generated = this.#individualTreasureRoll(cr, factor);
      for (const [coinType, amount] of Object.entries(generated))
        coins[coinType] = (coins[coinType] || 0) + amount;
    }

    if (Object.keys(coins).length)
      Module.log(false, `Generated coins: [${Utils.parseCoins(coins)}] (${rolls} roll/s with CR${cr} and factors ${factors.join(',')})`);
    else
      Module.log(false, `No coins generated (${rolls} roll/s with CR${cr} and factors ${factors.join(',')})`);

    return Utils.cleanCoinGroup(coins);
  }

  static #individualTreasureRoll(cr, factor) {
    if (cr<5)
      return this.#individualTreasureRollCR0(factor);
    else if (cr<11)
      return this.#individualTreasureRollCR5(factor);
    else if (cr<17)
      return this.#individualTreasureRollCR11(factor);
    else
      return this.#individualTreasureRollCR17(factor);
  }

  // DMG pg. 136
  static #individualTreasureRollCR0(factor) {
    const result = Utils.rollDice('1d100');
    if (result <= 30)
      return { cp: Utils.rollDice(`${factor * 5}d6`) };
    else if (result <= 60)
      return { sp: Utils.rollDice(`${factor * 4}d6`) };
    else if (result <= 70)
      return { ep: Utils.rollDice(`${factor * 3}d6`) };
    else if (result <= 95)
      return { gp: Utils.rollDice(`${factor * 3}d6`) };
    else
      return { pp: Utils.rollDice(`${factor * 1}d6`) };
  }

  static #individualTreasureRollCR5(factor) {
    const result = Utils.rollDice('1d100');
    if (result <= 30)
      return {
        cp: Utils.rollDice(`${factor * 8}d6 * 50`),    // 4d6 * 100
        ep: Utils.rollDice(`${factor * 2}d6 * 5`),     // 1d6 * 10
      };
    else if (result <= 60)
      return {
        sp: Utils.rollDice(`${factor * 6}d6 * 10`),    // 6d6 * 10
        gp: Utils.rollDice(`${factor * 4}d6 * 5`),     // 2d6 * 10
      };
    else if (result <= 70)
      return {
        ep: Utils.rollDice(`${factor * 6}d6 * 5`),     // 3d6 * 10
        gp: Utils.rollDice(`${factor * 4}d6 * 5`),     // 2d6 * 10
      };
    else if (result <= 95)
      return {
        gp: Utils.rollDice(`${factor * 8}d6 * 5`),     // 4d6 * 10
      };
    else
      return {
        gp: Utils.rollDice(`${factor * 4}d6 * 5`),     // 2d6 * 10
        pp: Utils.rollDice(`${factor * 3}d6`),         // 3d6
      };
  }

  static #individualTreasureRollCR11(factor) {
    const result = Utils.rollDice('1d100');
    if (result <= 20)
      return {
        sp: Utils.rollDice(`${factor * 8}d6 * 50`),    // 4d6 * 100
        gp: Utils.rollDice(`${factor * 2}d6 * 50`),    // 1d6 * 100
      };
    else if (result <= 35)
      return {
        ep: Utils.rollDice(`${factor * 2}d6 * 50`),    // 1d6 * 100
        gp: Utils.rollDice(`${factor * 2}d6 * 50`),    // 1d6 * 100
      };
    else if (result <= 75)
      return {
        gp: Utils.rollDice(`${factor * 4}d6 * 50`),    // 2d6 * 100
        pp: Utils.rollDice(`${factor * 2}d6 * 5`),     // 1d6 * 10
      };
    else
      return {
        gp: Utils.rollDice(`${factor * 4}d6 * 50`),    // 2d6 * 100
        pp: Utils.rollDice(`${factor * 4}d6 * 5`),     // 2d6 * 10
      };
  }

  static #individualTreasureRollCR17(factor) {
    const result = Utils.rollDice('1d100');
    if (result <= 15)
      return {
        ep: Utils.rollDice(`${factor * 4}d6 * 500`),   // 2d6 * 1000
        gp: Utils.rollDice(`${factor * 8}d6 * 100`),   // 8d6 * 100
      };
    else if (result <= 55)
      return {
        gp: Utils.rollDice(`${factor * 4}d6 * 250`),   // 1d6 * 1000
        pp: Utils.rollDice(`${factor * 2}d6 * 50`),    // 1d6 * 100
      };
    else
      return {
        gp: Utils.rollDice(`${factor * 4}d6 * 250`),   // 1d6 * 1000
        pp: Utils.rollDice(`${factor * 4}d6 * 50`),    // 2d6 * 100
      };
  }

}