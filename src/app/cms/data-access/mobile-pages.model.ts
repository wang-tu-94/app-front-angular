export interface MobilePageFilter {
  name?: string;
  state?: State;
  afterPublishedDate?: number;
  ids?: string[];
}

export interface MobilePage {
  id?: string;
  state?: State;
  name?: string;
  updatedDate?: number;
  publishedDate?: number;
  blocks?: Block[];
  email?: string;
}

export interface BaseBlock {
  title?: string;
  description?: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  text?: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  imageId?: string;
  imageUrl?: string;
}

export interface EventBlock extends BaseBlock {
  type: 'event';
  subTitle?: string;
  content?: Content;
}

export interface ContentListBlock extends BaseBlock {
  type: 'content-list';
  subTitle?: string;
  contents?: Content[];
}

export interface Content {
  title?: string;
  description?: string;
  imageId?: string;
}

export type Block = TextBlock | ImageBlock | EventBlock | ContentListBlock;
export type State = "ONLINE" | "OFFLINE" | "DELETED"

export const stateOptions = [
  { label: 'En ligne', value: 'ONLINE' },
  { label: 'Hors ligne', value: 'OFFLINE' },
  { label: 'Supprimé', value: 'DELETED' }
];
