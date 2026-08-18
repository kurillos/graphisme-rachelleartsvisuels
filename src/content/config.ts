import { defineCollection, z } from 'astro:content';

const creations = defineCollection({
  type: 'content',
  schema: z.object({
    titre: z.string(),
    // Catégorie libre (texte) : les filtres de la galerie sont générés
    // automatiquement à partir des catégories réellement utilisées.
    // Ajouter une nouvelle catégorie ici (ou depuis Decap CMS) crée un
    // nouveau filtre sans toucher au code.
    categorie: z.string(),
    client: z.string().optional(),
    date: z.coerce.date(),
    // Chemin public de l'image (ex: /images/uploads/mon-visuel.jpg),
    // déposée via public/images (ou uploadée depuis Decap CMS).
    image: z.string(),
    imageAlt: z.string(),
    // Format utilisé pour ajuster le rendu masonry (portrait = plus haut)
    format: z.enum(['portrait', 'paysage', 'carre']).default('paysage'),
    miseEnAvant: z.boolean().default(false),
    // Galerie complémentaire (plusieurs photos pour une même création),
    // alimentée depuis Decap CMS : chaque upload devient un commit
    // GitHub, pas de backend à héberger.
    galerie: z
      .array(
        z.object({
          src: z.string(),
        })
      )
      .optional()
      .default([]),
    // Tags libres, en plus de la catégorie. Utilisés pour enrichir les
    // filtres de la galerie (voir GalerieFiltree.astro).
    tags: z.array(z.string()).optional().default([]),
  }),
});

export const collections = { creations };
