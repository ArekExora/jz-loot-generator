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
  static treasureTables = [{
    type: 'Gemstones',
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
      { name: 'Turquoise', description: 'Opaque light blue-green', img: 'icons/commodities/gems/gem-rough-oval-teal.webp' },
    ]
  },{
    type: 'Gemstones',
    valueInGp: 50,
    items: [ ]
  },{
    type: 'Gemstones',
    valueInGp: 100,
    items: [ ]
  },{
    type: 'Gemstones',
    valueInGp: 500,
    items: [ ]
  },{
    type: 'Gemstones',
    valueInGp: 1000,
    items: [ ]
  },{
    type: 'Gemstones',
    valueInGp: 5000,
    items: [ ]
  },{
    type: 'ArtObjects',
    valueInGp: 25,
    items: [ ]
  },{
    type: 'ArtObjects',
    valueInGp: 250,
    items: [ ]
  },{
    type: 'ArtObjects',
    valueInGp: 750,
    items: [ ]
  },{
    type: 'ArtObjects',
    valueInGp: 2500,
    items: [ ]
  },{
    type: 'ArtObjects',
    valueInGp: 7500,
    items: [ ]
  }];

  static async generateItems(cleanFirst = false) {
    const pack = Module.COMPENDIUMS.TREASURES.nameInWorld;
    const items = this.treasureTables.reduce((acc, group) => [...acc, ...group.items.map(i => this.#prepare(i, group.valueInGp))], []);

    await this.#createCompendiums([Module.COMPENDIUMS.TREASURES, Module.COMPENDIUMS.LOOT_TABLES], cleanFirst);

    let itemsToGenerate = [];
    if (cleanFirst) {
      itemsToGenerate = items;
    } else {
      const findings = await Promise.all(items.map(i => Utils.getItem(i, [pack])));
      itemsToGenerate = items.filter((_v, index) => !findings[index]);
    }
    
    if (itemsToGenerate.length) {
      Module.debug(false, 'Generating items: ', itemsToGenerate);    
      await Item.createDocuments(itemsToGenerate, { pack });
      await this.#generateTables();
    }
  }

  static async #generateTables() {
    const itemsPack = Module.COMPENDIUMS.TREASURES.nameInWorld;
    const tablesPack = Module.COMPENDIUMS.LOOT_TABLES.nameInWorld;

    const treasures = game.packs.get(itemsPack).map(i => ({ name: i.name, id: i._id, img: i.img, price: i.system.price.value }));

    const tables = this.treasureTables.map(({ type, valueInGp }) => {
      const results = treasures.filter(t => t.price === valueInGp).map((t, i) => {
        return {
          text: t.name,
          type: CONST.TABLE_RESULT_TYPES.COMPENDIUM,
          collection: 'Item',
          documentCollection: itemsPack,
          resultId: t.id,
          img: t.img,
          weight: 1,
          range: [i+1, i+1],
          drawn: false
        };
      });

      return results.length ? {
        name: `${type}_${valueInGp}gp`,
        description: `A random treasure generation table.`,
        results,
        formula: `1d${results.length}`
      } : null;
    }).filter(Boolean);

    if (tables.length) {
      await this.#deleteExistingTables(tables.map(t => t.name));
      Module.debug(false, 'Generating tables: ', tables);
      await RollTable.createDocuments(tables, { pack: tablesPack });
    }
  }

  static async #deleteExistingTables(tableList) {
    for (const name of tableList) {
      const table = await Utils.getTable(name);
      if (table) {
        Module.debug(false, `Deleting table ${name}`);
        await game.tables.getName(name).delete();
      }
    }
  }

  static async #createCompendiums(compendiumList, cleanFirst) {
    for (const { nameInWorld, name, label, type } of compendiumList) {
      const pack = game.packs.get(nameInWorld);

      if (pack && cleanFirst) {
        Module.debug(false, `Recreating compendium ${label}`);
        await pack.deleteCompendium();
        await CompendiumCollection.createCompendium({ label, name, type });
      } else {
        Module.debug(false, `Creating compendium ${label}`);
        await CompendiumCollection.createCompendium({ label, name, type });
      }
    }
  }

  static #prepare(itemData, price) {
    return itemData.type === 'Gemstones' ? this.#prepareGem(itemData, price) : this.#prepareArtObject(itemData, price);
  }

  static #prepareGem(itemData, price) {
    return this.#prepareItem({ ...itemData, price, description: `${itemData.description} gem, valued around ${price}gp`, rarity: price > 500 ? ITEM_RARITY.UNCOMMON : ITEM_RARITY.COMMON });
  }

  static #prepareArtObject(itemData, price) {
    return this.#prepareItem({ ...itemData, price, description: `${itemData.description}, valued around ${price}gp`, rarity: price > 500 ? ITEM_RARITY.UNCOMMON : ITEM_RARITY.COMMON });
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
}
