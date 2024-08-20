export const richTextToHtml = (richTextString: string) => {
  try {
    const richText = JSON.parse(richTextString);
    return richText.map(converter);
  } catch (e) {}
};

interface item {
  type?:
    | "paragraph"
    | "numbered-list"
    | "list-item"
    | "h1"
    | "h2"
    | "bulleted-list";
  text?: string;
  align?: "left" | "center" | "right";
  italic?: boolean;
  bold?: boolean;
  underline?: boolean;
  children?: item[];
}
const converter = (itm: item) => {
  switch (itm.type) {
    case "h1":
      return <h1>{itm?.children?.map(converter)}</h1>;
    case "h2":
      return <h2> {itm?.children?.map(converter)}</h2>;
    case "list-item":
      return <li>{itm?.children?.map(converter)}</li>;
    case "numbered-list":
      return <ol>{itm?.children?.map(converter)}</ol>;
    case "bulleted-list":
      return <ul>{itm?.children?.map(converter)}</ul>;
    case "paragraph":
      return <p>{itm?.children?.map(converter)}</p>;
    default:
      return (
        <span
          align={itm?.align ?? "left"}
          className={`${itm.italic && "rt-italic"} ${itm.bold && "rt-bold"} ${itm.underline && "rt-underline"}`}
        >
          {itm.text}
        </span>
      );
  }
};

const makeContentPreviewRec = (item: item) => {
  if (item.text) return item.text;

  let text = "";
  if (item?.children) {
    for (const i of item?.children) {
      text += makeContentPreviewRec(i) ?? "";
    }
  }

  return text;
};

export const makeContentPreview = (items: item[]) => {
  let text = "";

  for (const i of items) {
    text += makeContentPreviewRec(i) ?? "";
  }

  return text;
};
