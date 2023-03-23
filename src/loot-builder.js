import { Utils } from './utils.js';
import { JZLootGenerator as Module } from './jz-loot-generator.js';

export const ITEM_RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  VERY_RARE: 'veryRare',
  LEGENDARY: 'legendary',
  ARTIFACT: 'artifact',
}


/**
 * Class in charge of creating all the loot items for the module (only for developing purposes).
 * @Class
 */
export class LootBuilder {
  static gems = [{
    tableName: 'Gemstones_10gp',
    valueInGp: 10,
    items: [
      { name: 'Azurite', description: 'Opaque mottled deep blue', img: 'icons/commodities/gems/gem-cluster-blue-white.webp' },
      { name: 'Banded agate', description: 'Translucent striped brown, blue, white or red', img: 'icons/commodities/gems/gem-fragments-red.webp' },
      { name: 'Blue quartz', description: 'Transparent pale blue', img: 'icons/commodities/gems/gem-rough-pendeloque-blue.webp' },
      { name: 'Eye agate', description: 'Translucent circles of gray, white, brown, blue or green', img: 'icons/commodities/gems/pearl-brown.webp' },
      { name: 'Hematite', description: 'Opaque gray-black', img: 'icons/commodities/gems/gem-rough-navette-blue.webp' },
      { name: 'Lapis lazuli', description: 'Opaque light and dark blue with yellow flecks', img: 'icons/commodities/gems/gem-rough-cushion-blue.webp' },
      { name: 'Malachite', description: 'Opaque striated light and dark green', img: 'icons/commodities/gems/gem-raw-rough-teal.webp' },
      { name: 'Moss agate', description: 'Translucent pink or yellow-white with mossy gray or green markings', img: 'icons/commodities/gems/gem-rough-tapered-green.webp' },
      { name: 'Obsidian', description: 'Opaque black', img: 'icons/commodities/gems/gem-rough-cushion-violet.webp' },
      { name: 'Rhodochrosite', description: 'Opaque light pink', img: 'icons/commodities/gems/gem-rough-navette-pink.webp' },
      { name: 'Tiger eye', description: 'Translucent brown with golden center', img: 'icons/commodities/gems/gem-rough-cushion-orange-red.webp' },
      { name: 'Turquoise', description: 'Opaque light blue-green', img: 'icons/commodities/gems/gem-rough-oval-teal.webp' }
    ]
  },{
    tableName: 'Gemstones_50gp',
    valueInGp: 50,
    items: [ ]
  },{
    tableName: 'Gemstones_100gp',
    valueInGp: 100,
    items: [ ]
  },{
    tableName: 'Gemstones_500gp',
    valueInGp: 500,
    items: [ ]
  },{
    tableName: 'Gemstones_1000gp',
    valueInGp: 1000,
    items: [ ]
  },{
    tableName: 'Gemstones_5000gp',
    valueInGp: 5000,
    items: [ ]
  }];

  static artObjects = [{
    tableName: 'ArtObjects_25gp',
    valueInGp: 25,
    items: [ ]
  },{
    tableName: 'ArtObjects_250gp',
    valueInGp: 250,
    items: [ ]
  },{
    tableName: 'ArtObjects_750gp',
    valueInGp: 750,
    items: [ ]
  },{
    tableName: 'ArtObjects_2500gp',
    valueInGp: 2500,
    items: [ ]
  },{
    tableName: 'ArtObjects_7500gp',
    valueInGp: 7500,
    items: [ ]
  }];

  static async generateItems() {
    const pack = 'world.loottest';
    const gems = this.gems.reduce((acc, gemGroup) => [...acc, ...gemGroup.items.map(g => this.#prepareGem(g, gemGroup.valueInGp))], []);

    const items = [...gems];
  
    const findings = await Promise.all(items.map(i => Utils.getItem(i, [pack])));
    const missing = items.filter((_v, index) => !findings[index]);
    
    if (missing.length) {
      Module.debug(false, 'Generating items: ', missing);    
      await Item.createDocuments(missing, { pack });
    }
  }

  static async generateTables() {
    // Mirar por TableResult.creat(trdata, { parent: table });
    // Pero mejor crearlo todo del tiron desde el RollTable.create
    const rollTableData = { name: 'Test', formula: '1d20' };
    RollTable.create(rollTableData);
  }

  static #prepareItem({ name, img, type = 'loot', price = 0, coinType = 'gp', weight = 0.01, description = 'Just an item.', rarity = ITEM_RARITY.COMMON }) {
    return {
      name,
      type,
      img,
      system: {
        price: {
          value: price,
          denomination: coinType
        },
        weight,
        description: {
          value: `<p>${description}</p>`
        },
        rarity,
        source: 'JZ Loot Generator'
      }
    };
  }

  static #prepareGem(gemData, price) {
    return this.#prepareItem({ ...gemData, price, description: `${gemData.description} gem, valued around ${price}gp`, rarity: price > 500 ? ITEM_RARITY.UNCOMMON : ITEM_RARITY.COMMON });
  }
}
