// utils/block-factory.ts

import {BaseBlock, Block, ContentListBlock, EventBlock} from "./mobile-pages.model";
import {randomUUID} from "node:crypto";

export class BlockFactory {

  static create(type: string): Block {
    const baseId = randomUUID();

    switch (type) {
      case 'text':
        return {
          _id: baseId,
          type: 'text',
          text: "Un texte"
        }
      case 'image':
        return {
          _id: baseId,
          type: 'image'
        }

      case 'event':
        return {
          _id: baseId,
          type: 'event',
          title: 'Nouvel événement',
          content: {
            _id: randomUUID()
          }
        } as EventBlock;

      case 'content-list':
        return {
          _id: baseId,
          type: 'content-list',
          title: 'Nouvelle liste de contenus',
          subTitle: '',
          contents: [
            { _id: randomUUID(), title: 'Élément 1', description: '' }
          ]
        } as ContentListBlock;

      // Fallback de sécurité
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }
}


export const blockTemplates: Record<string, any> = {
  'text': {
    label: "Texte",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80"
  },
  'image': {
    label: "Image",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80"
  },
  'event': {
    label: 'Événement',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80'
  },
  'content-list': {
    label: 'Liste horizontale',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=80'
  }
}
