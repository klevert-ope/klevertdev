<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { editorContent, QuillEditor, wordCountBody } from "./store";

  const updateWordCount = () => {
    if (QuillEditor !== null && $QuillEditor !== undefined) {
      const text = $QuillEditor.getText();
      const words = text.trim().split(/\s+/);
      wordCountBody.set(words.length);
    }
  };

  onMount(() => {
    if (QuillEditor !== null && QuillEditor !== undefined) {
      // @ts-ignore
      QuillEditor.set(new Quill("#editorBody", {
        theme: "snow",
        placeholder: "Write your post...",
        modules: {
          toolbar: [
            [{ "header": [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ "list": "ordered" }, { "list": "bullet" }, { "list": "check" }],
            [{ "align": [] }],
            [{ "indent": "-1" }, { "indent": "+1" }],
            [{ "color": [] }, { "background": [] }],
            [{ "script": "sub" }, { "script": "super" }],
            ["link", "image", "video", "formula"],
            ["clean"]
          ]
        }
      }));
    }

    if (QuillEditor !== null && QuillEditor !== undefined) {
      $QuillEditor.on("text-change", () => {
        const delta = $QuillEditor.getContents();
        const deltaJson = JSON.stringify(delta, null, 4);
        editorContent.set(deltaJson);
        updateWordCount();
      });
    }
  });

  onDestroy(() => {
    if ($QuillEditor !== null && $QuillEditor !== undefined) {
      $QuillEditor.off("text-change");
    }
  });
</script>

<div bind:this={$QuillEditor} id="editorBody"></div>
<p class="font-xs flex-end">{$wordCountBody}/1500 Words</p>
