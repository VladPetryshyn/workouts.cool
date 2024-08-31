"use client";
import React, { useCallback, useContext, useState } from "react";
import {
  BaseEditor,
  createEditor,
  Editor,
  Element as SlateElement,
  Transforms,
} from "slate";
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  RenderLeafProps,
  RenderElementProps,
} from "slate-react";
import "./styles.scss";
import Image from "next/image";
import { OutlinedButton } from "@/components/buttons/outlined";
import { LoadingModal } from "@/components/modal/loading";
import { Tooltip } from "@/components/tooltip";
import { NotificationsContext } from "@/components/notifications";
import { NotificationTypes } from "@/components/notifications/reducer";

const initialValue = JSON.stringify([
  { type: "paragraph", children: [{ text: "" }] },
]);
const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

interface Props {
  articleId?: string;
  article?: {
    title: string;
    content: string;
  };
}

export default function ArticleEditor({ articleId, article }: Props) {
  const [id, setId] = useState(articleId);
  const [title, setTitle] = useState(article?.title ?? "");
  const [slateValue, setSlateValue] = useState<string>(
    article?.content ?? initialValue,
  );
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );
  const notifContext = useContext(NotificationsContext);
  const [editor] = useState(() => withReact(createEditor()));
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ title: null, description: null });

  const onSubmit = async () => {
    setIsLoading(true);
    const body = JSON.stringify({
      title: title,
      content: slateValue,
      articleId: id ?? undefined,
    });

    if (!id) {
      const response = await fetch("/api/articles/create", {
        method: "POST",
        body,
      });
      const newArticle = await response.json();

      if (response.ok && newArticle?._id) {
        setId(newArticle?._id);
        window.history.pushState(
          {},
          "",
          `${window.location.pathname}/${newArticle?._id}`,
        );
        notifContext.pushNotification(
          "Succssfully created new article",
          NotificationTypes.SUCCESS,
        );
        setErrors({ title: null, description: null });
      } else {
        setErrors({
          title: newArticle.title?.[0],
          description: newArticle.contentPreview?.[0],
        });
      }
    } else {
      const response = await fetch("/api/articles/update", {
        method: "PUT",
        body,
      });

      if (response.ok) {
        setErrors({ title: null, description: null });
        notifContext.pushNotification(
          "Succssfully updated article",
          NotificationTypes.SUCCESS,
        );
      } else {
        const errors = await response.json();

        setErrors({
          title: errors.title?.[0],
          description: errors.contentPreview?.[0],
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <>
      <title>Editor </title>
      <div className="article-editor-container">
        <input
          className="displayFontH1 article-editor-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Title"
        />
        {errors.title && (
          <span className="article-editor-title-error">{errors.title}</span>
        )}
        <div className="article-editor-description">
          <Slate
            editor={editor}
            initialValue={JSON.parse(slateValue)}
            onChange={(value) => {
              const isAstChange = editor.operations.some(
                (op) => "set_selection" !== op.type,
              );
              if (isAstChange) {
                // Save the value to Local Storage.
                const content = JSON.stringify(value);
                setSlateValue(content);
              }
            }}
          >
            <div className="article-editor-container-toolbar">
              {errors.description && (
                <div className="article-editor-container-toolbar-error">
                  <Tooltip
                    text={errors.description}
                    className="article-editor-container-toolbar-error-tooltip"
                  >
                    <Image width={40} height={40} src="/info.svg" alt="Info" />
                  </Tooltip>
                </div>
              )}
              <BlockButton format="h1" />
              <BlockButton format="h2" />
              <BlockButton format="numbered-list" />
              <BlockButton format="bulleted-list" />
              <BlockButton format="left" />
              <BlockButton format="center" />
              <BlockButton format="right" />
              <MarkButton format="bold" />
              <MarkButton format="italic" />
              <MarkButton format="underline" />
            </div>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              className="article-editor-container-editor"
            />
          </Slate>
        </div>

        <OutlinedButton
          text="Save article"
          onClick={() => onSubmit()}
          className="article-editor-container-save-btn"
        />
      </div>
      {isLoading && <LoadingModal />}
    </>
  );
}

const BlockButton = ({ format }: any) => {
  const editor = useSlate();
  return (
    <button
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      className={
        isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type",
        )
          ? "active"
          : ""
      }
    >
      <Image
        width={40}
        height={40}
        src={`/article-editor/${format}.svg`}
        alt="BlockButtonIcon"
      />
    </button>
  );
};

const MarkButton = ({ format }: any) => {
  const editor = useSlate();
  return (
    <button
      //active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      className={isMarkActive(editor, format) ? "active" : ""}
    >
      <Image
        width={40}
        height={40}
        src={`/article-editor/${format}.svg`}
        alt="MarkButtonicon"
      />
    </button>
  );
};
const isBlockActive = (editor: BaseEditor, format: any, blockType: any) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        // @ts-ignore
        n[blockType] === format,
    }),
  );

  return !!match;
};

const toggleBlock = (editor: BaseEditor, format: any) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type",
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (node) => {
      const n = node as any;
      return (
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        // @ts-ignore
        LIST_TYPES.includes(n.type) &&
        !TEXT_ALIGN_TYPES.includes(format)
      );
    },
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      // @ts-ignore
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      // @ts-ignore
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const Element = ({ attributes, children, element }: any) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "h1":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const isMarkActive = (editor: BaseEditor, format: any) => {
  const marks = Editor.marks(editor);
  // @ts-ignore
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: BaseEditor, format: any) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};
