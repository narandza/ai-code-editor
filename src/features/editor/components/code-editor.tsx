import { useEffect, useMemo, useRef } from "react";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { customTheme } from "../extensions/theme";
import { getLanguageExtension } from "../extensions/language-extension";
import { indent, indentWithTab } from "@codemirror/commands";

interface Props {
  filename: string;
}

export const CodeEditor = ({ filename }: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const languageExtension = useMemo(
    () => getLanguageExtension(filename),
    [filename],
  );

  useEffect(() => {
    if (!editorRef.current) return;
    const view = new EditorView({
      doc: `const Counter = () => {
      const [value, setValue] = useState(0);
      
      const onIncrease = setValue((value) => value =1)};
      
      return (
      <div className="">
        <button onClick={onIncrease} className="">
        {value}
        </button>
      </div>
      )
      `,
      parent: editorRef.current,
      extensions: [
        customTheme,
        oneDark,
        basicSetup,
        languageExtension,
        keymap.of([indentWithTab]),
      ],
    });

    viewRef.current = view;
    return () => {
      view.destroy();
    };
  }, []);

  return <div ref={editorRef} className="size-full pl-4 bg-background" />;
};
