<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { editorContent, form, QuillEditor, wordCountBody } from "./store";

  let Quill;

  $: form.data.body = $editorContent;

  const updateWordCount = () => {
    if ($QuillEditor) {
      let text: string = $QuillEditor.getText().trim();
      const words: string[] = text.split(/\s+/).filter(word => word.trim() !== "");
      wordCountBody.set(words.length);
    }
  };

  function checkBodyEmpty() {
    if (QuillEditor) {
      const text = $QuillEditor.getText().trim();
      const isEmpty = text.length === 0 || !text.replace(/\s/g, "").length;
      if (isEmpty) {
        editorContent.set("");
      }
    }
  }

  onMount(async () => {
    if (typeof window !== "undefined") {
      Quill = (await import("quill")).default;

      if (QuillEditor !== null && QuillEditor !== undefined) {
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
          checkBodyEmpty();
        });
      }
    }
  });

  afterUpdate(() => {
    const textarea = document.querySelector("textarea[name=\"body\"]") as HTMLTextAreaElement;
    if (textarea) {
      editorContent.subscribe(content => {
        textarea.value = content;
      });
    }
  });

  onDestroy(() => {
    if ($QuillEditor !== null && $QuillEditor !== undefined) {
      $QuillEditor.off("text-change");
    }
  });
</script>

<label class="padding-top font-sm"
       for="editorBody">
  BODY
</label>
<textarea hidden id="body" name="body"></textarea>
<div bind:this={$QuillEditor} id="editorBody"></div>
<p class="font-xs flex-end">{$wordCountBody}/10000 Words</p>

<style>
	#editorBody {
		border: 1px solid var(--white-black);
		background: white;
		}
	.font-xs {
		font-size: calc(clamp(0.65rem, 0.6062rem + 0.1798vw, 0.75rem));
		}

	.padding-top {
		padding-top: 20px;
		}

	label {
		color: var(--orange-blue);
		}

	.flex-end {
		display: flex;
		justify-content: flex-end;
		}
</style>
