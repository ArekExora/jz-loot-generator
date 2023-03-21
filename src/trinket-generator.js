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
    const arrow = game.items.getName('Arrow');
    const bolt = game.items.getName('Crossbow Bolt');
    const needle = game.items.getName('Blowgun Needle');
    const slingBullet = game.items.getName('Sling Bullet');

    const weaponsAndAmmo = [
      { weapons: ['shortbow', 'longbow', 'oathbow'], ammo: arrow, quantityRoll: '4d3-5' },
      { weapons: ['crossbow'], ammo: bolt, quantityRoll: '4d3-5' },
      { weapons: ['blowgun'], ammo: needle, quantityRoll: '4d3-5'  },
      { weapons: ['sling'], ammo: slingBullet, quantityRoll: '4d3' },
      { weapons: ['dart', 'javelin'], quantityRoll: '4d3-8' },
    ]

    const ammoToAdd = actor.items.map(i => {
      const weapon = weaponsAndAmmo.find(wa => wa.weapons.some((weaponName) => i.name.toLowerCase().includes(weaponName)));
      const item = weapon ? weapon.ammo || i : null;
      const quantity = item ? Math.max(0, Utils.rollDice(weapon.quantityRoll)) : 0;
      return quantity ? { item, quantity } : null;
    }).filter(Boolean);

    if (ammoToAdd.length)
      Module.log(false, `Generated ammo: ${Utils.parseItemNames(ammoToAdd)}`);

    return ammoToAdd;
  }
}