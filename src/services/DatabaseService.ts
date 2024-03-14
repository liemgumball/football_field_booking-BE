import { connect, connection } from 'mongoose';
import EnvVars from '@src/constants/EnvVars';

/**
 * ping the database
 * @returns connection status
 */
export function ping() {
  const connectionStatus = ['disconnected', 'connected', 'connecting'];
  return connectionStatus[connection.readyState];
}

export default {
  connect: () => connect(EnvVars.Database.uri),
  ping,
};
