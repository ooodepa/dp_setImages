import fs from 'fs';
import PATH from 'path';

import IFileTreeNode from './dto/i-file-tree-node';

export default function getFilesTree(path: string) {
  if (fs.statSync(path).isDirectory()) {
    const result: IFileTreeNode = {
      name: `${path.split('\\').pop()}`,
      type: 'dir',
      content: fs.readdirSync(path).map(e => {
        return getFilesTree(PATH.join(path, e));
      }),
    };
    return result;
  } else {
    const result: IFileTreeNode = {
      name: `${path.split('\\').pop()}`,
      type: 'file',
      content: [],
    };
    return result;
  }
}
