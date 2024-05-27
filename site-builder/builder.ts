import * as path from 'path'
import * as fs from 'fs'
import * as process from 'process'

import * as handlebars from 'handlebars'
import markdownit from 'markdown-it'
import fm from 'front-matter'
import * as sass from 'sass'
import { Command } from 'commander'
import * as uuid from 'uuid'
import * as yaml from 'yaml'
import * as cheerio from 'cheerio'
import hljs from 'highlight.js/lib/core'
import rust from 'highlight.js/lib/languages/rust';
import go from 'highlight.js/lib/languages/go';
import ts from 'highlight.js/lib/languages/typescript';

interface Site {
    files: string[],
    pageSources: PageSource[],
    regularPageSources: PageSource[],
    blogPostSources: BlogPostSource[],
    globals: Globals,
}

interface Globals {
    recentPosts: BlogPostSourceMetadata[]
    allPosts: BlogPostSourceMetadata[]
    templates: {
        [_: string]: handlebars.TemplateDelegate<any>
    }
}

interface PageSourceMetadata {
    id: string,
    template: string,
    link: string,
    [_: string]: unknown,
}

interface BlogPostSourceMetadata extends PageSourceMetadata {
    date: string,
}

interface PageSource {
    file: string,
    body: string,
    attributes: PageSourceMetadata,
}

interface BlogPostSource extends PageSource {
    attributes: BlogPostSourceMetadata,
}

interface Config {
    blogTemplate: string,
}

function index(dir: string, files: string[]) {
    console.log(`indexing files in ${dir}`)
    for (const entry of fs.readdirSync(dir)) {
        if (entry.startsWith("_")) {
            console.log(`skipping ${entry} due to leading underscore`)
            continue
        }
        const entrypath = path.join(dir, entry)
        const stat = fs.statSync(entrypath)
        if (stat.isDirectory()) {
            index(entrypath, files)
        } else if (stat.isFile()) {
            files.push(entrypath)
        } else {
            console.log(`skipping ${entrypath}; not a direcotry or regular file`)
        }
    }
}

function registerTemplates(dir: string, templates: { [_: string]: handlebars.TemplateDelegate }) {
    console.log(`indexing templates in ${dir}`)
    for (const entry of fs.readdirSync(dir)) {
        const entrypath = path.join(dir, entry)
        const stat = fs.statSync(entrypath)
        if (stat.isFile()) {
            const data = fs.readFileSync(entrypath, "utf8")
            templates[entry] = handlebars.compile(data)
        } else {
            console.log(`skipping ${entrypath}; not a regular file`)
        }
    }
}

function registerPartials(dir: string) {
    for (const entry of fs.readdirSync(dir)) {
        const name = path.basename(entry).split(".")[0]
        const data = fs.readFileSync(path.join(dir, entry), 'utf8')
        const template = handlebars.compile(data)
        handlebars.registerPartial(name, template)
    }
}

function outpath(
    srcdir: string,
    file: string,
    builddir: string,
    ext: string
): string {
    const outdir = path.dirname(path.join(
        builddir,
        path.relative(srcdir, file)
    ))
    if (!fs.existsSync(outdir)) fs.mkdirSync(outdir, { recursive: true })
    return path.join(outdir, `${path.basename(file).split(".")[0]}.${ext}`)
}

function loadPageSource<T extends PageSourceMetadata>(file: string, srcdir: string): PageSource {
    const data = fs.readFileSync(file, "utf8")
    const result = fm<T>(data)
    const { body, attributes } = result
    return { file, body, attributes }
}

function compilePageSource(src: PageSource, globals: Globals): string {
    const view = { globals, ...src.attributes }
    const md = handlebars.compile(src.body)(view)
    const content = markdownit().render(md)
    const $ = cheerio.load(content)
    $('code.language-rs').each((i, el) => {
        const code = $(el).text()
        const hl = hljs.highlight(code, { language: 'rust' })
        $(el).html(hl.value)
    })
    $('code.language-go').each((i, el) => {
        const code = $(el).text()
        const hl = hljs.highlight(code, { language: 'go' })
        $(el).html(hl.value)
    })
    $('code.language-ts').each((i, el) => {
        const code = $(el).text()
        const hl = hljs.highlight(code, { language: 'ts' })
        $(el).html(hl.value)
    })
    const template = globals.templates[src.attributes.template]
    if (!template) throw `no template ${src.attributes.template}`
    const html = template({ content: $.html(), ...view })
    return html
}

function indexSources(srcdir: string): Site {
    const templatesdir = path.join(srcdir, "_templates")

    var files: string[] = []
    index(srcdir, files)
    var templates: { [_: string]: handlebars.TemplateDelegate } = {}
    registerTemplates(templatesdir, templates)
    registerPartials(path.join(templatesdir, "partials"))

    const markdownFiles = files
        .filter((file) => path.extname(file) == '.md')

    const regularPageSources: PageSource[] = markdownFiles
        .filter((file) =>
            path.basename(file) == 'index.md'
            || path.basename(path.dirname(file)) != 'blog'
        )
        .map((file) => {
            const src = loadPageSource<PageSourceMetadata>(file, srcdir)
            src.attributes.link = `/${path.relative(srcdir, file).split(".")[0]}.html`
            return src
        })

    const blogPostSources: BlogPostSource[] = files
        .filter((file) =>
            path.basename(path.dirname(file)) == 'blog'
            && path.basename(file) != 'index.md'
        )
        .map((file) => {
            const src = loadPageSource<BlogPostSourceMetadata>(file, srcdir)
            src.attributes.link = `/blog/${src.attributes.id}.html`
            return src as BlogPostSource
        })

    const pageSources = [regularPageSources, blogPostSources].flat()

    const globals: Globals = {
        recentPosts: blogPostSources
            .map((src) => src.attributes)
            .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
            .slice(0, 3),
        allPosts: blogPostSources
            .map((src) => src.attributes)
            .sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
        templates,
    }

    return { files, pageSources, regularPageSources, blogPostSources, globals }
}

function build(srcdir: string, builddir: string) {
    const { files, pageSources, regularPageSources, blogPostSources, globals } = indexSources(srcdir)
    handlebars.registerHelper("page", (id, field) => {
        const page = pageSources.find(({ attributes }) => attributes.id == id)
        if (!page) throw `no page with id "${id}"`
        const val = page.attributes[field]
        if (!val) throw `no such field "${field} on page "${id}"`
        return page.attributes[field]
    })

    handlebars.registerHelper("humanDate", (date) => {
        const d = new Date(date)
        return d.toDateString()
    })

    for (const src of regularPageSources) {
        console.log(`compiling ${src.file}`)
        const html = compilePageSource(src, globals)
        const out = outpath(srcdir, src.file, builddir, 'html')
        fs.writeFileSync(out, html)
    }

    for (const src of blogPostSources) {
        console.log(`compiling ${src.file}`)
        const html = compilePageSource(src, globals)
        const out = path.join(builddir, 'blog', `${src.attributes.id}.html`)
        fs.writeFileSync(out, html)
    }

    files
        .filter((file) => path.extname(file) == '.scss')
        .forEach((file) => {
            const css = sass.compile(file).css
            const out = outpath(srcdir, file, builddir, 'css')
            fs.writeFileSync(out, css)
        })

    files
        .filter((file) => {
            switch (path.extname(file)) {
                case ".md":
                case ".scss":
                    return false
                default:
                    return true
            }
        }).forEach((file) => {
            const out = path.join(builddir, path.relative(srcdir, file))
            const dir = path.dirname(out)
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
            fs.copyFileSync(file, out)
        })
}

function main() {
    hljs.registerLanguage('rust', rust)
    hljs.registerLanguage('go', go)
    hljs.registerLanguage('ts', ts)

    const program = new Command()
    program
        .name("site-builder")
        .description("static site generator")

    program.command("build")
        .description("build the site")
        .argument("[root]", "root directory for site content", "./site")
        .argument("[build]", "directory to build site into", "./build")
        .option("-c, --clean", "remove all files in build dir before build", true)
        .action((root, buildDir, options) => {
            if (options.clean) {
                if (fs.existsSync(buildDir)) {
                    if (fs.statSync(buildDir).isDirectory()) {
                        for (const entry of fs.readdirSync(buildDir)) {
                            fs.rmSync(path.join(buildDir, entry), { recursive: true, force: true })
                        }
                    } else {
                        throw `not a directory: ${buildDir}`
                    }
                } else {
                    fs.mkdirSync(buildDir)
                }
            }
            build(root, buildDir)
        })

    program.command("new")
        .description("format metadata for a new post")
        .argument("[root]", "root directory for site content", "./site")
        .option("-t, --title [title]", "post title", "My Latest Post")
        .option("-c, --config [path]", "relative path to config from <root>", "./_config.yaml")
        .action((root, options: {config: string, title: string}) => {
            const configPath = path.join(root, options.config)
            const config =
                yaml.parse(fs.readFileSync(configPath, 'utf8')) as Config
            const metadata = {
                id: uuid.v4(),
                title: options.title,
                date: new Date(Date.now()).toISOString(),
                template: config.blogTemplate,
            }
            const filePath = path.join(root, "blog", `${options.title.replaceAll(" ", "-")}.md`)
            fs.writeFileSync(filePath, `---\n${yaml.stringify(metadata)}---\n`)
        })

    program.command("compile")
        .description("compile a source file")
        .argument("[root]", "path to site root")
        .argument("[src]", "path to source file")
        .action((root, src, options) => {
            const pageSource = loadPageSource(src, root)
            const site = indexSources(root)
            const html = compilePageSource(pageSource, site.globals)
            console.log(html)
        })
    if (process.argv.length < 3) {
        program.help()
    } else {
        program.parse(process.argv)
    }
}

main()
