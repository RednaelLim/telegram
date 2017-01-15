import { ITelegramClient } from 'telegram-js';
import * as MTProto from '@goodmind/telegram-mt-node';
import * as TypeLanguage from '@goodmind/telegram-tl-node';

import apiConnect from './connection';
import { IMtpHelpNearestDc, IMtpHelpGetConfig } from '../../redux/mtproto';
import { rejectDashAndFuncs } from 'helpers/treeProcess';

let client: ITelegramClient;
const ready = apiConnect();
ready.then(value => { client = value; });
// NOTE Node connection function is deleted
// } else {
//   const os = require('os');
//   client = telegram.createClient();
//   ready = Promise.resolve({});
//   config.deviceModel = os.type();
//   config.systemVersion = os.platform() + '/' + os.release();
// }

export function isReady() {
  return ready;
}

function readyApiCall(...args: any[]) {
  return ready.then(client => client.callApi(...args));
}

export function makePasswordHash (salt, password) {
  const passwordUTF8 = decodeURIComponent(encodeURIComponent(password));
  let buffer: any = new ArrayBuffer(passwordUTF8.length);
  const byteView: any = new Uint8Array(buffer);
  const len = passwordUTF8.length;
  for (let i = 0; i < len; i++) {
    byteView[i] = passwordUTF8.charCodeAt(i);
  }

  buffer = Buffer.concat([Buffer.concat([salt, Buffer.from(byteView)]), salt]);

  return MTProto.utility.createSHAHash(buffer, 'sha256');
}

export function invoke<R>(...args: any[]): Promise<R> {
  return readyApiCall(...args)
    .then((r: any) => {
      if (typeof r !== 'boolean' && r.instanceOf('mtproto.type.Rpc_error')) {
        return Promise.reject(r);
      } else {
        return rejectDashAndFuncs(r);
      }
    })
    .catch(err => {
      console.error('Got networker error', err, err.stack);
      return Promise.reject(err);
    });
}

export const toPrintable =
  (type, ...args) => TypeLanguage.utility.toPrintable.bind(type)(...args);

let dialogsNum = 0;
export function generateDialogIndex(date) {
  console.log('dialogsNum', dialogsNum);
  if (date === undefined) {
    date = MTProto.time.getLocalTime();
  }
  return (date * 0x10000) + ((++dialogsNum) & 0xFFFF);
}

export function getDataCenters() {
  const tl = TypeLanguage;
  const promises = Promise.all([
    invoke<IMtpHelpGetConfig>('help.getConfig'),
    invoke<IMtpHelpNearestDc>('help.getNearestDc'),
  ]);
  return promises
    .then(([config, nearestDc]) => {
      const dcs = {
        current: `DC_${nearestDc.this_dc}`,
        nearestDc: `DC_${nearestDc.nearest_dc}`,
        toPrintable: tl.utility.toPrintable,
      };
      const dcList = config.dc_options.list;
      dcList.forEach(dc => {
        dcs[`DC_${dc.id}`] = {
          host: dc.ip_address,
          port: dc.port,
          toPrintable: tl.utility.toPrintable,
        };
      });
      return dcs;
    });
}

export { APP_ID, APP_HASH } from './config';
export { authKeyWithSaltToStorableBuffer } from './helpers';
export { client, MTProto, TypeLanguage }
