export const THEME_CONFIG: App.Locals['config'] = {
  /** blog title */
  title: "斑猫",
  /** your name */
  author: "Maculosa",
  /** website description */
  desc: "Rediscory the beauty of typography",
  /** your deployed domain */
  website: "https://blog.banmao.cc",
  /** your locale */
  locale: "zh-cn",
  /** theme style */
  themeStyle: "light",
  /** your socials */
  socials: [
    {
      name: "github",
      href: "https://github.com/maculosa/blog.banmao.cc",
    },
    {
      name: "rss",
      href: "/atom.xml",
    },
    {
      name: "twitter",
      href: "https://twitter.com/maculosa",
    },
    {
      name: "mastodon",
      href: "https://github.com/moeyua/astro-theme-typography",
    }
  ],
  /** your header info */
  header: {
    twitter: "@maculosa",
  },
  /** your navigation links */
  navs: [
    {
      name: "Posts",
      href: "/posts/page/1",
    },
    {
      name: "Archive",
      href: "/archive",
    },
    {
      name: "Categories",
      href: "/categories"
    },
    {
      name: "About",
      href: "/about",
    },
  ],
  /** your category name mapping, which the `path` will be shown in the url */
  category_map: [
    { name: "Vue", path: "vue" },
    { name: "React", path: "react" },
    { name: "JavaScript", path: "javascript" },
    { name: "CSS", path: "css" },
    { name: "HTML", path: "html" },
    { name: "TypeScript", path: "typescript" },
    { name: "Node.js", path: "nodejs" },
    { name: "Git", path: "git" },
    { name: "Nginx", path: "nginx" },
    { name: "Linux", path: "linux" },
    { name: "Docker", path: "docker" },
    { name: "Go", path: "go" },
    { name: "MySQL", path: "mysql" },
    { name: "MongoDB", path: "mongodb" },
    { name: "Redis", path: "redis" },
    { name: "Elasticsearch", path: "elasticsearch" },
    { name: "Rust", path: "rust" },
    { name: "有酒有肉", path: "life" },
    { name: "杂谈", path: "talk" },
    { name: "资源分享", path: "share" },
    { name: "工具推荐", path: "tool" },
    { name: "读书笔记", path: "book" },
    { name: "教程", path: "tutorial" },
    { name: "算法", path: "algorithm" },
  ],
  /** your comment provider */
  comments: {
    disqus: {
      shortname: "typography-astro",
    },
    // giscus: {
    //   repo: 'moeyua/astro-theme-typography',
    //   repoId: 'R_kgDOKy9HOQ',
    //   category: 'General',
    //   categoryId: 'DIC_kwDOKy9HOc4CegmW',
    //   mapping: 'title',
    //   strict: '0',
    //   reactionsEnabled: '1',
    //   emitMetadata: '1',
    //   inputPosition: 'top',
    //   theme: 'light',
    //   lang: 'zh-CN',
    //   loading: 'lazy',
    // },
    // twikoo: {
    //   envId: "https://twikoo-tau-flame.vercel.app",
    // }
  }
}

