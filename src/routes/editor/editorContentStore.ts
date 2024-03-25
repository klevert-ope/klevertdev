import { writable } from "svelte/store";

export const editorContent = writable("");
let QuillEditor: any;

export function resetEditorContent() {
  if (QuillEditor) {
    editorContent.set("");
  }
}
