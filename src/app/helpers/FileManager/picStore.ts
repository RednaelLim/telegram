import { /*bytesToBase64, */blobConstruct, bytesToArrayBuffer } from './index';
import * as defaultPic from './usercolor1.png';

// const createBlobString = (data, mime) => `data:${mime};base64,${data}`

export class PicStore extends Map<number | string, string> {
  constructor() {
    super();
    this.set('default', defaultPic);
  }

  public addBlob = (id: number, blob: Blob) => {
    this.set(id, URL.createObjectURL(blob));
  }

  public addPic = (id: number, fileData: Iterable<number>, mime = 'image/jpeg') => {
    const blob = blobConstruct([bytesToArrayBuffer(fileData)], mime);
    // const based = bytesToBase64(fileData)
    // const res = createBlobString(based, mime)
    this.set(id, URL.createObjectURL(blob));
    return blob;
  }
}

const picStore = new PicStore();

export default picStore;
