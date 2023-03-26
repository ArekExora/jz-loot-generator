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
    items: [
      { name: 'Bloodstone', description: 'Opaque dark gray with red flecks', img: 'icons/commodities/gems/gem-rough-rose-red.webp' },
      { name: 'Carnelian', description: 'Opaque orange to red-brown', img: 'icons/commodities/gems/gem-rough-round-orange.webp' },
      { name: 'Chaldedony', description: 'Opaque white', img: 'icons/commodities/gems/pearl-white-oval.webp' },
      { name: 'Chrysoprase', description: 'Translucent green', img: 'icons/commodities/gems/gem-fragments-green.webp' },
      { name: 'Citrine', description: 'Transparent pale yellow-brown', img: 'icons/commodities/gems/gem-rough-pear-orange.webp' },
      { name: 'Jasper', description: 'Opaque blue, black or brown', img: 'icons/commodities/gems/gem-rough-cushion-purple.webp' },
      { name: 'Moonstone', description: 'Translucent white with pale blue glow', img: 'icons/commodities/gems/gem-rough-drop-blue.webp' },
      { name: 'Onyx', description: 'Opaque bands of black and white, or pure black or white', img: 'icons/commodities/gems/powder-raw-white.webp' },
      { name: 'Quartz', description: 'Transparent white, smoky gray, or yellow', img: 'icons/commodities/gems/gem-rough-oval-white.webp' },
      { name: 'Sardonyx', description: 'Opaque bands of red and white', img: 'icons/commodities/gems/gem-faceted-rough-red.webp' },
      { name: 'Star rose quartz', description: 'Translucent rosy stone with white star-shaped center', img: 'icons/commodities/gems/gem-rough-round-pink.webp' },
      { name: 'Zircon', description: 'Transparent pale blue-green', img: 'icons/commodities/gems/gem-fragments-turquoise.webp' },
    ]
  },{
    type: 'Gemstones',
    valueInGp: 100,
    items: [
      { name: 'Amber', description: 'Transparent watery gold to rich gold', img: 'icons/commodities/gems/gem-amber-insect-orange.webp' },
      { name: 'Amethyst', description: 'Transparent deep purple', img: 'icons/commodities/gems/gem-cut-faceted-princess-purple.webp' },
      { name: 'Chrysoberyl', description: 'Transparent yellow-green to pale green', img: 'icons/commodities/gems/gem-raw-rough-green-yellow.webp' },
      { name: 'Coral', description: 'Opaque crimsom', img: 'icons/commodities/gems/gem-rough-cushion-red.webp' },
      { name: 'Garnet', description: 'Transparent red, brown-green or violet', img: 'icons/commodities/gems/gem-rough-oval-purple.webp' },
      { name: 'Jade', description: 'Translucent light green, deep green or white', img: 'icons/commodities/gems/gem-rough-oval-green.webp' },
      { name: 'Jet', description: 'Opaque deep black', img: 'icons/commodities/gems/gem-rough-ball-purple.webp' },
      { name: 'Pearl', description: 'Opaque lustrous white, yellow or pink', img: 'icons/commodities/gems/pearl-rough-white.webp' },
      { name: 'Spinel', description: 'Transparent red, red-brown or deep green', img: 'icons/commodities/gems/gem-rough-square-red.webp' },
      { name: 'Tourmaline', description: 'Transparent pale green, blue, brown or red', img: 'icons/commodities/gems/pearl-rough-turquoise.webp' },
    ]
  },{
    type: 'Gemstones',
    valueInGp: 500,
    items: [
      { name: 'Alexandrite', description: 'Transparent dark green', img: 'icons/commodities/gems/gem-faceted-large-green.webp' },
      { name: 'Aquamarine', description: 'Transparent pale blue-green', img: 'icons/commodities/gems/gem-shattered-teal.webp' },
      { name: 'Black pearl', description: 'Opaque pure black', img: 'icons/commodities/gems/pearl-glass-purple.webp' },
      { name: 'Blue spinel', description: 'Transparent deep blue', img: 'icons/commodities/gems/gem-shattered-violet.webp' },
      { name: 'Peridot', description: 'Transparent rich olive green', img: 'icons/commodities/gems/gem-rough-brilliant-green.webp' },
      { name: 'Topaz', description: 'Transparent golden yellow', img: 'icons/commodities/gems/gem-rough-rectangular-red.webp' },
    ]
  },{
    type: 'Gemstones',
    valueInGp: 1000,
    items: [
      { name: 'Black opal', description: 'Translucent dark green with black mottling and golden flecks', img: 'icons/commodities/gems/gem-faceted-diamond-green.webp' },
      { name: 'Blue sapphire', description: 'Transparent blue-white to medium blue', img: 'icons/commodities/gems/gem-faceted-radiant-blue.webp' },
      { name: 'Emerald', description: 'Transparent deep bright green', img: 'icons/commodities/gems/gem-cut-table-green.webp' },
      { name: 'Fire opal', description: 'Translucent fiery red', img: 'icons/commodities/gems/gem-oval-red.webp' },
      { name: 'Opal', description: 'Translucent pale blue with green and golden mottling', img: 'icons/commodities/gems/gem-faceted-hexagon-blue.webp' },
      { name: 'Star ruby', description: 'Translucent ruby with white star-shaped center', img: 'icons/commodities/gems/pearl-fire-swirl.webp' },
      { name: 'Star sapphire', description: 'Translucent blue sapphire with white star-shaped center', img: 'icons/commodities/gems/pearl-swirl-blue.webp' },
      { name: 'Yellow sapphire', description: 'Transparent fiery yellow or yellow-green', img: 'icons/commodities/gems/gem-faceted-octagon-yellow.webp' },
    ]
  },{
    type: 'Gemstones',
    valueInGp: 5000,
    items: [
      { name: 'Black sapphire', description: 'Translucent lustrous black with glowing highlights', img: 'icons/commodities/gems/gem-faceted-round-black.webp' },
      { name: 'Diamond', description: 'Transparent blue-white, canary, pink, brown or blue', img: 'icons/commodities/gems/gem-faceted-round-white.webp' },
      { name: 'Jacinth', description: 'Transparent fiery orange', img: 'icons/commodities/gems/gem-faceted-trillion-orange.webp' },
      { name: 'Ruby', description: 'Transparent clear red to deep crimsom', img: 'icons/commodities/gems/gem-faceted-radiant-red.webp' },
    ]
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
