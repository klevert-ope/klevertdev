import DOMPurify from "dompurify";

let quillInstance: any = null;

function isClientSide() {
  return typeof window !== "undefined";
}

export async function convertDeltaToHtml(delta: any): Promise<string> {
  if (!isClientSide()) {
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
