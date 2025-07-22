import * as fs from "fs";
import * as path from "path";
import * as pug from "pug";
import fm from "front-matter";
import * as prettier from "prettier";
import * as sass from "sass";
import markdownit, { Token } from "markdown-it";
import markdownit_anchor from "markdown-it-anchor";
import highlightjs from "markdown-it-highlightjs";
import * as yaml from "yaml";
import * as process from "process";

const SITE_DIR = process.env["SITE_DIR"] || "";
const DIST_DIR = process.env["DIST_DIR"] || "";

if (!SITE_DIR || !DIST_DIR) {
    console.log("Please set: SITE_DIR DIST_DIR BLOG_DIR");
    process.exit(1);
}

const BLOG_DIR = path.join(SITE_DIR, "blog");

const md = markdownit()
    .use(markdownit_anchor)
    .use(highlightjs, { auto: false });

md.core.ruler.push("external-links", (state) => {
    for (const t of state.tokens) {
        check_external_link(t);
    }
});

function check_external_link(t: Token) {
    if (t.children != null) {
        for (const c of t.children) {
            check_external_link(c);
        }
    } else if (t.type === "link_open") {
        const href = t.attrGet("href");
        if (href == null) {
            return;
        }
        if (
            !href.startsWith("https://benlittle.dev") &&
            (href.startsWith("http://") || href.startsWith("https://"))
        ) {
            t.attrJoin("class", "external");
            t.attrJoin("target", "_blank");
        }
    }
}

md.renderer.rules.text = (tokens, index) => {
    var text = tokens[index].content;
    return text.replaceAll(/--/g, "&#151;");
};

const _global = {
    release: process.argv.includes("--release"),
    blog_entries: fs
        .readdirSync(BLOG_DIR)
        .filter((e) => !e.match(/index\..*/))
        .map((e) => {
            const { body, attributes } = get_body_attr(path.join(BLOG_DIR, e));
            return {
                title: attributes.title,
                published: attributes.published,
                link:
                    "/blog/" +
                    e.slice(0, e.length - path.extname(e).length) +
                    ".html",
            } as BlogEntry;
        })
        .sort(
            (a, b) =>
                new Date(b.published).valueOf() -
                new Date(a.published).valueOf()
        ),
};

type BlogEntry = {
    title: string;
    published: string;
    link: string;
};

type PageAttributes = {
    // The template file that will encapsulate the content
    // on this page.
    _template: string | undefined;
    // A map of files to compile and include as string values
    _compile: { [key: string]: string } | undefined;
    // A list additional yaml files to include as attributes
    _include: string[] | undefined;
    // Global values
    _global: {
        blog_entries: [BlogEntry];
        release: boolean;
    };
    // Additional attributes
    [key: string]: any;
};

function compile_dir(dir: string) {
    const target_dir = path.join(
        DIST_DIR,
        "www",
        dir.substring(SITE_DIR.length)
    );
    if (!fs.existsSync(target_dir)) {
        fs.mkdirSync(target_dir);
    }
    for (const entry of fs.readdirSync(dir)) {
        if (entry.startsWith("_")) {
            continue;
        }
        const entry_path = path.join(dir, entry);
        if (fs.statSync(entry_path).isDirectory()) {
            compile_dir(entry_path);
        } else {
            compile_file(entry_path);
        }
    }
}

function get_body_attr(source: string): {
    body: string;
    attributes: PageAttributes;
} {
    const file_content = fs.readFileSync(source, "utf8");
    var { body, attributes } = fm<PageAttributes>(file_content);
    if (attributes._compile) {
        for (const key in attributes._compile) {
            if (path.extname(attributes._compile[key]) == ".scss") {
                attributes[key] = sass.compile(
                    SITE_DIR + attributes._compile[key]
                ).css;
            } else {
                console.log("unsupported ext: " + attributes._compile[key]);
            }
        }
    }
    if (attributes._includes) {
        console.log("contains _includes directive");
        for (const p of attributes._includes) {
            const f = SITE_DIR + p;
            console.log("loading attributes from " + f);
            const extra_attr = yaml.parse(fs.readFileSync(f, "utf8"));
            attributes = { ...attributes, ...extra_attr };
        }
    }
    return { body, attributes };
}

function humanDate(s: string) {
    const d = new Date(s);
    const day = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ][d.getDay()];
    const month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "Novemver",
        "December",
    ][d.getMonth()];
    return `${day}, ${d.getDate()} ${month} ${d.getFullYear()}`;
}

function compile_file(source: string) {
    console.log(source);

    function target_path(ext: string) {
        return path.join(
            DIST_DIR,
            "www",
            source.substring(DIST_DIR.length, source.lastIndexOf(".")) + ext
        );
    }

    function prettier_write_file(
        content: string,
        target: string,
        parser: string
    ) {
        prettier
            .format(content, { parser })
            .then((result) => fs.writeFileSync(target, result));
    }

    function render(compile: (body: string, attributes: any) => string) {
        const { body, attributes } = get_body_attr(source);
        const _inner_html = compile(body, {
            ...attributes,
            _global,
            humanDate,
        });
        var html;
        if (attributes._template) {
            const template = pug.compileFile(
                path.join(SITE_DIR, "_templates", attributes._template)
            );
            html = template({
                _inner_html,
                ...attributes,
                _global,
                humanDate,
            });
        } else {
            html = _inner_html;
        }
        prettier_write_file(html, target_path(".html"), "html");
    }

    const ext = path.extname(source);
    switch (ext) {
        case ".pug":
            render((body, attributes) =>
                pug.compile(body, { filename: source })(attributes)
            );
            break;
        case ".md":
            render((body, attributes) => md.render(body, attributes));
            break;
        case ".scss":
            const css = sass.compile(source).css;
            prettier_write_file(css, target_path(".css"), "css");
            break;
        default:
            fs.copyFileSync(source, target_path(ext));
    }
}

compile_dir(SITE_DIR);
