import ItemCharacteristicDto from './item-characteristic.dto';
import ItemGaleryDto from './item-galery.dto';
import ItemDto from './item.dto';

interface ItemCharacteristicWithIdDto extends ItemCharacteristicDto {
  dp_id: number;
  dp_itemId: string;
}

interface ItemGaleryWithIdDto extends ItemGaleryDto {
  dp_id: number;
  dp_itemId: string;
}

export default interface ItemWithIdDto extends ItemDto {
  dp_id: string;
  dp_itemCharacteristics: ItemCharacteristicWithIdDto[];
  dp_itemGalery: ItemGaleryWithIdDto[];
}
