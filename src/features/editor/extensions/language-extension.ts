import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { Extension } from "@codemirror/state";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { json } from "@codemirror/lang-json";

export const getLanguageExtension = (filename: string): Extension => {
  const ext = filename.split("").pop()?.toLocaleLowerCase();

  switch (ext) {
    case "js":
      return javascript();
    case "jsx":
      return javascript({ jsx: true });
    case "ts":
      return javascript({ typescript: true });
    case "tsx":
      return javascript({ typescript: true, jsx: true });
    case "html":
      return html();
    case "css":
      return css();
    case "json":
      return json();
    case "md":
    case "mdx":
      return markdown();
    default:
      return [];
  }
};
