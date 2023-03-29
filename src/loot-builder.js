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
      { name: 'Lesser ruby', description: 'Transparent clear red to deep crimsom gem of low quality', img: 'icons/commodities/gems/gem-faceted-navette-red.webp' },
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
      { name: 'Lesser diamond', description: 'Transparent blue-white, canary, pink, brown or blue gem of low quality', img: 'icons/commodities/gems/gem-fragments-blue.webp' },
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
      { name: 'Great black onyx', description: 'Opaque pure black gem', img: 'icons/commodities/gems/gem-rough-tapered-purple.webp' },
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
      { name: 'Agate', description: 'Transparent multicolored gem', img: 'icons/commodities/gems/pearl-water.webp' },
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
      { name: 'Gold dust', description: 'Bowl containing gold dust', weight: 0.4, img: 'icons/commodities/materials/bowl-powder-gold.webp' },
      { name: 'Divination bones', description: 'Set of specially marked bones, used for divination magic', weight: 0.2, img: 'icons/commodities/bones/bones-stack-worn-brown.webp' },
      { name: 'Silver rod', description: 'Small silver rod', weight: 0.2, img: 'icons/weapons/wands/wand-gem-violet.webp' },
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
      { name: 'Carved silver bar', description: 'Onately carved bar of silver', weight: 0.3, img: 'icons/commodities/metal/clasp-steel-braid-glowing.webp' },
      { name: 'Jeweled horn', description: 'Jeweled horn for hearing', weight: 0.1, img: 'icons/commodities/treasure/horn-carved-banded.webp' },
      { name: 'Glass eye', description: 'Glass eye', weight: 0.1, img: 'icons/commodities/biological/eye-lizard-orange.webp' },
      { name: 'Runesticks', description: 'Set of ivory carved runesticks, used for divination magic', weight: 0.2, img: 'icons/commodities/treasure/token-engraved-symbols-grey.webp' },
      { name: 'Miniature sword', description: 'Miniature platinum sword with a grip and pommel of copper and zinc', weight: 0.2, img: 'icons/weapons/swords/shortsword-guard-green.webp' },
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
      { name: 'Rare unguents', description: 'Rare unguents', weight: 0.2, img: 'icons/consumables/potions/potion-flask-corked-labeled-pink.webp' },
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
      { name: 'Gem encrusted bowl', description: 'Gem encrusted bowl', weight: 0.2, img: 'icons/containers/kitchenware/goblet-jeweled-gold-purple.webp' },
      { name: 'Jade circlet', description: 'Gold circlet set with multiple jades', weight: 0.3, img: 'icons/equipment/neck/choker-rounded-gold-green.webp' },
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

  static trinkets = {
    table: 'RandomTrinkets',
    existingItems: [
      // Check dnd5e items AND tradegoods
      'Bell',
      'Salt'
    ],
    items : [
      { name: 'Charcoal', description: 'Chunk of charcoal', weight: 1, price: 1, coinType: 'sp', img: 'icons/commodities/stone/ore-pile-iron-black.webp' },
      { name: 'Herbs', description: 'Various herbs used for crafting, alchemy and magic.', weight: 0.2, price: 1, coinType: 'gp', img: 'icons/commodities/flowers/buds-red-green.webp' },
      { name: 'Trophy from a fallen enemy', description: 'A trophy taken from a fallen enemy (a dagger, broken blade, or piece of a banner)', weight: 0.5, price: 1, coinType: 'sp', img: 'icons/commodities/metal/fragments-sword-steel.webp' },
      { name: 'Bone dust', description: 'Small amount of bone dust', weight: 0.1, price: 1, coinType: 'cp', img: 'icons/commodities/materials/powder-grey.webp' },
      { name: 'Iron filings', description: 'Small amount of powdered iron and iron filings', weight: 0.2, price: 2, coinType: 'cp', img: 'icons/commodities/materials/powder-black.webp' },
      { name: 'Oak bark', description: 'Handful of oak bark, good for magic and infusions', weight: 0.1, price: 3, coinType: 'cp', img: 'icons/commodities/wood/bark-beige.webp' },
      { name: 'Strip of cloth', description: 'Strip of white cloth. Can be used for magic or as an improvised bandage', weight: 0.1, price: 1, coinType: 'cp', img: 'icons/sundries/scrolls/scroll-worn-rolled-beige.webp' },
      { name: 'Silver wire', description: 'Piece of fine silver wire', weight: 0.01, price: 1, coinType: 'sp', img: 'icons/commodities/metal/chain-silver.webp' },
      { name: 'Lump of alum', description: 'Lump of alum, useful for dyeing clothes', weight: 0.1, price: 3, coinType: 'cp', img: 'icons/consumables/drinks/coconut-fruit-milk.webp' },
      { name: 'Vinegar', description: 'Bottle of vinegar, great for healthy salads', weight: 0.2, price: 1, coinType: 'sp', img: 'icons/consumables/drinks/alcohol-spirits-bottle-green.webp' },
      { name: 'Honey', description: 'Some honey. Be careful, it may attract bears', weight: 0.2, price: 1, coinType: 'gp', img: 'icons/containers/kitchenware/jug-wrapped-red.webp' },
      { name: 'Animal fur', description: 'Scraps of animal fur', weight: 0.1, price: 5, coinType: 'cp', img: 'icons/commodities/leather/fur-brown-gold.webp' },
      { name: 'Bird eggs', description: 'Eggs from some bird, probably tasty', weight: 0.1, price: 1, coinType: 'sp', img: 'icons/consumables/eggs/egg-cracked-white.webp' },
      { name: 'Snakeskin gloves', description: 'Pair of snakeskin gloves', weight: 0.2, price: 1, coinType: 'gp', img: 'icons/equipment/hand/glove-frayed-cloth-white.webp' },
      { name: 'Glass rod', description: 'Glass rod', weight: 0.2, price: 1, coinType: 'ep', img: 'icons/weapons/wands/wand-gem-purple.webp' },
      { name: 'Silver pin', description: 'Silver pin', weight: 0.1, price: 1, coinType: 'ep', img: 'icons/commodities/metal/pin-cottar-steel.webp' },
      { name: 'Glass totem', description: 'Glass totem', weight: 0.1, price: 2, coinType: 'sp', img: 'icons/environment/creatures/gargoyle-grey-blue.webp' },
      { name: 'Powder', description: 'Measure of powder, do not place it near the fire', weight: 0.2, price: 1, coinType: 'gp', img: 'icons/containers/ammunition/powder-horn-leather.webp' },
      { name: 'Glass vial', description: 'Empty glass vial', weight: 0.1, price: 1, coinType: 'ep', img: 'icons/consumables/potions/vial-cork-empty.webp' },
      { name: 'Soot', description: 'Small amount of soot, can help to light a fire', weight: 0.1, price: 1, coinType: 'cp', img: 'icons/commodities/materials/bowl-powder-grey.webp' },
      { name: 'Wallnuts', description: 'Handful of wallnuts', weight: 0.1, price: 3, coinType: 'cp', img: 'icons/consumables/nuts/walnut-shelled-glowing-brown.webp' },
      { name: 'Lump of clay', description: 'Lump of soft clay', weight: 0.2, price: 2, coinType: 'cp', img: 'icons/commodities/stone/boulder-tan.webp' },
      { name: 'Sulfur', description: 'Small amount of sulfur', weight: 0.1, price: 1, coinType: 'gp', img: 'icons/commodities/materials/bowl-powder-yellow.webp' },
      { name: 'Holly berries', description: 'Bunch of holly berries', weight: 0.1, price: 5, coinType: 'cp', img: 'icons/commodities/flowers/holly-buds-red.webp' },
      { name: 'Clay pot', description: 'Clay pot', weight: 0.5, price: 1, coinType: 'sp', img: 'icons/containers/kitchenware/vase-clay-pot-decorated-red.webp' },
      { name: 'Glowworm', description: 'Glowworm, barely emits any light', weight: 0.1, price: 1, coinType: 'sp', img: 'icons/environment/creatures/bug-worm-glow.webp' },
      { name: 'Lump of phosphorus', description: 'Lump of phosphorus, highly flammable', weight: 0.1, price: 1, coinType: 'ep', img: 'icons/commodities/materials/slime-thick-green.webp' },
      { name: 'Carrot', description: 'Carrot, a horse would love it', weight: 0.1, price: 1, coinType: 'cp', img: 'icons/consumables/vegetable/root-carrot-orange.webp' },
      { name: 'Dried guano', description: 'Dried guano from bats or sea birds', weight: 0.1, price: 1, coinType: 'ep', img: 'icons/commodities/biological/shell-worn-beige.webp' },
      { name: 'Tree leaves', description: 'Handful of tree leaves', weight: 0.1, price: 1, coinType: 'cp', img: 'icons/consumables/plants/leaf-herb-green.webp' },
      { name: 'Lodestone', description: 'Lodestone, attracts iron', weight: 0.2, price: 1, coinType: 'sp', img: 'icons/commodities/stone/geode-raw-black.webp' },
      { name: 'Powdered silver', description: 'Powdered silver', weight: 0.1, price: 2, coinType: 'sp', img: 'icons/commodities/treasure/token-silver-blue.webp' },
      { name: 'Bird feather', description: 'Feather from a bird', weight: 0.05, price: 2, coinType: 'sp', img: 'icons/commodities/materials/feather-white.webp' },
      { name: 'Tentacle', description: 'Tentacle from a giant octopus or giant squid', weight: 0.2, price: 1, coinType: 'sp', img: 'icons/commodities/biological/tentacle-pink.webp' },
      { name: 'Vodka', description: 'Bottle of vodka', weight: 0.5, price: 3, coinType: 'gp', img: 'icons/consumables/drinks/alcohol-jar-spirits-gray.webp' },
      { name: 'Rum', description: 'Bottle of rum', weight: 0.5, price: 3, coinType: 'gp', img: 'icons/consumables/drinks/alcohol-jug-spirits-brown.webp' },
      { name: 'Beef tallow', description: 'Tallow from beef', weight: 0.1, price: 1, coinType: 'cp', img: 'icons/consumables/food/candy-taffy-yellow.webp' },
      { name: 'Brimstone', description: 'Lump of brimstone, basically sulfur', weight: 0.1, price: 1, coinType: 'ep', img: 'icons/commodities/stone/ore-chunk-yellow-brown.webp' },
      { name: 'Strap of leather', description: 'Strap of leather', weight: 0.1, price: 3, coinType: 'cp', img: 'icons/commodities/leather/leather-scraps-tan.webp' },
      { name: 'Glass bead', description: 'Small bead made of glass', weight: 0.1, price: 1, coinType: 'cp', img: 'icons/commodities/materials/glass-cube.webp' },
      { name: 'Mistletoe', description: 'Sprig of mistletoe', weight: 0.1, price: 1, coinType: 'sp', img: 'icons/commodities/flowers/blooms-pink.webp' },
      { name: 'Beans', description: 'Handfull of beans, enough for a full day when cooked', weight: 0.1, price: 1, coinType: 'cp', img: 'icons/consumables/vegetable/lima-beans-pod-brown.webp' },
      { name: 'Licorice root', description: 'Licorice root', weight: 0.1, price: 1, coinType: 'sp', img: 'icons/consumables/vegetable/root-brown-orange.webp' },
      { name: 'Petrified eye', description: 'Petrified eye of a newt', weight: 0.1, price: 3, coinType: 'sp', img: 'icons/commodities/biological/eye-purple.webp' },
      { name: 'Sugar', description: 'Sugar, really sweet', weight: 0.1, price: 1, coinType: 'sp', img: 'icons/containers/bags/sack-simple-green.webp' },
      { name: 'Gum arabic', description: 'Lumps of gum arabic', weight: 0.1, price: 1, coinType: 'ep', img: 'icons/commodities/stone/clay-orange.webp' },
      { name: 'Dried grasshopper', description: 'Dried grasshopper', weight: 0.01, price: 1, coinType: 'cp', img: 'icons/environment/creatures/bug-ant-red.webp' },
      { name: 'Firefly in a jar', description: 'Firefly trapped in a jar', weight: 0.1, price: 1, coinType: 'cp', img: 'icons/environment/creatures/bug-beetle-gold-green.webp' },
      { name: 'Honeycomb', description: 'Chunk of honeycomb', weight: 0.1, price: 3, coinType: 'cp', img: 'icons/commodities/biological/shell-gold.webp' },
      { name: 'Copper wire', description: 'Copper wire, about 3 feet long', weight: 0.1, price: 1, coinType: 'sp', img: 'icons/commodities/tech/wire-spool-thick.webp' },
      { name: 'Fleece pendant', description: 'Decorative pendant made of fleece', weight: 0.1, price: 1, coinType: 'sp', img: 'icons/commodities/materials/hair-tuft-white.webp' },
      { name: 'Moonseed berries', description: 'Moonseed berries', weight: 0.1, price: 1, coinType: 'sp', img: 'icons/commodities/flowers/buds-black-red.webp' },
      { name: 'Feldspar', description: 'Lump of feldspar', weight: 0.1, price: 1, coinType: 'sp', img: 'icons/commodities/stone/paver-cobble-grey.webp' },
      { name: 'Silver whistle', description: 'Tiny silver whistle', weight: 0.1, price: 8, coinType: 'sp', img: 'icons/tools/instruments/pipe-flue-tan.webp' },
      { name: 'Silver spoon', description: 'Tiny silver spoon', weight: 0.1, price: 5, coinType: 'gp', img: 'icons/tools/cooking/soup-ladle.webp' },
      { name: 'Polished marble', description: 'Chunk of polished marble', weight: 0.2, price: 5, coinType: 'gp', img: 'icons/commodities/stone/paver-cobble-white.webp' },
      { name: 'Bag of seeds', description: 'Bag with an assortment of various seeds', weight: 0.1, price: 1, coinType: 'sp', img: 'icons/containers/bags/sack-leather-brown-green.webp' },
      { name: 'Insect cocoon', description: 'Cocoon from an insect', weight: 0.1, price: 1, coinType: 'cp', img: 'icons/environment/creatures/bug-flea-beige.webp' },
      { name: 'Lump of talc', description: 'Lump of talc', weight: 0.1, price: 1, coinType: 'gp', img: 'icons/commodities/stone/stone-pile-grey.webp' },
      { name: 'Mica', description: 'Chunk of mica', weight: 0.2, price: 1, coinType: 'sp', img: 'icons/commodities/stone/paver-tile-grey.webp' },
      { name: 'Dried rose', description: 'Dried rose', weight: 0.1, price: 1, coinType: 'cp', img: 'icons/commodities/flowers/clover-red.webp' },
      { name: 'Molasses', description: 'Molasses', weight: 0.1, price: 1, coinType: 'gp', img: 'icons/consumables/drinks/wine-amphora-clay-red.webp' },
      { name: 'Magnifying glass', description: 'Magnifying glass', weight: 0.1, price: 1, coinType: 'gp', img: 'icons/tools/scribal/magnifying-glass.webp' },
      { name: 'Bitumen', description: 'Small pot of bitumen', weight: 0.1, price: 1, coinType: 'sp', img: 'icons/tools/laboratory/bowl-liquid-black.webp' },
      { name: 'Sunstone', description: 'Small chunk of sunstone', weight: 0.1, price: 1, coinType: 'sp', img: 'icons/commodities/stone/stone-nugget-gold.webp' },
      { name: 'Vial of mercury', description: 'Vial of mercury', weight: 0.1, price: 1, coinType: 'gp', img: 'icons/consumables/potions/vial-cork-blue.webp' },
      { name: 'Chalk', description: 'Lump of chalk, can be used for writing', weight: 0.1, price: 1, coinType: 'sp', img: 'icons/commodities/stone/ore-chunk-white.webp' },
      { name: 'Block of granite', description: 'Small block of granite', weight: 1, price: 1, coinType: 'sp', img: 'icons/commodities/stone/masonry-block-cube-pink-white.webp' },
      { name: 'Kindling', description: 'Assortement of twigs, thorny branches and dried leaves and grass', weight: 0.1, price: 1, coinType: 'cp', img: 'icons/commodities/wood/kindling-sticks-yellow.webp' },
    ]
  };

  static async generateItems(cleanFirst = false) {
    const treasuresPack = Module.COMPENDIUMS.TREASURES.nameInWorld;
    const trinketsPack = Module.COMPENDIUMS.TRINKETS.nameInWorld;
    const treasures = this.treasureTables.reduce((acc, group) => [...acc, ...group.items.map(i => this.#prepareTreasure(i, group.valueInGp))], []);
    const trinkets = this.trinkets.items.map(i => this.#prepareItem(i));

    await this.#createCompendiums(Module.COMPENDIUM_LIST, cleanFirst);

    let treasuresToGenerate = [];
    let trinketsToGenerate = [];
    if (cleanFirst) {
      treasuresToGenerate = treasures;
      trinketsToGenerate = trinkets;
    } else {
      const treasuresFound = await Promise.all(treasures.map(i => Utils.getItem(i)));
      const trinketsFound = await Promise.all(trinkets.map(i => Utils.getItem(i)));
      treasuresToGenerate = treasures.filter((_v, index) => !treasuresFound[index]);
      trinketsToGenerate = trinkets.filter((_v, index) => !trinketsFound[index]);
    }
    
    if (treasuresToGenerate.length) {
      Module.debug(false, 'Generating treasures: ', treasuresToGenerate);    
      await Item.createDocuments(treasuresToGenerate, { pack: treasuresPack });
    }
    if (trinketsToGenerate.length) {
      Module.debug(false, 'Generating trinkets: ', trinketsToGenerate);    
      await Item.createDocuments(trinketsToGenerate, { pack: trinketsPack });
    }
    if (treasuresToGenerate.length || trinketsToGenerate.length) {
      await this.#generateTables();
    }
  }

  static async #generateTables() {
    const treasuresPack = Module.COMPENDIUMS.TREASURES.nameInWorld;
    const trinketsPack = Module.COMPENDIUMS.TRINKETS.nameInWorld;
    const tablesPack = Module.COMPENDIUMS.LOOT_TABLES.nameInWorld;

    const treasures = game.packs.get(treasuresPack).map(i => ({ name: i.name, id: i._id, img: i.img, price: i.system.price.value }));
    const trinkets = game.packs.get(trinketsPack).map(i => ({ name: i.name, id: i._id, img: i.img }));

    const tablesForTreasures = this.treasureTables.map(({ valueInGp }) => {
      const results = treasures.filter(t => t.price === valueInGp).map((t, i) => this.#generateTableResult(t, i, treasuresPack));
      // TODO: Add results from existing packs.
      return this.#generateTableData(results, `Treasures_${valueInGp}gp`, 'A random treasure generation table.', 'icons/containers/chest/chest-reinforced-steel-green.webp');
    });
    const trinketResults = trinkets.map((t, i) => this.#generateTableResult(t, i, trinketsPack));
    // TODO: Add results from existing packs.
    const tableForTrinkets = this.#generateTableData(trinketResults, this.trinkets.table, 'A random trinket generation table.', 'icons/containers/chest/chest-reinforced-steel-brown.webp');

    const tables = [...tablesForTreasures, tableForTrinkets].filter(Boolean);

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

  static #prepareTreasure(itemData, price) {
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

  static #generateTableResult(item, index, pack) {
    return {
      text: item.name,
      type: CONST.TABLE_RESULT_TYPES.COMPENDIUM,
      collection: 'Item',
      documentCollection: pack,
      resultId: item.id,
      img: item.img,
      weight: 1,
      range: [index+1, index+1],
      drawn: false
    };
  }

  static #generateTableData(results, name, description, img) {
    return results.length ? {
      name,
      description,
      results,
      img,
      formula: `1d${results.length}`
    } : null;
  }
}
