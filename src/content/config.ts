
import { defineCollection, z } from "astro:content";

const postSchema = ({ image }) => z.object({
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.coerce.date(),
  customData: z.string().optional(),
  banner: image()
    .refine((img: { width: number; height: number }) => Math.max(img.width, img.height) <= 4096, {
      message: "Width and height of the banner must less than 4096 pixels"
    })
    .optional(),
  categories: z.array(z.string()),
  author: z.string().optional(),
  commentsUrl: z.string().optional(),
  source: z.optional(z.object({ url: z.string(), title: z.string(), })),
  enclosure: z.optional(z.object({ url: z.string(), length: z.number(), type: z.string(), })),
  draft: z.boolean().optional(),
});

const posts = defineCollection({
  type: 'content',
  schema: postSchema,
});

const go = defineCollection({
  type: 'content',
  schema: postSchema,
});

const gpui = defineCollection({
  type: 'content',
  schema: postSchema,
});

const raspberrypi = defineCollection({
  type: 'content',
  schema: postSchema,
});

export const collections = {
  posts,
  go,
  gpui,
  raspberrypi
};
