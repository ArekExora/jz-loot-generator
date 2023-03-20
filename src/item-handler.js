import './typedefs.js';
import { JZLootGenerator as Module } from './jz-loot-generator.js';
import { CoinGenerator } from './coin-generator.js';
import { Utils } from './utils.js';


/**
 * Exposes all the operations related to a given item.
 * @Class
 */
export class ItemHandler {
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
   * Get an undamaged version of the item.
   * @returns {Item} The undamaged version of the item
   */
  async getFixed() {
    if (this.isDamaged) {
      Module.debug(false, `Trying to fix ${this.damagedName}`);
      const fixed = await Utils.getItem({ name: this.fixedName, type: this.item.type });
      if (fixed) {
        this.item = fixed;
      } else {
        Module.warn(`Unable to fix ${this.damagedName}`); // TODO: localize
        return null;
      }
    }

    return this.item;
  }

  /**
   * Gets a damaged version of the item, reducing its value and general usefulness.
   * @returns {Item} The damaged version of the item
   */
  async getDamaged() {
    if (this.isDamaged) {
      return this.item;
    }

    switch (this.item.type) {
      case 'weapon': return this.#getDamagedWeapon();
      case 'equipment': return this.#getDamagedEquipment();
      default: return this.#getDamagedGeneric();
    }
  }

  async #getDamagedGeneric() {
    this.item = await this.#findDamaged() || this.#createDamaged().#reducePrice().item;
    return this.item;
  }

  async #getDamagedWeapon() {
    this.item = await this.#findDamaged() || this.#createDamaged().#reducePrice().#reduceDamage().item;
    return this.item;
  }

  async #getDamagedEquipment() {
    // EQUIPMENT BASIC ARMOR TYPES: light, medium, heavy, shield, clothing, trinket
    const armorTypes = ['light', 'medium', 'heavy', 'shield'];
    
    if (armorTypes.includes(this.item.system.armor.type)) {
      return await this.#getDamagedArmor();
    } else {
      // Do not damage unequiped trinkets and clothing
      return !this.item.system.equipped ? this.item : await this.#getDamagedGeneric();
    }
  }

  async #getDamagedArmor() {
    this.item = await this.#findDamaged() || this.#createDamaged().#reducePrice().#reduceArmor().item;
    return this.item;
  }

  async #findDamaged() {
    return await Utils.getItem({ name: this.damagedName, type: this.item.type });
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
    const oldDamage = [];
    const newDamage = [];

    // Reduce each damage roll formula
    const damage = this.item.system.damage;
    damage.parts.forEach(damageSet => {
      oldDamage.push(damageSet[0]);
      damageSet[0] = this.#getNewDamageFormula(damageSet[0], factor);
      newDamage.push(damageSet[0]);
    });
    if (damage.versatile) {
      oldDamage.push(damage.versatile);
      damage.versatile = this.#getNewDamageFormula(damage.versatile, factor);
      newDamage.push(damage.versatile);
    }

    Module.debug(false, `Generating ${this.damagedName}, new damage: ${newDamage.join(', ')} (${factor} * ${oldDamage.join(', ')})`);
    return this;
  }

  #getNewDamageFormula(damageFormula, factor) {
    return damageFormula.replace(/(\d+)d(\d+)/, roll => {
      const [dice, faces] = roll.split('d');
      return `${Math.ceil(dice * factor)}d${Math.ceil(faces * factor)}`;
    });
  }

  #reduceArmor(factor = this.utilityLossFactor) {
    const armor = this.item.system.armor;
    let { type, dex, value } = armor;
    let stealth = this.item.system.stealth;

    if (type !== 'shield') {
      // Ensure no light, medium or heavy armor has AC below 10
      value = 10 + Math.floor(factor * (value - 10));
      // Reduce maximum Dexterity Modifier
      dex = Math.floor(factor * (dex ?? 10));
      //Disadvantage to stealth
      stealth = this.item.system.stealth || factor > 0.5;
      Module.debug(false, `Generating ${this.damagedName}, AC${value} maxDexBonus: ${dex} [${stealth ? '' : 'NO '}Stealth Penalty] (${factor} of AC${armor.value} maxDexBonus: ${armor.dex ?? 'Unlimited'}) [${this.item.system.stealth ? '' : 'NO '}Stealth Penalty]`);
    } else {
      // Reduce AC
      value = Math.floor(factor * value);
      Module.debug(false, `Generating ${this.damagedName}, AC${value} (${factor} of AC${armor.value}`);
    }

    //Update the item
    this.item.system.armor = { ...armor, dex, value };
    this.item.system.stealth = stealth;

    return this;
  }

}