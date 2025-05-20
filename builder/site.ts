import * as fs from "fs";
import * as path from "path";
import * as pug from "pug";
import fm from "front-matter";
import * as prettier from "prettier";
import * as sass from "sass";
import markdownit from "markdown-it";

const md = markdownit();

type PageAttributes = {
    _template: string;
};

function compile_dir(dir: string) {
    const target_dir = path.join(
        "/run/dist/www",
        dir.substring("/run/site/".length)
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
        }
        compile_file(entry_path);
    }
}

function compile_file(source: string) {
    function prettier_write_file(content: string, parser: string, ext: string) {
        const target =
            "/run/dist/www/" +
            source.substring("/run/dist/".length, source.lastIndexOf(".")) +
            "." +
            ext;
        prettier
            .format(content, { parser })
            .then((result) => fs.writeFileSync(target, result));
    }
    function render(compile: (body: string, attributes: any) => string) {
        const file_content = fs.readFileSync(source, "utf8");
        var { body, attributes } = fm<PageAttributes>(file_content);
        const _inner_html = compile(body, attributes);
        const template = pug.compileFile(
            "/run/site/_templates/" + attributes._template
        );
        const html = template({ _inner_html, ...attributes });
        prettier_write_file(html, "html", "html");
    }
    const ext = path.extname(source);
    switch (ext) {
        case ".pug":
            render((body, attributes) => pug.compile(body)(attributes));
            // var { body, attributes } = parse_frontmatter(source);
            // const _inner_html = pug.compile(body)(attributes);
            // const template = pug.compileFile(
            //     "/run/site/_templates/" + attributes._template
            // );
            // const html = template({ _inner_html, ...attributes });
            // prettier_write_file(html, "html", "html");
            break;
        case ".md":
            render((body, attributes) => md.render(body, attributes));
            // var { body, attributes } = parse_frontmatter(source);
            // const _inner_html = markdownit().render(body);
            // const template = pug.compileFile("/run/site/_templates")
            break;
        case ".scss":
            const css = sass.compile(source).css;
            prettier_write_file(css, "css", "css");
            break;
        default:
            console.log("Unhandled file extension: " + source);
    }
}

compile_dir("/run/site");
