import { StateField, StateEffect } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  keymap,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";

// State Effect: A way to send "messages" to update state.
// We define one effect type for setting the suggestion text.
const setSuggestionEffect = StateEffect.define<string | null>();

// State Field: Holds out suggestion state in the editor.
// - create(): Returns the initial value when the editor loads
// - update(): Called on every transaction (keystroke, etc.) to potentially update the value
const suggestionState = StateField.define<string | null>({
  create() {
    return null;
  },
  update(value, transaction) {
    // Check each effect in this transaction
    // If we find out setSuggestionEffect, return its new value
    // Otherwise, keep the current value unchanged
    for (const effect of transaction.effects) {
      if (effect.is(setSuggestionEffect)) {
        return effect.value;
      }
    }

    return value;
  },
});

// WidgetType: Creates custom DOM elements to display in the editor.
// toDOM() is called by CodeMirror to create the actual HTML element
class SuggestionWidget extends WidgetType {
  constructor(readonly text: string) {
    super();
  }

  toDOM() {
    const span = document.createElement("span");
    span.textContent = this.text;
    span.style.opacity = "0.4"; // Ghost text appearance
    span.style.pointerEvents = "none"; // Don't interfere with clicks
    return span;
  }
}

let debounceTimer: number | null = null;
let isWaitingForSuggestion = false;
const DEBOUNCE_DELAY = 300;

const generateFakeSuggestion = (textBeforeCursor: string): string | null => {
  const trimmed = textBeforeCursor.trimEnd();

  if (trimmed.endsWith("const")) return "Mock return";

  return null;
};

const createDebouncePlugin = (fileName: string) => {
  return ViewPlugin.fromClass(
    class {
      constructor(view: EditorView) {
        this.triggerSuggestion(view);
      }

      update(update: ViewUpdate) {
        if (update.docChanged || update.selectionSet) {
          this.triggerSuggestion(update.view);
        }
      }

      triggerSuggestion(view: EditorView) {
        if (debounceTimer !== null) {
          clearTimeout(debounceTimer);
        }

        isWaitingForSuggestion = true;

        debounceTimer = window.setTimeout(async () => {
          // Fake suggestion (delete this block later in stage 3)
          const cursor = view.state.selection.main.head;
          const line = view.state.doc.lineAt(cursor);
          const textBeforeCursor = line.text.slice(0, cursor - line.from);
          const suggestion = generateFakeSuggestion(textBeforeCursor);

          isWaitingForSuggestion = false;
          view.dispatch({ effects: setSuggestionEffect.of(suggestion) });
        }, DEBOUNCE_DELAY);
      }

      destroy() {
        if (debounceTimer !== null) {
          clearTimeout(debounceTimer);
        }
      }
    },
  );
};

const renderPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.build(view);
    }

    update(update: ViewUpdate) {
      // Rebuild decorations if doc changed, cursor moved, or suggestion changed
      const suggestionChanged = update.transactions.some((transaction) =>
        transaction.effects.some((effect) => effect.is(setSuggestionEffect)),
      );

      if (update.docChanged || update.selectionSet || suggestionChanged) {
        this.decorations = this.build(update.view);
      }
    }

    build(view: EditorView) {
      if (isWaitingForSuggestion) {
        return Decoration.none;
      }

      // Get current suggestion from state
      const suggestion = view.state.field(suggestionState);
      if (!suggestion) {
        return Decoration.none;
      }

      // Create a widget decoration at the cursor position
      const cursor = view.state.selection.main.head;

      return Decoration.set([
        Decoration.widget({
          widget: new SuggestionWidget(suggestion),
          side: 1, // Render after cursor(side: 1), not before(side: -1)
        }).range(cursor),
      ]);
    }
  },
  {
    decorations: (plugin) => plugin.decorations,
  },
);

const acceptSuggestionKeymap = keymap.of([
  {
    key: "Tab",
    run: (view) => {
      const suggestion = view.state.field(suggestionState);

      if (!suggestion) {
        return false; // No suggestion? Let Tan tp its normal thing
      }

      const cursor = view.state.selection.main.head;
      view.dispatch({
        changes: { from: cursor, insert: suggestion }, // Insert the suggestion text
        selection: { anchor: cursor + suggestion.length }, // Move cursor to end
        effects: setSuggestionEffect.of(null), // Clear the suggestion
      });

      return true; // We handled Tab, don't indent
    },
  },
]);

export const suggestion = (filename: string) => [
  suggestionState, // Out state storage
  createDebouncePlugin(filename), // Trigger suggestions on typing
  renderPlugin, // Renders the ghost text
  acceptSuggestionKeymap, // Tab to accept
];
