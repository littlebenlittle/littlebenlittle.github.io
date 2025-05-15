import * as pug from "pug"
import * as sass from "sass"
import * as yaml from "yaml"
import * as fs from "fs"
import * as prettier from "prettier"
import {argv, exit, stderr, stdout} from 'process'

const parse_arg = (arg: string) => {
    for (const v of argv) {
        const match = new RegExp(`--${arg}=(.+)`).exec(v)
        if (match) {
            return match[1]
        }
    }
    stderr.write(`Missing --${arg}=?`)
    exit(1)
}

const CV_DATA_PATH = parse_arg("data")
const CV_TMPL_PATH = parse_arg("tmpl")
const CV_STYL_PATH = parse_arg("style")

const cv_yaml = fs.readFileSync(CV_DATA_PATH, "utf-8")
const cv = yaml.parse(cv_yaml)

const template = pug.compileFile(CV_TMPL_PATH)
const scss = sass.compile(CV_STYL_PATH)

const html = template({
    ...cv,
    css: scss.css,
    humanDate: (date: string) => (new Date(date)).toLocaleString([], {
        "month": "short",
        "year": "numeric",
    }),
})

prettier
    .format(html, {parser: "html"})
    .then(html_prettier => stdout.write(html_prettier))
