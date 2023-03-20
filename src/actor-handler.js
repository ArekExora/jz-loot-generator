import './typedefs.js';
import { JZLootGenerator as Module } from './jz-loot-generator.js';
import { Utils } from './utils.js';
import { CoinGenerator } from './coin-generator.js';
import { TreasureConverter } from './treasure-converter.js';
import { TrinketGenerator } from './trinket-generator.js';
import { ActorItemsHandler } from './actor-items-handler.js';

/**
 * Exposes all the operations related to an actor.
 * @Class
 */
export class ActorHandler {
  static get typesWithLoot() {
    return Module.getConfig(Module.SETTINGS.TYPES_WITH_LOOT).split(',').map(t => t.trim().toLowerCase());
  }
  
  static get turnIntoItemPilesEnabled() {
    return Module.getConfig(Module.SETTINGS.TURN_INTO_ITEM_PILES);
  }

  static TREASURE_TYPE = 'treasure';

  static PILE_SETTINGS = {
    displayOne: false,
    shareCurrenciesEnabled: false,
    takeAllEnabled: true,
    activePlayers: true,
    deleteWhenEmpty: false, // May lead to token deletion on kill.
  }

  /**
   * Generate the loot for a given actor, updating it.
   * @param {Actor} actor - The actor to handle
   */
  static async generateLoot(actor) {
    if (!this.#isNPC(actor))
      return;

    const treasureLevel = this.#getTreasureLevel(actor);
    if (treasureLevel) {
      await this.#stashTreasure(actor, treasureLevel);
    } else if (this.#shouldGenerateLoot(actor)) {
      await this.#generateNPCLoot(actor);
    }
  }

  /**
   * Break and damage the items the actor has, and optionally turns it into an Item Pile.
   * @param {Actor} actor - The actor to handle
   */
  static async deteriorateItems(actor) {    
    if (!this.#isNPC(actor))
      return;

    await ActorItemsHandler.deteriorateEquipment(actor);
    await this.#turnToItemPile(actor);
  }

  static #shouldGenerateLoot(actor) {
    const { value, custom, subtype } = actor.system?.details?.type || {};
    const type = [value, custom, subtype].filter(Boolean).map(t => t.toLowerCase());
    Module.debug(false, `Checking if ${actor.name}(${type.join(', ')}) should generate loot. Types with loot: ${this.typesWithLoot.join(', ')}`);

    if (!this.typesWithLoot.includes('ALL') && !this.typesWithLoot.some(t => type.includes(t))) {
      Module.log(false, `Skipping loot generation, ${actor.name}(${type.join(', ')}) cannot have loot`);
      return false;
    }

    return true;
  }

  static #getTreasureLevel(actor) {
    const treasureSizes = {
      tiny: 1,
      sm: 3,
      med: 5,
      lg: 8,
      huge: 10,
      grg: 15,
    };

    const type = actor.system?.details?.type;
    const isTreasure = type?.custom === this.TREASURE_TYPE;

    return isTreasure ? treasureSizes[type?.swarm || 'med'] : 0;
  }

  static async #generateNPCLoot(actor) {
    let treasures = [];
    let coins = CoinGenerator.generateIndividualTreasure(actor);
    ({ coins, treasures }= await TreasureConverter.convertCoinsToTreasures(coins));
    treasures.push(...await TrinketGenerator.generateTrinkets());
    treasures.push(...await TrinketGenerator.generateAmmo(actor));

    await ActorItemsHandler.addCoinsToActor(actor, coins);
    await ActorItemsHandler.addItemQuantities(actor, treasures);
  }

  static async #stashTreasure(actor, treasureLevel) {
    let treasures = [];
    let coins = CoinGenerator.generateIndividualTreasure(actor, treasureLevel);
    ({ coins, treasures } = await TreasureConverter.convertCoinsToTreasures(coins));

    await ActorItemsHandler.addCoinsToActor(actor, coins);
    await ActorItemsHandler.addItemQuantities(actor, treasures);
    
    this.#turnToItemPile(actor, { deleteWhenEmpty: true });
  }

  static async #turnToItemPile(actor, pileConfigOverrides = {}) {
    if (!this.turnIntoItemPilesEnabled || !Utils.requireModule('item-piles'))
      return;

    const token = actor.getActiveTokens()[0];
    if (!token) {
      Module.error(`No active tokens found for ${actor.name}!`);
      return;
    }
    
    Module.debug(false, `Turning ${actor.name} into an item pile`);
    await game.itempiles.API.turnTokensIntoItemPiles(token, { pileSettings: { ...this.PILE_SETTINGS, ...pileConfigOverrides } });
  }

  static #isActor(actor) {
    if (!actor instanceof Actor) {
      Module.error('Invalid actor!');
      Module.logError(`Invalid actor received:`, actor);
      return false;
    }
    return true;
  }

  static #isNPC(actor) {
    return this.#isActor(actor) && actor.type === 'npc';
  }
}