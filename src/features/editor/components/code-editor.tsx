import { useEffect, useMemo, useRef } from "react";
import { oneDark } from "@codemirror/theme-one-dark";
import { indentWithTab } from "@codemirror/commands";
import { EditorView, keymap } from "@codemirror/view";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";

import { minimap } from "../extensions/minimap";
import { customTheme } from "../extensions/theme";
import { quickEdit } from "../extensions/quick-edit";
import { suggestion } from "../extensions/suggestion";
import { customSetup } from "../extensions/custom-setup";
import { selectionTooltip } from "../extensions/selection-tooltip";
import { getLanguageExtension } from "../extensions/language-extension";

interface Props {
  filename: string;
  initialValue?: string;
  onChange: (value: string) => void;
}

export const CodeEditor = ({
  filename,
  initialValue = "",
  onChange,
}: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const languageExtension = useMemo(
    () => getLanguageExtension(filename),
    [filename],
  );

  useEffect(() => {
    if (!editorRef.current) return;
    const view = new EditorView({
      doc: initialValue,
      parent: editorRef.current,
      extensions: [
        oneDark,
        customTheme,
        customSetup,
        languageExtension,
        quickEdit(filename), // TODO: adjust the prompt; enable function 10h
        suggestion(filename),
        selectionTooltip(),
        keymap.of([indentWithTab]),
        minimap(),
        indentationMarkers(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial value is only used for initial document
  }, [languageExtension]);

  return <div ref={editorRef} className="size-full pl-4 bg-background" />;
};
