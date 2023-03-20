import './typedefs.js';

/**
 * Base module class, with all the utility methods to share across modules
 * @Class
 */
export class BaseModule {
  static ID = 'base-module';

  static DEBUG_LEVELS = {
    NONE: 0,
    ERROR: 1,
    WARN: 2,
    LOG: 3,
    DEBUG: 4,
  }
  static debugLevel = this.DEBUG_LEVELS.ERROR;

  static debug(force, ...args) {  
    if (force || this.debugLevel >= this.DEBUG_LEVELS.DEBUG) {
      console.log(this.ID, '| [DEBUG]', ...args);
    }
  }

  static log(force, ...args) {  
    if (force || this.debugLevel >= this.DEBUG_LEVELS.LOG) {
      console.log(this.ID, '|', ...args);
    }
  }

  static logWarn(force, ...args) {  
    if (force || this.debugLevel >= this.DEBUG_LEVELS.WARN) {
      console.warn(this.ID, '|', ...args);
    }
  }

  static logError(force, ...args) {  
    if (force || this.debugLevel >= this.DEBUG_LEVELS.ERROR) {
      console.error(this.ID, '|', ...args);
    }
  }

  static info(msg) {
    ui.notifications.info(`${this.ID} | ${msg}`);
  }

  static warn(msg) {
    ui.notifications.warn(`${this.ID} | ${msg}`);
  }

  static error(msg) {
    ui.notifications.error(`${this.ID} | ${msg}`);
  }

  static getConfig(key) {
    return game.settings.get(this.ID, key);
  }
  
  static initialize() {
    this._setupSetting(this.SETTINGS.DEBUG, {
      type: Number, default: this.debugLevel, range: { min: 0, max: 4 },
      onChange: (value) => this.debugLevel = value,
    });

    this.debugLevel = this.getConfig(this.SETTINGS.DEBUG);
  }

  static _setupSetting(key, config) {
    const defaultSetting = {
      name: `${this.ID}.settings.${key}.name`,
      scope: 'world',
      config: true,
      hint: `${this.ID}.settings.${key}.hint`
    };

    game.settings.register(this.ID, key, { ...defaultSetting, ...config });
  }
}