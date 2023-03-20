import './typedefs.js';
import { JZLootGenerator as Module } from './jz-loot-generator.js';
import { ItemHandler } from './item-handler.js';


/**
 * Exposes all the operations related to the items from an actor.
 * @Class
 */
export class ActorItemsHandler {
  static get breakChance() {
    return Module.getConfig(Module.SETTINGS.ITEM_DETERIORATION.BREAK_CHANCE);
  }

  static get damageChance() {
    return Module.getConfig(Module.SETTINGS.ITEM_DETERIORATION.DAMAGE_CHANCE);
  }

  static get breakableTypes() {
    return Module.getConfig(Module.SETTINGS.ITEM_DETERIORATION.BREAKABLE_TYPES).split(',').map(t => t.trim().toLowerCase());
  }
  
  static get damageableTypes() {
    return Module.getConfig(Module.SETTINGS.ITEM_DETERIORATION.DAMAGEABLE_TYPES).split(',').map(t => t.trim().toLowerCase());
  }
  
  static get breakableMagicItems() {
    return Module.getConfig(Module.SETTINGS.ITEM_DETERIORATION.BREAKABLE_MAGIC_ITEMS);
  }

  /**
   * Add a set of coins to an actor.
   * @param {Actor} actor - The actor to handle
   * @param {CoinGroup} coins - The set of coins
   */
  static async addCoinsToActor(actor, coins) {
    const currency = actor.system.currency;

    for (let coinType in coins) {
      currency[coinType] += coins[coinType];
    }

    await actor.update({ 'system.currency': currency });
  }

  /**
   * Add a list of itemQuantities to an actor.
   * @param {Actor} actor - The actor to handle
   * @param {ItemQuantity[]} itemQuantities - The list of item and quantities
   */
  static async addItemQuantities(actor, itemQuantities) {
    itemQuantities = itemQuantities
      .map(({ item, quantity }) => {
        const actorItem = actor.items.find(i => this.#isSameItem(item, i));
        quantity += actorItem ? actorItem.system.quantity : 0;
        return { item, quantity, actorItem };
      });
    
    await this.setItemQuantities(actor, itemQuantities, true);
  }

  /**
   * Set a list of itemQuantities to an actor, overwritting the previous quantities for the items in the list.
   * @param {Actor} actor - The actor to handle
   * @param {ItemQuantity[]} itemQuantities - The list of item and quantities
   */
  static async setItemQuantities(actor, itemQuantities, withActorItems = false) {
    itemQuantities = withActorItems ? itemQuantities : itemQuantities
      .map(({ item, quantity }) => ({ item, quantity, actorItem: actor.items.find(i => this.#isSameItem(item, i)) }));

    const toRemove = itemQuantities.filter(({ quantity }) => quantity < 1)
      .map(({ actorItem }) => actorItem._id);
    const toUpdate = itemQuantities.filter(({ quantity, actorItem }) => quantity > 0 && actorItem && actorItem.system.quantity !== quantity)
      .map(({ quantity, actorItem }) => ({ _id: actorItem._id, 'system.quantity': quantity }));
    const toAdd = itemQuantities.filter(({ quantity, actorItem }) => quantity > 0 && !actorItem)
      .map(({ quantity, item }) => ({ ...item, system: { ...item.system, quantity }}));

    if (toRemove.length)
      await actor.deleteEmbeddedDocuments('Item', toRemove);
    if (toUpdate.length)
      await actor.updateEmbeddedDocuments('Item', toUpdate);
    if (toAdd.length)
      await actor.createEmbeddedDocuments('Item', toAdd);
  }

  /**
   * Deteriorates the items an actor has, based on the configuration of the module.
   * @param {Actor} actor - The actor to handle
   */
  static async deteriorateEquipment(actor) {
    // ['equipment', 'weapon', 'consumable', 'backpack', 'tool', 'loot'] Item types in DnD5e SRD => game.items.reduce((acc, item) => acc.includes(item.type) ? acc : [...acc, item.type], []);
    Module.log(false, `Deteriorating items from ${actor.name}`);
    const modifiedItems = actor.items
      .map(item => this.#breakItemQuantity({ item, quantity: item.system.quantity }))
      .filter(Boolean);

    const toDamage = modifiedItems.filter(({ damaged }) => damaged);
    for (let i = 0; i < toDamage.length; i++) {
      const quantity = toDamage[i].damaged;
      const newItem = await new ItemHandler(toDamage[i].item).getDamaged();
      const itemInList = modifiedItems.find(({ item }) => this.#isSameItem(item, newItem));
      if (itemInList) {
        itemInList.quantity += quantity;
      } else {
        modifiedItems.push({ item: newItem, quantity });
      }
    }
      
    this.setItemQuantities(actor, modifiedItems);
  }

  static #breakItemQuantity({ item, quantity }) {
    if (!this.#canBeBroken(item) && !this.#canBeDamaged(item))
      return;

    let q = quantity;
    let damaged = 0;

    for (let i = q; i > 0; i--) {
      const rand = Math.random() * 100;
      if (rand < this.breakChance && this.#canBeBroken(item)) {
        q--;
        Module.debug(false, `Item broken: ${item.name}`);
      } else if (rand < this.damageChance && this.#canBeDamaged(item)) {
        q--;
        if (new ItemHandler(item).isDamaged) {
          Module.debug(false, `Item damaged beyond repair: ${item.name}`);
        } else {
          damaged++;
          Module.debug(false, `Item damaged: ${item.name}`);
        }
      }
    }

    return quantity === q ? null : { item, quantity: q, damaged };
  }

  static #isSameItem(itemA, itemB) {
    return itemA?.name === itemB?.name && itemA?.type === itemB?.type;
  }

  static #canBeBroken(item) {
    return this.breakableTypes.includes(item.type.toLowerCase()) && (this.breakableMagicItems || !item.system.properties?.mgc);
  }

  static #canBeDamaged(item) {
    return this.damageableTypes.includes(item.type.toLowerCase()) && (this.breakableMagicItems || !item.system.properties?.mgc);
  }

}