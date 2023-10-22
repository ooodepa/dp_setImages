import fs from 'fs';

import env from './env';
import getFilesTree from './utils/getFilesTree';
import FetchItems from './utils/rest/api/v1/items/FetchItems';
import GetItemDto from './utils/rest/api/v1/items/dto/get-item.dto';
import IFileTreeNode from './utils/getFilesTree/dto/i-file-tree-node';
import FetchItemBrands from './utils/rest/api/v1/item-brands/FetchItemBrands';
import FetchItemCategories from './utils/rest/api/v1/item-categories/FetchItemCategories';

async function main() {
  let items: GetItemDto[] = [];
  for (let i = 0; i < env.backend__brandUrls.length; i++) {
    const jItems = (
      await FetchItems.get({ brand: env.backend__brandUrls[i] })
    ).sort((a, b) => a.dp_model.localeCompare(b.dp_model));
    items = [...items, ...jItems];
  }

  const categories = await FetchItemCategories.get();
  const brands = await FetchItemBrands.get();

  const tree = getFilesTree('D:\\_Pavel_Halanin\\images\\items');

  const arrItems = [];
  for (let i = 0; i < items.length; ++i) {
    const jIt = items[i];
    for (let j = 0; j < categories.length; ++j) {
      const jCat = categories[j];
      if (jIt.dp_itemCategoryId === jCat.dp_id) {
        for (let k = 0; k < brands.length; ++k) {
          const jBr = brands[k];
          if (jBr.dp_id === jCat.dp_itemBrandId) {
            let ch = jIt.dp_itemCharacteristics;
            ch = ch.filter(e => e.dp_characteristicId !== 23);

            let galery: string[] = [];

            const arr = tree.content;

            const brandFolder = jBr.dp_urlSegment;

            let arrBrandFiles: IFileTreeNode[] = [];
            for (let ii = 0; ii < arr.length; ++ii) {
              if (arr[ii].name === brandFolder) {
                arrBrandFiles = arr[ii].content;
                break;
              }
            }

            const categoryFolder = jCat.dp_urlSegment
              .replace('mg-', '')
              .replace('-series', '');

            let arrCategoryFiles: IFileTreeNode[] = [];
            for (let ii = 0; ii < arrBrandFiles.length; ++ii) {
              if (arrBrandFiles[ii].name === categoryFolder) {
                arrCategoryFiles = arrBrandFiles[ii].content;
                break;
              }
            }

            const modelFolder = jIt.dp_model;

            for (let ii = 0; ii < arrCategoryFiles.length; ++ii) {
              if (arrCategoryFiles[ii].name === modelFolder) {
                const files = arrCategoryFiles[ii].content.map(e => e.name);

                const picturesArr = [];
                const drawPicturesArr = [];
                for (let jj = 0; jj < files.length; ++jj) {
                  if (`${files[jj]}`.startsWith('draw__')) {
                    drawPicturesArr.push(files[jj]);
                    continue;
                  }

                  picturesArr.push(files[jj]);
                }

                galery = [...picturesArr, ...drawPicturesArr]
                  .filter(e => /\.(png|jpg|jpeg|webp)$/.test(e))
                  .map(
                    e =>
                      `https://ooodepa.github.io/images/items/${brandFolder}/${categoryFolder}/${modelFolder}/${e}`,
                  );
              }
            }

            if (galery.length > 0) {
              ch.push({
                dp_id: 0,
                dp_itemId: jIt.dp_id,
                dp_characteristicId: 23,
                dp_value: `https://github.com/ooodepa/images/tree/main/items/${brandFolder}/${categoryFolder}`,
              });
            }

            ch = ch.sort(
              (a, b) => a.dp_characteristicId - b.dp_characteristicId,
            );

            arrItems.push({
              ...jIt,
              dp_photoUrl: galery[0] ? galery[0] : '',
              dp_itemGalery: galery.slice(1).map(e => {
                return {
                  dp_id: 0,
                  dp_itemId: jIt.dp_id,
                  dp_photoUrl: e,
                };
              }),
              dp_itemCharacteristics: ch,
            });

            break;
          }
        }

        break;
      }
    }
  }

  const number = 400;
  let temp = arrItems;
  for (let i = 0; temp.length !== 0; ++i) {
    const saveThis = temp.slice(0, number);
    await fs.promises.writeFile(
      `result-${i}.json`,
      JSON.stringify(saveThis, null, 2),
    );
    temp = temp.slice(number);
    console.log(temp.length);
  }
}

main();
