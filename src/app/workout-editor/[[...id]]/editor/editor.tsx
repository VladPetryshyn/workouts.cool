"use client";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import "./styles.scss";
import Image from "next/image";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { OutlinedButton } from "@/components/buttons/outlined";

export default function WorkoutEditor() {
  const [title, setTitle] = useState<string>("new title");
  const [items, setItems] = useState<
    Array<{ id: string; title: string; description: string }>
  >([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const addItem = () => {
    if (items.length < 59)
      setItems((itms) => [
        ...itms,
        { id: String(Math.random()), title: "", description: "" },
      ]);
  };
  const removeItem = (id: string) =>
    setItems((itms) => itms.filter((_id) => _id.id !== id));
  const editTitle = (idx: number) => (text: string) =>
    setItems((itms) => {
      itms[idx].title = text;
      return itms;
    });
  const editDescription = (idx: number) => (text: string) =>
    setItems((itms) => {
      itms[idx].description = text;
      return itms;
    });

  return (
    <>
      <title>Editor </title>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="workout-editor-container">
          <input
            className="displayFontH1 workout-editor-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="workout-editor-container-dnd">
            <DndContext
              collisionDetection={closestCenter}
              sensors={sensors}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((itm, idx) => (
                  <SortableItem
                    key={itm.id}
                    id={itm.id}
                    title={itm.title}
                    description={itm.description}
                    editTitle={editTitle(idx)}
                    editDescription={editDescription(idx)}
                    onRemove={removeItem}
                  />
                ))}
              </SortableContext>
            </DndContext>
            <button
              className="workout-editor-container-dnd-btn"
              onClick={addItem}
            >
              <Image
                height={60}
                width={60}
                src="/plus.svg"
                alt="Add new item button"
              />
            </button>
          </div>

          <OutlinedButton
            text="Save article"
            onClick={() => console.log(items)}
            className="workout-editor-container-save-btn"
          />
        </div>
      </LocalizationProvider>
    </>
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
}

function SortableItem(props: { id: string; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className="workout-editor-container-dnd-item"
    >
      <Image
        width={50}
        height={50}
        src="/handler.svg"
        {...listeners}
        className="handler"
        alt="Handler"
      />
      <div className="content">
        <div className="content-title">
          <h2
            contentEditable
            role="textbox"
            placeholder="Click here to edit title"
            onInput={(e) => props.editTitle(e.currentTarget.textContent)}
          >
            {props.title}
          </h2>
          <button onClick={() => props.onRemove(props.id)}>
            <Image src="/trash.svg" height={25} width={25} alt="Delete" />
          </button>
        </div>
        <div className="content-time-selector">
          <Image width={20} height={20} src="/clock.svg" alt="Clock" />
          <p>30 seconds</p>
        </div>
        <p
          className="content-p"
          contentEditable
          placeholder="Click here to edit description"
          onInput={(e) => props.editDescription(e.currentTarget.textContent)}
        >
          {props.description}
        </p>
      </div>
    </div>
  );
}
