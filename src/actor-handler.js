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
  TREASURE_TYPE = 'treasure';
  PILE_SETTINGS = {
    displayOne: false,
    shareCurrenciesEnabled: false,
    takeAllEnabled: true,
    activePlayers: true,
    deleteWhenEmpty: false, // May lead to token deletion on kill.
  }

  constructor (actor) {
    // Load config
    this.typesWithLoot = Module.getConfig(Module.SETTINGS.TYPES_WITH_LOOT).split(',').map(t => t.trim().toLowerCase());
    this.turnIntoItemPilesEnabled = Module.getConfig(Module.SETTINGS.TURN_INTO_ITEM_PILES);

    this.actor = actor;
    this.itemsHandler = new ActorItemsHandler(actor);
  }

  /**
   * Generate the loot for a given actor, updating it.
   */
  async generateLoot() {
    if (!this.#isNPC())
      return;

    let treasures = [];
    let coins = {};
    const { treasureRolls, hasTrinkets, turnToPile, minCoinFactor } = this.#getFlags();
    
    if (treasureRolls)
      coins = CoinGenerator.generateIndividualTreasure(this.actor, treasureRolls, minCoinFactor);
    ({ coins, treasures } = await TreasureConverter.convertCoinsToTreasures(coins));
    treasures.push(...await TrinketGenerator.generateAmmo(this.actor));
    if (hasTrinkets)
      treasures.push(...await TrinketGenerator.generateTrinkets());

    await this.itemsHandler.addCoins(coins);
    await this.itemsHandler.addItemQuantities(treasures);

    if (turnToPile)
      this.#turnToItemPile({ deleteWhenEmpty: true });
  }

  /**
   * Breaks and damages the items the actor has, and optionally turns it into an Item Pile.
   */
  async deteriorateItems() {    
    if (!this.#isNPC())
      return;

    await this.itemsHandler.deteriorateItems();
    await this.#turnToItemPile();

    return this;
  }
  
  #getFlags() {
    const hasLoot = this.#shouldGenerateLoot();
    const treasureLevel = this.#getTreasureLevel();

    return {
      treasureRolls: treasureLevel || Number(hasLoot),
      hasTrinkets: hasLoot,
      turnToPile: !!treasureLevel,
      minCoinFactor: Number(treasureLevel),
    }
  }

  #shouldGenerateLoot() {
    const { value, custom, subtype } = this.actor.system?.details?.type || {};
    const type = [value, custom, subtype].filter(Boolean).map(t => t.toLowerCase());
    Module.debug(false, `Checking if ${this.actor.name}(${type.join(', ')}) should generate loot. Types with loot: ${this.typesWithLoot.join(', ')}`);

    if (!this.typesWithLoot.includes('ALL') && !this.typesWithLoot.some(t => type.includes(t))) {
      Module.log(false, `Skipping loot generation, ${this.actor.name}(${type.join(', ')}) cannot have loot`);
      return false;
    }

    return true;
  }

  #getTreasureLevel() {
    const defaultTreasureLevel = 5;
    const type = this.actor.system?.details?.type || {};
    const isTreasure = type.custom?.toLowerCase() === this.TREASURE_TYPE;
    return isTreasure ? parseInt(type.subtype) || defaultTreasureLevel : 0;
  }

  async #turnToItemPile(pileConfigOverrides = {}) {
    if (!this.turnIntoItemPilesEnabled || !Utils.requireModule('item-piles'))
      return;

    const token = this.actor.getActiveTokens()[0];
    if (!token) {
      Module.error('no_tokens_for_actor', { name: this.actor.name });
      return;
    }
    
    Module.debug(false, `Turning ${this.actor.name} into an item pile`);
    await game.itempiles.API.turnTokensIntoItemPiles(token, { pileSettings: { ...this.PILE_SETTINGS, ...pileConfigOverrides } });
  }

  #isActor() {
    if (this.actor && this.actor instanceof Actor)
      return true;

    Module.error('invalid_actor');
    Module.logError(false, `Invalid actor received:`, this.actor);
    return false;
  }

  #isNPC() {
    return this.#isActor() && this.actor.type === 'npc';
  }
}