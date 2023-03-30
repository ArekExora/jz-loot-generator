import './typedefs.js';
import { BaseModule } from './base-module.js';
import { ActorHandler } from './actor-handler.js';
import { LootBuilder } from './loot-builder.js';

/**
 * Main module class
 * @Class
 */
export class JZLootGenerator extends BaseModule {
  static ID = 'jz-loot-generator';
  static SETTINGS = {
    DEBUG: 'debug_level',
    TYPES_WITH_LOOT: 'types_with_loot',
    TREASURE: {
      CONVERSION_RATE: 'treasure_conversion-percentage',
    },
    TRINKETS: {
      PERCENTAGE: 'trinket_percentage',
      MAX: 'trinket_max',
      TABLE: 'trinket_table',
    },
    COINS: {
      PERCENTAGE: 'coins_percentage',
      MAX_FACTOR: 'coins_max-factor',
    },
    ITEM_DETERIORATION: {
      BREAK_CHANCE: 'break_chance',
      DAMAGE_CHANCE: 'damage_chance',
      BREAKABLE_TYPES: 'breakable_types',
      DAMAGEABLE_TYPES: 'damageable_types',
      PRICE_LOSS_FACTOR: 'price_loss_factor',
      UTILITY_LOSS_FACTOR: 'utility_loss_factor',
      BREAKABLE_MAGIC_ITEMS: 'breakable_magic_items',
    },
    TURN_INTO_ITEM_PILES: 'turn_into_item_piles',
  };

  static COMPENDIUMS = {
    TREASURES: {
      ...this.#generateModuleNames(`${this.ID}_treasures`),
      label: 'Lootable treasures',
      type: 'Item',
    },
    TRINKETS: {
      ...this.#generateModuleNames(`${this.ID}_trinkets`),
      label: 'Lootable trinkets',
      type: 'Item',
    },
    LOOT_TABLES: {
      ...this.#generateModuleNames(`${this.ID}_tables`),
      label: 'Loot tables',
      type: 'RollTable',
    },
  };

  static COMPENDIUM_LIST = [this.COMPENDIUMS.TREASURES, this.COMPENDIUMS.TRINKETS, this.COMPENDIUMS.LOOT_TABLES];
  
  static initialize() {
    this.setupSettings();
    super.initialize();

    this.log(true, 'Initialized');
  }

  static setupSettings() {
    [{
      key: this.SETTINGS.TYPES_WITH_LOOT,
      config: { type: String, default: 'humanoid' }
    },{
      key: this.SETTINGS.COINS.PERCENTAGE,
      config: { type: Number, default: 80, range: { min: 0, max: 100 } }
    },{
      key: this.SETTINGS.COINS.MAX_FACTOR,
      config: { type: Number, default: 3, range: { min: 1, max: 5 } }
    },{
      key: this.SETTINGS.TREASURE.CONVERSION_RATE,
      config: { type: Number, default: 33, range: { min: 0, max: 100 } }
    },{
      key: this.SETTINGS.TRINKETS.PERCENTAGE,
      config: { type: Number, default: 60, range: { min: 0, max: 100 } }
    },{
      key: this.SETTINGS.TRINKETS.MAX,
      config: { type: Number, default: 3, range: { min: 1, max: 5 } }
    },{
      key: this.SETTINGS.TRINKETS.TABLE,
      config: { type: String, default: LootBuilder.trinkets.tableName }
    },{
      key: this.SETTINGS.ITEM_DETERIORATION.BREAK_CHANCE,
      config: { type: Number, default: 80, range: { min: 0, max: 100 } }
    },{
      key: this.SETTINGS.ITEM_DETERIORATION.BREAKABLE_TYPES,
      config: { type: String, default: 'equipment, weapon, consumable, backpack, tool' }
    },{
      key: this.SETTINGS.ITEM_DETERIORATION.DAMAGE_CHANCE,
      config: { type: Number, default: 95, range: { min: 0, max: 100 } }
    },{
      key: this.SETTINGS.ITEM_DETERIORATION.DAMAGEABLE_TYPES,
      config: { type: String, default: 'equipment, weapon' }
    },{
      key: this.SETTINGS.ITEM_DETERIORATION.PRICE_LOSS_FACTOR,
      config: { type: Number, default: 75, range: { min: 0, max: 100 } }
    },{
      key: this.SETTINGS.ITEM_DETERIORATION.UTILITY_LOSS_FACTOR,
      config: { type: Number, default: 50, range: { min: 0, max: 100 } }
    },{
      key: this.SETTINGS.ITEM_DETERIORATION.BREAKABLE_MAGIC_ITEMS,
      config: { type: Boolean, default: false }
    },{
      key: this.SETTINGS.TURN_INTO_ITEM_PILES,
      config: { type: Boolean, default: !!game.modules.get('item-piles')?.active }
    }].forEach(({ key, config }) => this._setupSetting(key, config));
  }

  static #generateModuleNames(name) {
    return {
      name,
      nameInWorld: `world.${name}`,
      nameInModule: `world.${name}`,
    }
  }

}

Hooks.once('init', () => {
  JZLootGenerator.initialize();

  game.JZLootGenerator = { generateItems: (cleanFirst) => LootBuilder.generateItems(cleanFirst) }
});

// Cannot be done in precreateToken, the actor is not ready at that point (the original actor is updated also)
Hooks.on('createToken', (token, options, userId) => {
  if (userId === game.userId)
    new ActorHandler(token?.actor).generateLoot();
});

Hooks.on('updateActor', (actor, change, options, userId) => {
  const newHP = change.system?.attributes?.hp?.value;
  if (userId === game.userId && newHP === 0)
    new ActorHandler(actor).deteriorateItems();
});

// Hooks.on('renderActorSheet5eNPC', async (sheet, html, data) => {
//   await NPCSheetHandler.displayCurrency(sheet, html, data);
// });
