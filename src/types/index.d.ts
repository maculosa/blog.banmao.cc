/// <reference types="../../.astro/types" />
/// <reference types="astro" />

type Post = import('astro:content').CollectionEntry<'posts'> | import('astro:content').CollectionEntry<'go'> | import('astro:content').CollectionEntry<'gpui'> | import('astro:content').CollectionEntry<'raspberrypi'>

type Page = import("astro").Page<Post>

