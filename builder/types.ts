import {TemplateDelegate as HandlebarsTemplate} from 'handlebars'

export interface Page {
  html: string,
  // path where content will be writtien, relative to build directory
  outpath: string,
}

export interface PageSource {
  metadata: PageSourceMetadata,
  // the body of the file, used as handlebars template
  body: string,
  template: HandlebarsTemplate<PageView>,
  relPath: string[],
}

export interface PageSourceMetadata {
  id: string,
  template: string,
  [_: string]: unknown,
}

export interface PageView {
  content: string,
  link: string,
}

export interface BlogPostSource extends PageSource {
  metadata: BlogPostMetadata,
}

export interface BlogPostMetadata extends PageSourceMetadata {
  date: Date,
}

export interface Globals {
  recentPosts: BlogPostMetadata[],
  url: string,
}

export interface SiteBuilder {
  globals: Globals,
  renderPage: (src: PageSource) => void
}
