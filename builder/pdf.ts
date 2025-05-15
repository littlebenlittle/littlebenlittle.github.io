import puppeteer from 'puppeteer'
import * as fs from 'fs'
import { argv, exit, stdout } from 'process'

if (argv.length < 3) {
    stdout.write("Need at least 1 arg, 'cv' and/or 'card'\n")
    exit(1)
}

puppeteer.launch().then(async browser => {
    for (const target of argv.slice(2)) {
        stdout.write(`compiling ${target}\n`)
        const page = await browser.newPage()

        const html = fs.readFileSync(`dist/www/${target}.html`, "utf8")

        await page.setContent(html, { waitUntil: 'networkidle0' })
        await page.pdf({
            path: `dist/www/${target}.pdf`,
            format: 'a4',
            margin: {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
            },
            printBackground: true,
        })
    }

    await browser.close()
})
