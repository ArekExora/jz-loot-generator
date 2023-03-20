import { JZLootGenerator as Module } from './jz-loot-generator.js';

/**
 * Exposes all the operations related to the sheets.
 * @Class
 * @deprecated
 */
export class NPCSheetHandler {
  static async displayCurrency(sheet, html, { actor, system }) {
    // As of now, only default template is supported.
    if (sheet.template !== 'systems/dnd5e/templates/actors/npc-sheet.hbs')
      return;

    const content = $(await this.#getTemplate(system));
    
    content.find('.rollable[data-action=convertCurrency]')
      .on('click', () => this.#convertCurrency(actor));

    html.find('.sheet-body .features .inventory-filters').prepend(content);
  }

  static async #convertCurrency(actor) {
    console.log('converting cu')
    return Dialog.confirm({
      title: `${game.i18n.localize('DND5E.CurrencyConvert')}`,
      content: `<p>${game.i18n.localize('DND5E.CurrencyConvertHint')}</p>`,
      yes: () => actor.convertCurrency(),
    });
  }

  static async #getTemplate(system) {
    const template = `modules/${Module.ID}/templates/npc-currency.hbs`;
    return renderTemplate(template, {
      system,
      labels: { 
        currencies: {
          pp: game.i18n.localize('DND5E.CurrencyPP'),
          gp: game.i18n.localize('DND5E.CurrencyGP'),
          ep: game.i18n.localize('DND5E.CurrencyEP'),
          sp: game.i18n.localize('DND5E.CurrencySP'),
          cp: game.i18n.localize('DND5E.CurrencyCP'),
        }
      },
    });
  }

}