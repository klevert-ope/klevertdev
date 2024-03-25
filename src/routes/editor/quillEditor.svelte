<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { editorContent } from "./editorContentStore";

  let QuillEditor: any;
  let wordCount = 0;

  const updateWordCount = () => {
    if (QuillEditor) {
      const text = QuillEditor.getText();
      const words = text.trim().split(/\s+/);
      wordCount = words.length;
    }
  };

  onMount(() => {
    // @ts-ignore
    QuillEditor = new Quill("#editorBody", {
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
    });

    if (QuillEditor) {
      QuillEditor.on("text-change", () => {
        const delta = QuillEditor.getContents();
        const deltaJson = JSON.stringify(delta, null, 4);
        editorContent.set(deltaJson);
        updateWordCount();
      });

    }
  });

  onDestroy(() => {
    if (QuillEditor) {
      QuillEditor.off("text-change");
    }
  });
</script>

<div bind:this={QuillEditor} id="editorBody"></div>
<p class="font-xs flex-end">{wordCount}/1500 Words</p>
