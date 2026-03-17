import {randomUUID} from "node:crypto";

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
}

export interface BaseBlock {
  _id: string;
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
  content: Content;
}

export interface ContentListBlock extends BaseBlock {
  type: 'content-list';
  subTitle?: string;
  contents: Content[];
}

export interface Content {
  _id: string;
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
export const BlockHydrators: Record<string, (block: any) => void> = {
  'event': (b) => {
    b.content ??= {};
    b.content._id ??= randomUUID();
  },

  'content-list': (b) => {
    b._id ??= randomUUID(); // ID transient du bloc
    b.contents ??= [];
    b.contents.forEach((c: any) => {
      c ??= {};
      c._id ??= randomUUID(); // ID transient du sous-contenu
    });
  }
};
