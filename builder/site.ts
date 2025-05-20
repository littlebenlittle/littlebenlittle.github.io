import * as fs from "fs";
import * as path from "path";
import * as pug from "pug";
import fm from "front-matter";
import * as prettier from "prettier";
import * as sass from "sass";
import markdownit from "markdown-it";
import * as yaml from "yaml";
import { ReadableStreamGenericReader } from "stream/web";

const md = markdownit();

type PageAttributes = {
    // The template file that will encapsulate the content
    // on this page.
    _template: string | undefined;
    // A map of files to compile and include as string values
    _compile: { [key: string]: string } | undefined;
    // A list additional yaml files to include as attributes
    _include: string[] | undefined;
    [key: string]: any;
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
        } else {
            compile_file(entry_path);
        }
    }
}

function compile_file(source: string) {
    console.log(source);
    function target_path(ext: string) {
        return (
            "/run/dist/www/" +
            source.substring("/run/dist/".length, source.lastIndexOf(".")) +
            ext
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

    function get_body_attr(): {
        body: string;
        attributes: PageAttributes;
    } {
        const file_content = fs.readFileSync(source, "utf8");
        var { body, attributes } = fm<PageAttributes>(file_content);
        console.log("1", attributes);
        if (attributes._compile) {
            for (const key in attributes._compile) {
                if (path.extname(attributes._compile[key]) == ".scss") {
                    attributes[key] = sass.compile(
                        "/run/site/" + attributes._compile[key]
                    ).css;
                } else {
                    console.log("unsupported ext: " + attributes._compile[key]);
                }
            }
        }
        console.log("2", attributes);
        if (attributes._includes) {
            console.log("contains _includes directive");
            for (const p of attributes._includes) {
                const f = "/run/site/" + p;
                console.log("loading attributes from " + f);
                const extra_attr = yaml.parse(fs.readFileSync(f, "utf8"));
                attributes = { ...attributes, ...extra_attr };
            }
        }
        console.log("3", attributes);
        return { body, attributes };
    }

    function render(compile: (body: string, attributes: any) => string) {
        const { body, attributes } = get_body_attr();
        const _inner_html = compile(body, attributes);
        var html;
        if (attributes._template) {
            const template = pug.compileFile(
                "/run/site/_templates/" + attributes._template
            );
            html = template({ _inner_html, ...attributes });
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

compile_dir("/run/site");
