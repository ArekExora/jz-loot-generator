import './typedefs.js';
import { JZLootGenerator as Module } from './jz-loot-generator.js';
import { ItemHandler } from './item-handler.js';


/**
 * Exposes all the operations related to the items from an actor.
 * @Class
 */
export class ActorItemsHandler {

  constructor (actor) {
    // Load config
    this.breakChance = Module.getConfig(Module.SETTINGS.ITEM_DETERIORATION.BREAK_CHANCE);  
    this.damageChance = Module.getConfig(Module.SETTINGS.ITEM_DETERIORATION.DAMAGE_CHANCE);
    this.breakableTypes = Module.getConfig(Module.SETTINGS.ITEM_DETERIORATION.BREAKABLE_TYPES).split(',').map(t => t.trim().toLowerCase());
    this.damageableTypes = Module.getConfig(Module.SETTINGS.ITEM_DETERIORATION.DAMAGEABLE_TYPES).split(',').map(t => t.trim().toLowerCase());
    this.breakableMagicItems = Module.getConfig(Module.SETTINGS.ITEM_DETERIORATION.BREAKABLE_MAGIC_ITEMS);

    this.actor = actor;
  }

  /**
   * Add a set of coins to the actor.
   * @param {CoinGroup} coins - The set of coins
   */
  async addCoins(coins) {
    const currency = this.actor.system.currency;

    for (let coinType in coins) {
      currency[coinType] += coins[coinType];
    }

    await this.actor.update({ 'system.currency': currency });
    return this;
  }

  /**
   * Add a list of itemQuantities to the actor.
   * @param {ItemQuantity[]} itemQuantities - The list of item and quantities
   */
  async addItemQuantities(itemQuantities) {
    itemQuantities = itemQuantities
      .map(({ item, quantity }) => {
        const actorItem = this.actor.items.find(i => this.#isSameItem(item, i));
        quantity += actorItem ? actorItem.system.quantity : 0;
        return { item, quantity, actorItem };
      });
    
    return await this.setItemQuantities(itemQuantities, true);
  }

  /**
   * Set a list of itemQuantities to the actor, overwritting the previous quantities for the items in the list.
   * @param {ItemQuantity[]} itemQuantities - The list of item and quantities
   */
  async setItemQuantities(itemQuantities, withActorItems = false) {
    itemQuantities = withActorItems ? itemQuantities : itemQuantities
      .map(({ item, quantity }) => ({ item, quantity, actorItem: this.actor.items.find(i => this.#isSameItem(item, i)) }));

    const toRemove = itemQuantities.filter(({ quantity }) => quantity < 1)
      .map(({ actorItem }) => actorItem._id);
    const toUpdate = itemQuantities.filter(({ quantity, actorItem }) => quantity > 0 && actorItem && actorItem.system.quantity !== quantity)
      .map(({ quantity, actorItem }) => ({ _id: actorItem._id, 'system.quantity': quantity }));
    const toAdd = itemQuantities.filter(({ quantity, actorItem }) => quantity > 0 && !actorItem)
      .map(({ quantity, item }) => ({ ...item, system: { ...item.system, quantity }}));

    if (toRemove.length)
      await this.actor.deleteEmbeddedDocuments('Item', toRemove);
    if (toUpdate.length)
      await this.actor.updateEmbeddedDocuments('Item', toUpdate);
    if (toAdd.length)
      await this.actor.createEmbeddedDocuments('Item', toAdd);
    return this;
  }

  /**
   * Deteriorates the items the actor has, based on the configuration of the module.
   */
  async deteriorateItems() {
    // ['equipment', 'weapon', 'consumable', 'backpack', 'tool', 'loot'] Item types in DnD5e SRD => game.items.reduce((acc, item) => acc.includes(item.type) ? acc : [...acc, item.type], []);
    Module.log(false, `Deteriorating items from ${this.actor.name}`);
    const modifiedItems = this.actor.items
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
      
    this.setItemQuantities(modifiedItems);
  }

  #breakItemQuantity({ item, quantity }) {
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

  #isSameItem(itemA, itemB) {
    return itemA?.name === itemB?.name && itemA?.type === itemB?.type;
  }

  #canBeBroken(item) {
    return this.breakableTypes.includes(item.type.toLowerCase()) && (this.breakableMagicItems || !item.system.properties?.mgc);
  }

  #canBeDamaged(item) {
    return this.damageableTypes.includes(item.type.toLowerCase()) && (this.breakableMagicItems || !item.system.properties?.mgc);
  }

}