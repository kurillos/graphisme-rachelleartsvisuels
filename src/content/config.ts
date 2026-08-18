import { defineCollection, z } from 'astro:content';

const creations = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    titre: z.string(),
    // Catégories utilisées pour les filtres de la galerie
    categorie: z.enum(['faire-part', 'logo-graphisme', 'mise-en-page', 'site-web']),
    client: z.string().optional(),
    date: z.coerce.date(),
    image: image(),
    imageAlt: z.string(),
    // Format utilisé pour ajuster le rendu masonry (portrait = plus haut)
    format: z.enum(['portrait', 'paysage', 'carre']).default('paysage'),
    miseEnAvant: z.boolean().default(false),
  }),
});

export const collections = { creations };
