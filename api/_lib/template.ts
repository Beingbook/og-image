import { readFileSync } from "fs";
import { marked } from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
import path from "path";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const pretendardFontPath = "./node_modules/pretendard/dist/web/static/woff2";

const pretendardFontRegular = readFileSync(
  path.resolve(pretendardFontPath, "./Pretendard-Regular.woff2")
).toString("base64");

const pretendardFontMedium = readFileSync(
  path.resolve(pretendardFontPath, "./Pretendard-Medium.woff2")
).toString("base64");

const pretendardFontSemiBold = readFileSync(
  path.resolve(pretendardFontPath, "./Pretendard-SemiBold.woff2")
).toString("base64");

const pretendardFontBold = readFileSync(
  path.resolve(pretendardFontPath, "./Pretendard-Bold.woff2")
).toString("base64");

const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  "base64"
);

function getCss(theme: string, fontSize: string) {
  let background = "white";
  let foreground = "black";
  let radial = "lightgray";

  if (theme === "dark") {
    background = "black";
    foreground = "white";
    radial = "dimgray";
  }
  return `
  @font-face {
      font-family: 'Pretendard';
      font-style:  normal;
      font-weight: normal;
      src: url(data:font/woff2;charset=utf-8;base64,${pretendardFontRegular}) format('woff2');
  }

    @font-face {
        font-family: 'Pretendard';
        font-style:  normal;
        font-weight: 500;
        src: url(data:font/woff2;charset=utf-8;base64,${pretendardFontMedium}) format('woff2');
    }

    @font-face {
        font-family: 'Pretendard';
        font-style:  normal;
        font-weight: 600;
        src: url(data:font/woff2;charset=utf-8;base64,${pretendardFontSemiBold}) format('woff2');
    }

    @font-face {
        font-family: 'Pretendard';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${pretendardFontBold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        background: ${background};
        background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
        height: 100vh;
        padding-inline: 8rem;
        font-family: 'Pretendard', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize } = parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      ${getCss(theme, fontSize)}
    </style>
    <body>
      <div>
        ${emojify(md ? marked(text) : sanitizeHtml(text))}
      </div>
    </body>
</html>`;
}

// function getImage(src: string, width = "auto", height = "225") {
//   return `<img
//         class="logo"
//         alt="Generated Image"
//         src="${sanitizeHtml(src)}"
//         width="${sanitizeHtml(width)}"
//         height="${sanitizeHtml(height)}"
//     />`;
// }

// function getPlusSign(i: number) {
//   return i === 0 ? "" : '<div class="plus">+</div>';
// }
