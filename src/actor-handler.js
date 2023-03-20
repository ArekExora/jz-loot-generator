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

    const treasureLevel = this.#getTreasureLevel();
    if (treasureLevel) {
      await this.#stashTreasure(treasureLevel);
    } else if (this.#shouldGenerateLoot()) {
      await this.#generateNPCLoot();
    }

    return this;
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
    const treasureSizes = {
      tiny: 1,
      sm: 3,
      med: 5,
      lg: 8,
      huge: 10,
      grg: 15,
    };

    const type = this.actor.system?.details?.type;
    const isTreasure = type?.custom === this.TREASURE_TYPE;

    return isTreasure ? treasureSizes[type?.swarm || 'med'] : 0;
  }

  async #generateNPCLoot() {
    let treasures = [];
    let coins = CoinGenerator.generateIndividualTreasure(this.actor);
    ({ coins, treasures }= await TreasureConverter.convertCoinsToTreasures(coins));
    treasures.push(...await TrinketGenerator.generateTrinkets());
    treasures.push(...await TrinketGenerator.generateAmmo(this.actor));

    await this.itemsHandler.addCoins(coins);
    await this.itemsHandler.addItemQuantities(treasures);
  }

  async #stashTreasure(treasureLevel) {
    let treasures = [];
    let coins = CoinGenerator.generateIndividualTreasure(this.actor, treasureLevel);
    ({ coins, treasures } = await TreasureConverter.convertCoinsToTreasures(coins));

    await this.itemsHandler.addCoins(coins);
    await this.itemsHandler.addItemQuantities(treasures);
    
    this.#turnToItemPile({ deleteWhenEmpty: true });
  }

  async #turnToItemPile(pileConfigOverrides = {}) {
    if (!this.turnIntoItemPilesEnabled || !Utils.requireModule('item-piles'))
      return;

    const token = this.actor.getActiveTokens()[0];
    if (!token) {
      Module.error(`No active tokens found for ${this.actor.name}!`);
      return;
    }
    
    Module.debug(false, `Turning ${this.actor.name} into an item pile`);
    await game.itempiles.API.turnTokensIntoItemPiles(token, { pileSettings: { ...this.PILE_SETTINGS, ...pileConfigOverrides } });
  }

  #isActor() {
    if (!this.actor instanceof Actor) {
      Module.error('Invalid actor!');
      Module.logError(`Invalid actor received:`, this.actor);
      return false;
    }
    return true;
  }

  #isNPC() {
    return this.#isActor() && this.actor.type === 'npc';
  }
}