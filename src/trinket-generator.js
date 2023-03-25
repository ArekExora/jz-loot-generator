import './typedefs.js';
import { JZLootGenerator as Module } from './jz-loot-generator.js';
import { Utils } from './utils.js';

/**
 * Generate a list of trinkets.
 * @Class
 */
export class TrinketGenerator {
  static get chance() {
    return Module.getConfig(Module.SETTINGS.TRINKETS.PERCENTAGE);
  }
  static get max() {
    return Module.getConfig(Module.SETTINGS.TRINKETS.MAX);
  }
  static get table() {
    return Module.getConfig(Module.SETTINGS.TRINKETS.TABLE);
  }

  /**
   * Generates a random number of trinkets.
   * @returns {Promise<ItemQuantity[]>} The list of trinkets generated
   */
  static async generateTrinkets() {
    const amount = Utils.evaluateSuccessRate(this.chance, 0, this.max);
    if (amount < 1) {
      Module.log(false, 'Skipping trinket generation');
      return [];
    }

    const trinkets = await Utils.rollTable(this.table, amount);
    Module.log(false, `Generated ${amount} trinket/s (${this.chance}% chance, max ${this.max})${trinkets.length ? ': ' + Utils.parseItemNames(trinkets) : ''}`);

    return trinkets;
  }

  /**
   * Generates a random amount of ammo matching the ranged weapons of the actor (if any).
   * @param {Actor} actor - The actor to handle
   * @returns {Promise<ItemQuantity[]>} The list of ammo generated
   */
  static async generateAmmo(actor) {
    const weaponsAndAmmo = [
      { weapons: ['shortbow', 'longbow', 'oathbow'], ammo: 'Arrow', quantityRoll: '4d3-5' },
      { weapons: ['crossbow'], ammo: 'Crossbow Bolt', quantityRoll: '4d3-5' },
      { weapons: ['blowgun'], ammo: 'Blowgun Needle', quantityRoll: '4d3-5'  },
      { weapons: ['sling'], ammo: 'Sling Bullet', quantityRoll: '4d3' },
      { weapons: ['dart', 'javelin'], quantityRoll: '4d3-8' },
    ]

    const ammoToAdd = actor.items
      .map(i => {
        if (i.type !== 'weapon')
          return;
        const weapon = weaponsAndAmmo.find(wa => wa.weapons.some(weaponName => i.name.toLowerCase().includes(weaponName)));
        const item = weapon ? weapon.ammo || i : null;
        const quantity = item ? Math.max(0, Utils.rollDice(weapon.quantityRoll)) : 0;
        return quantity ? { item, quantity } : null;
      })
      .filter(Boolean)
      .reduce((acc, ammo) => {
        const existing = acc.find(a => (a.item.name || a.item) === (ammo.item.name || ammo.item));
        if (existing)
          existing.quantity += ammo.quantity;
        else
          acc.push(ammo);
        return acc;
      }, []);

    for (const ammo of ammoToAdd) {
      ammo.item = typeof ammo.item === 'string' ? await Utils.getItem(ammo.item) : ammo.item;
    }

    if (ammoToAdd.length)
      Module.log(false, `Generated ammo: ${Utils.parseItemNames(ammoToAdd)}`);

    return ammoToAdd;
  }
}