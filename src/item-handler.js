import './typedefs.js';
import { JZLootGenerator as Module } from './jz-loot-generator.js';
import { CoinGenerator } from './coin-generator.js';
import { Utils } from './utils.js';


/**
 * Exposes all the operations related to a given item.
 * @Class
 */
export class ItemHandler {
  /**
   * Gets a damaged version of the item, reducing its value and general usefulness.
   * @param {Item} item - The original item
   * @returns {Item} The damaged version of the item
   */
  static async getDamaged(item) {
    const handler = new ItemHandler(item);
    await handler.damage();
    return handler.item;
  }

  /**
   * Get an undamaged version of the item.
   * @param {Item} item - The original (damaged) item
   * @returns {Item} The undamaged version of the item
   */
  static async getFixed(item) {
    const handler = new ItemHandler(item);
    await handler.fix();
    return handler.item;
  }

  get isDamaged() {
    return this.item.name === this.damagedName;
  }

  constructor(item) {
    // Load config
    this.priceLossFactor = (100 - Module.getConfig(Module.SETTINGS.ITEM_DETERIORATION.PRICE_LOSS_FACTOR)) / 100;
    this.utilityLossFactor = (100 - Module.getConfig(Module.SETTINGS.ITEM_DETERIORATION.UTILITY_LOSS_FACTOR)) / 100;
    this.damagedSuffix = game.i18n.localize(`${Module.ID}.items.damaged_suffix`);

    this.item = item;
    this.fixedName = item.name.replace(this.damagedSuffix, '');
    this.damagedName = this.fixedName + this.damagedSuffix;
  }

  /**
   * Restore the item to an undamaged version, if possible.
   * @returns {Promise<ItemHandler>} The handler with an undamaged version of the item
   */
  async fix() {
    if (this.isDamaged) {
      Module.log(false, `Trying to fix ${this.damagedName}`);
      if (! await this.#findItem(this.fixedName))
        Module.warn('unable_to_fix', { name: this.damagedName });
    }

    return this;
  }

  /**
   * Damage the item, reducing its value and general usefulness.
   * @returns {Promise<ItemHandler>} The handler with a damaged version of the item
   */
  async damage() {
    if (!this.isDamaged) {
      Module.log(false, `Damaging ${this.fixedName}`);
      if (! await this.#findItem(this.damagedName))
        this.#createDamaged().#reducePrice().#reduceDamage().#reduceArmor();
    }

    return this;
  }

  async #findItem(name) {
    const found = await Utils.getItem({ name, type: this.item.type });
    if (found)
      this.item = found;
    return found;
  }

  #createDamaged() {
    this.item = foundry.utils.deepClone({ ...this.item, name: this.damagedName });
    return this;
  }

  #reducePrice(factor = this.priceLossFactor) {
    const oldPrice = this.item.system.price;
    this.item.system.price = CoinGenerator.getClosestPrice({ ...oldPrice, value: oldPrice.value * factor });
    const newPrice = this.item.system.price;
    Module.debug(false, `Generating ${this.damagedName}, new price: ${newPrice.value} ${newPrice.denomination} (${factor} * ${oldPrice.value} ${oldPrice.denomination})`);
    return this;
  }

  #reduceDamage(factor = this.utilityLossFactor) {
    const oldRolls = [];
    const newRolls = [];

    // Reduce each damage roll formula
    const damage = this.item.system.damage;
    damage.parts.forEach(damageSet => {
      damageSet[0] = this.#getNewDamageFormula(damageSet[0], factor, oldRolls, newRolls);
    });
    if (damage.versatile) {
      damage.versatile = this.#getNewDamageFormula(damage.versatile, factor, oldRolls, newRolls);
    }

    if (newRolls.length)
      Module.debug(false, `Generating ${this.damagedName}, new damage: ${newRolls.join(', ')} (${factor} * ${oldRolls.join(', ')})`);
    return this;
  }

  #getNewDamageFormula(damageFormula, factor, oldRolls, newRolls) {
    return damageFormula.replace(/(\d+)d(\d+)/, roll => {
      const [dice, faces] = roll.split('d');
      const newRoll = `${Math.ceil(dice * factor)}d${Math.ceil(faces * factor)}`;
      oldRolls.push(roll);
      newRolls.push(newRoll);
      return newRoll;
    });
  }

  #reduceArmor(factor = this.utilityLossFactor) {
    const armor = this.item.system.armor || {};
    const { dex: oldDex, value: oldValue } = armor;

    if (['light', 'medium', 'heavy'].includes(armor.type)) {
      const oldStealth = this.item.system.stealth;
      // Ensure no light, medium or heavy armor has AC below 10
      armor.value = 10 + Math.floor(factor * (armor.value - 10));
      // Reduce maximum Dexterity Modifier
      armor.dex = Math.floor(factor * (armor.dex ?? 10));
      //Disadvantage to stealth
      this.item.system.stealth = this.item.system.stealth || factor < 0.5;
      Module.debug(false, `Generating ${this.damagedName}, AC${armor.value} maxDexBonus: ${armor.dex} ${this.item.system.stealth && !oldStealth ? '[Added Stealth Penalty]' : ''} (${factor} of AC${oldValue} maxDexBonus: ${oldDex ?? 'Unlimited'})`);
    } else if (armor.type === 'shield') {
      // Reduce AC
      armor.value = Math.floor(factor * armor.value);
      Module.debug(false, `Generating ${this.damagedName}, AC${armor.value} (${factor} of AC${oldValue})`);
    }

    return this;
  }

}