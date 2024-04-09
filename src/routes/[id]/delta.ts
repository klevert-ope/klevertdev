import DOMPurify from "dompurify";

let quillInstance: any = null;

export async function convertDeltaToHtml(delta: any): Promise<string> {
  if (typeof document === "undefined") {
    return "";
  }

  if (!quillInstance) {
    const Quill = await import("quill");
    quillInstance = new Quill.default(document.createElement("div"));
  }

  quillInstance.setContents(delta);
  const rawHtml = quillInstance.root.innerHTML;
  return DOMPurify.sanitize(rawHtml);
}
