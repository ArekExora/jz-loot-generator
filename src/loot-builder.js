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
      { name: 'Azurite', description: 'Opaque gem mottled deep blue', img: 'icons/commodities/gems/gem-cluster-blue-white.webp' },
      { name: 'Banded agate', description: 'Translucent gem striped brown, blue, white or red', img: 'icons/commodities/gems/gem-fragments-red.webp' },
      { name: 'Blue quartz', description: 'Transparent pale blue gem', img: 'icons/commodities/gems/gem-rough-pendeloque-blue.webp' },
      { name: 'Eye agate', description: 'Translucent gem with circles of gray, white, brown, blue or green', img: 'icons/commodities/gems/pearl-brown.webp' },
      { name: 'Hematite', description: 'Opaque gray-black gem', img: 'icons/commodities/gems/gem-rough-navette-blue.webp' },
      { name: 'Lapis lazuli', description: 'Opaque light and dark blue gem with yellow flecks', img: 'icons/commodities/gems/gem-rough-cushion-blue.webp' },
      { name: 'Malachite', description: 'Opaque striated light and dark green gem', img: 'icons/commodities/gems/gem-raw-rough-teal.webp' },
      { name: 'Moss agate', description: 'Translucent pink or yellow-white gem with mossy gray or green markings', img: 'icons/commodities/gems/gem-rough-tapered-green.webp' },
      { name: 'Obsidian', description: 'Opaque black gem', img: 'icons/commodities/gems/gem-rough-cushion-violet.webp' },
      { name: 'Rhodochrosite', description: 'Opaque light pink gem', img: 'icons/commodities/gems/gem-rough-navette-pink.webp' },
      { name: 'Tiger eye', description: 'Translucent brown gem with golden center', img: 'icons/commodities/gems/gem-rough-cushion-orange-red.webp' },
      { name: 'Turquoise', description: 'Opaque light blue-green gem', img: 'icons/commodities/gems/gem-rough-oval-teal.webp' },
    ]
  },{
    type: 'Gemstones',
    valueInGp: 50,
    items: [
      { name: 'Bloodstone', description: 'Opaque dark gray gem with red flecks', img: 'icons/commodities/gems/gem-rough-rose-red.webp' },
      { name: 'Carnelian', description: 'Opaque orange to red-brown gem', img: 'icons/commodities/gems/gem-rough-round-orange.webp' },
      { name: 'Chaldedony', description: 'Opaque white gem', img: 'icons/commodities/gems/pearl-white-oval.webp' },
      { name: 'Chrysoprase', description: 'Translucent green gem', img: 'icons/commodities/gems/gem-fragments-green.webp' },
      { name: 'Citrine', description: 'Transparent pale yellow-brown gem', img: 'icons/commodities/gems/gem-rough-pear-orange.webp' },
      { name: 'Jasper', description: 'Opaque blue, black or brown gem', img: 'icons/commodities/gems/gem-rough-cushion-purple.webp' },
      { name: 'Moonstone', description: 'Translucent white gem with pale blue glow', img: 'icons/commodities/gems/gem-rough-drop-blue.webp' },
      { name: 'Onyx', description: 'Opaque gem with bands of black and white, or pure black or white', img: 'icons/commodities/gems/powder-raw-white.webp' },
      { name: 'Quartz', description: 'Transparent white, smoky gray, or yellow gem', img: 'icons/commodities/gems/gem-rough-oval-white.webp' },
      { name: 'Sardonyx', description: 'Opaque gem with bands of red and white', img: 'icons/commodities/gems/gem-faceted-rough-red.webp' },
      { name: 'Star rose quartz', description: 'Translucent rosy stone gem with white star-shaped center', img: 'icons/commodities/gems/gem-rough-round-pink.webp' },
      { name: 'Zircon', description: 'Transparent pale blue-green gem', img: 'icons/commodities/gems/gem-fragments-turquoise.webp' },
    ]
  },{
    type: 'Gemstones',
    valueInGp: 100,
    items: [
      { name: 'Amber', description: 'Transparent watery gold to rich gold gem', img: 'icons/commodities/gems/gem-amber-insect-orange.webp' },
      { name: 'Amethyst', description: 'Transparent deep purple gem', img: 'icons/commodities/gems/gem-cut-faceted-princess-purple.webp' },
      { name: 'Chrysoberyl', description: 'Transparent yellow-green to pale green gem', img: 'icons/commodities/gems/gem-raw-rough-green-yellow.webp' },
      { name: 'Coral', description: 'Opaque crimsom gem', img: 'icons/commodities/gems/gem-rough-cushion-red.webp' },
      { name: 'Garnet', description: 'Transparent red, brown-green or violet gem', img: 'icons/commodities/gems/gem-rough-oval-purple.webp' },
      { name: 'Jade', description: 'Translucent light green, deep green or white gem', img: 'icons/commodities/gems/gem-rough-oval-green.webp' },
      { name: 'Jet', description: 'Opaque deep black gem', img: 'icons/commodities/gems/gem-rough-ball-purple.webp' },
      { name: 'Pearl', description: 'Opaque lustrous white, yellow or pink gem', img: 'icons/commodities/gems/pearl-rough-white.webp' },
      { name: 'Spinel', description: 'Transparent red, red-brown or deep green gem', img: 'icons/commodities/gems/gem-rough-square-red.webp' },
      { name: 'Tourmaline', description: 'Transparent pale green, blue, brown or red gem', img: 'icons/commodities/gems/pearl-rough-turquoise.webp' },
    ]
  },{
    type: 'Gemstones',
    valueInGp: 500,
    items: [
      { name: 'Alexandrite', description: 'Transparent dark green gem', img: 'icons/commodities/gems/gem-faceted-large-green.webp' },
      { name: 'Aquamarine', description: 'Transparent pale blue-green gem', img: 'icons/commodities/gems/gem-shattered-teal.webp' },
      { name: 'Black pearl', description: 'Opaque pure black gem', img: 'icons/commodities/gems/pearl-glass-purple.webp' },
      { name: 'Blue spinel', description: 'Transparent deep blue gem', img: 'icons/commodities/gems/gem-shattered-violet.webp' },
      { name: 'Peridot', description: 'Transparent rich olive green gem', img: 'icons/commodities/gems/gem-rough-brilliant-green.webp' },
      { name: 'Topaz', description: 'Transparent golden yellow gem', img: 'icons/commodities/gems/gem-rough-rectangular-red.webp' },
    ]
  },{
    type: 'Gemstones',
    valueInGp: 1000,
    items: [
      { name: 'Black opal', description: 'Translucent dark green gem with black mottling and golden flecks', img: 'icons/commodities/gems/gem-faceted-diamond-green.webp' },
      { name: 'Blue sapphire', description: 'Transparent blue-white to medium blue gem', img: 'icons/commodities/gems/gem-faceted-radiant-blue.webp' },
      { name: 'Emerald', description: 'Transparent deep bright green gem', img: 'icons/commodities/gems/gem-cut-table-green.webp' },
      { name: 'Fire opal', description: 'Translucent fiery red gem', img: 'icons/commodities/gems/gem-oval-red.webp' },
      { name: 'Opal', description: 'Translucent pale blue gem with green and golden mottling', img: 'icons/commodities/gems/gem-faceted-hexagon-blue.webp' },
      { name: 'Star ruby', description: 'Translucent ruby with white star-shaped center', img: 'icons/commodities/gems/pearl-fire-swirl.webp' },
      { name: 'Star sapphire', description: 'Translucent blue sapphire with white star-shaped center', img: 'icons/commodities/gems/pearl-swirl-blue.webp' },
      { name: 'Yellow sapphire', description: 'Transparent fiery yellow or yellow-green gem', img: 'icons/commodities/gems/gem-faceted-octagon-yellow.webp' },
    ]
  },{
    type: 'Gemstones',
    valueInGp: 5000,
    items: [
      { name: 'Black sapphire', description: 'Translucent lustrous black gem with glowing highlights', img: 'icons/commodities/gems/gem-faceted-round-black.webp' },
      { name: 'Diamond', description: 'Transparent blue-white, canary, pink, brown or blue gem', img: 'icons/commodities/gems/gem-faceted-round-white.webp' },
      { name: 'Jacinth', description: 'Transparent fiery orange gem', img: 'icons/commodities/gems/gem-faceted-trillion-orange.webp' },
      { name: 'Ruby', description: 'Transparent clear red to deep crimsom gem', img: 'icons/commodities/gems/gem-faceted-radiant-red.webp' },
    ]
  },{
    type: 'ArtObjects',
    valueInGp: 25,
    items: [
      { name: 'Silver ewer', description: 'Silver ewer', weight: 0.2, img: 'icons/containers/kitchenware/goblet-engraved-grey.webp' },
      { name: 'Carved bone statuette', description: 'Carved bone statuette', weight: 0.2, img: 'icons/commodities/treasure/figurine-goddess.webp' },
      { name: 'Small gold bracelet', description: 'Small gold bracelet', weight: 0.1, img: 'icons/equipment/wrist/bracer-orange-spiked-small.webp' },
      { name: 'Cloth-of-gold vestments', description: 'Cloth-of-gold vestments', weight: 0.1, img: 'icons/commodities/cloth/cloth-bolt-yellow.webp' },
      { name: 'Black velvet mask', description: 'Black velvet mask stitched with silver thread', weight: 0.1, img: 'icons/equipment/head/mask-carved-gargoyle-grey.webp' },
      { name: 'Copper chalice', description: 'Copper chalice with silver filigree', weight: 0.2, img: 'icons/containers/kitchenware/goblet-clay-engraved-spirals.webp' },
      { name: 'Engraved dice', description: 'Pair of engraved bone dice', weight: 0.1, img: 'icons/sundries/gaming/dice-runed-tan.webp' },
      { name: 'Small mirror', description: 'Small mirror set in a painted wooden frame', weight: 0.2, img: 'icons/sundries/survival/mirror-plain.webp' },
      { name: 'Silk hankerchief', description: 'Embroidered silk hankerchief', weight: 0.1, img: 'icons/commodities/cloth/cloth-bolt-glow-white.webp' },
      { name: 'Gold locket', description: 'Gold locket with a painted portrait inside', weight: 0.1, img: 'icons/equipment/neck/amulet-round-engraved-gold.webp' },
    ]
  },{
    type: 'ArtObjects',
    valueInGp: 250,
    items: [
      { name: 'Gold ring', description: 'Gold ring set with bloodstones', weight: 0.1, img: 'icons/equipment/finger/ring-band-thin-rounded-gold.webp' },
      { name: 'Carved ivory statuette', description: 'Carved ivory statuette', weight: 0.2, img: 'icons/commodities/treasure/figurine-idol.webp' },
      { name: 'Large gold bracelet', description: 'Large gold bracelet', weight: 0.2, img: 'icons/equipment/wrist/bracer-ornate-gold-purple.webp' },
      { name: 'Silver necklace', description: 'Silver necklace with a gemstone pendant', weight: 0.1, img: 'icons/equipment/neck/choker-chain-thick-silver.webp' },
      { name: 'Bronze crown', description: 'Bronze crown', weight: 0.3, img: 'icons/equipment/head/crown-gold-blue.webp' },
      { name: 'Silk robe', description: 'Silk robe with gold embroidery', weight: 0.3, img: 'icons/commodities/cloth/cloth-bolt-embroidered-pink.webp' },
      { name: 'Large tapestry', description: 'Large wellmade tapestry', weight: 1, img: 'icons/commodities/cloth/cloth-patterned-yellow-green.webp' },
      { name: 'Brass mug', description: 'Brass mug with jade inlay', weight: 0.4, img: 'icons/containers/kitchenware/goblet-simple-copper.webp' },
      { name: 'Box of figurines', description: 'Box of turquoise animal figurines', weight: 0.4, img: 'icons/containers/boxes/box-gift-white.webp' },
      { name: 'Gold bird cage', description: 'Gold bird cage with electrum filigree', weight: 0.3, img: 'icons/containers/boxes/box-gift-blue.webp' },
    ]
  },{
    type: 'ArtObjects',
    valueInGp: 750,
    items: [
      { name: 'Silver chalice', description: 'Silver chalice set with moonstones', weight: 0.3, img: 'icons/containers/kitchenware/goblet-jeweled-gold-white.webp' },
      { name: 'Silver-plated longsword', description: 'Silver-plated steel longsword with jet set in hilt', weight: 3, img: 'icons/weapons/swords/greatsword-guard-gem-blue.webp' },
      { name: 'Harp of exotic wood', description: 'Carved harp of exotic wood with ivory inlay and zircon gems', weight: 1, img: 'icons/tools/instruments/harp-lap-brown.webp' },
      { name: 'Small gold idol', description: 'Small gold idol', weight: 0.5, img: 'icons/commodities/treasure/mask-jeweled-gold.webp' },
      { name: 'Gold dragon comb', description: 'Gold dragon comb set with red garnets as eyes', weight: 0.1, img: 'icons/commodities/treasure/broach-gold-eye-green.webp' },
      { name: 'Bottle stopper cork', description: 'Bottle stopper cork embossed with gold leaf and set with amethysts', weight: 0.1, img: 'icons/containers/kitchenware/vase-clay-painted-blue-gold.webp' },
      { name: 'Ceremonial dagger', description: 'Ceremonial electrum dagger with a black pearl in the pommel', weight: 1, img: 'icons/weapons/daggers/dagger-jeweled-black.webp' },
      { name: 'Silver and gold brooch', description: 'Silver and gold brooch', weight: 0.2, img: 'icons/commodities/treasure/token-gold-gem-red.webp' },
      { name: 'Obsidian statuette', description: 'Obsidian statuette with gold fittings and inlay', weight: 0.5, img: 'icons/commodities/treasure/statuette-gargoyle-green-gold.webp' },
      { name: 'Painted gold war mask', description: 'Painted gold war mask', weight: 0.3, img: 'icons/equipment/head/mask-carved-scream-tan.webp' },
    ]
  },{
    type: 'ArtObjects',
    valueInGp: 2500,
    items: [
      { name: 'Fine gold chain', description: 'Fine gold chain set with a fire opal', weight: 0.3, img: 'icons/equipment/neck/choker-chain-thin-gold.webp' },
      { name: 'Old masterpiece painting', description: 'Old masterpiece painting', weight: 1, img: 'icons/tools/navigation/map-simple-tree.webp' },
      { name: 'Silk and velvet mantle', description: 'Embroidered silk and velvet mantle set with numerous moonstones', weight: 0.5, img: 'icons/commodities/cloth/cloth-bolt-gold-red.webp' },
      { name: 'Platinum bracelet', description: 'Platinum bracelet set with a sapphire', weight: 0.3, img: 'icons/equipment/wrist/bracer-ornate-black-silver.webp' },
      { name: 'Embroidered glove', description: 'Embroidered glove set with jewel chips', weight: 0.5, img: 'icons/equipment/hand/glove-leather-blue-gold.webp' },
      { name: 'Jeweled anklet', description: 'Jeweled anklet', weight: 0.3, img: 'icons/equipment/neck/collar-rounded-gold-pink.webp' },
      { name: 'Gold music box', description: 'Gold music box', weight: 1, img: 'icons/commodities/treasure/box-jade-tassel.webp' },
      { name: 'Gold circlet', description: 'Gold circlet set with four aquamarines', weight: 0.3, img: 'icons/equipment/neck/necklace-astrology-sun-gold.webp' },
      { name: 'Eye patch with a mock eye', description: 'Eye patch with a mock eye set in blue sapphire and moonstone', weight: 0.1, img: 'icons/commodities/biological/eye-blue.webp' },
      { name: 'Pink pearls necklace', description: 'A necklace string of small pink pearls', weight: 0.3, img: 'icons/equipment/neck/collar-rounded-red.webp' },
    ]
  },{
    type: 'ArtObjects',
    valueInGp: 7500,
    items: [
      { name: 'Jeweled gold crown', description: 'Jeweled gold crown', weight: 0.5, img: 'icons/commodities/treasure/crown-gold-satin-gems-red.webp' },
      { name: 'Jeweled platinum ring', description: 'Jeweled platinum ring', weight: 0.1, img: 'icons/equipment/finger/ring-faceted-gold-green.webp' },
      { name: 'Small gold stattuete', description: 'Small gold stattuete set with rubies', weight: 0.5, img: 'icons/commodities/treasure/crystal-pedastal-red-gold.webp' },
      { name: 'Gold cup', description: 'Gold cup set with emeralds', weight: 0.3, img: 'icons/containers/kitchenware/goblet-jeweled-engraved-red-gold.webp' },
      { name: 'Gold jewelry box', description: 'Gold jewelry box with platinum filigree', weight: 0.5, img: 'icons/containers/chest/chest-reinforced-steel-red.webp' },
      { name: 'Child\'s sarcophagus', description: 'Painted gold child\'s sarcophagus', weight: 2, img: 'icons/commodities/treasure/bust-pharaoh-gold-blue.webp' },
      { name: 'Jade gameboard', description: 'Jade gameboard with solid gold playing pieces', weight: 1, img: 'icons/sundries/gaming/chess-pawn-white-pink.webp' },
      { name: 'Ivory drinking horn', description: 'Bejeweled ivory drinking horn with gold filigree', weight: 0.5, img: 'icons/commodities/bones/horn-drinking-white.webp' },
    ]
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
        img: 'icons/containers/chest/chest-reinforced-steel-green.webp',
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

      if (pack && !cleanFirst)
        return;

      if (pack)
        Module.log(false, `Recreating compendium ${label}`);
      else
        Module.log(false, `Creating compendium ${label}`);

      await pack?.deleteCompendium();
      await CompendiumCollection.createCompendium({ label, name, type });
    }
  }

  static #prepare(itemData, price) {
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
