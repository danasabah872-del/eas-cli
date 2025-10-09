import { getAnalyticsEnabledAsync, setAnalyticsEnabledAsync } from '../analytics/AnalyticsManager';
import EasCommand from '../commandUtils/EasCommand';
import Log from '../log';

/**
 * A command to view or change analytics settings.
 */
export default class AnalyticsView extends EasCommand {
  /**
   * The description of the command.
   */
  static override description = 'display or change analytics settings';

  /**
   * The arguments for the command.
   */
  static override args = [{ name: 'STATUS', options: ['on', 'off'] }];

  /**
   * The main entry point for the command.
   */
  async runAsync(): Promise<void> {
    const { STATUS: status } = (await this.parse(AnalyticsView)).args;
    if (status) {
      await setAnalyticsEnabledAsync(status === 'on');
      Log.withTick(`${status === 'on' ? 'Enabling' : 'Disabling'} analytics.`);
    } else {
      const analyticsEnabled = await getAnalyticsEnabledAsync();
      Log.log(
        `Analytics are ${
          analyticsEnabled === false ? 'disabled' : 'enabled'
        } on this eas-cli installation.`
      );
    }
  }
}
