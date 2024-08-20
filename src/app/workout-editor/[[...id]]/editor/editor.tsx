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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { OutlinedButton } from "@/components/buttons/outlined";
import { TimeSelect } from "./time-select";
import { WorkoutDocument, WorkoutItem } from "@/models/Workout";
import { createUrlBase } from "@/lib/urlCreators";

interface Props {
  workoutId: string;
  workout: WorkoutDocument;
}

export default function WorkoutEditor({ workoutId, workout }: Props) {
  const [id, setId] = useState(workoutId);
  const [title, setTitle] = useState<string>(workout?.title ?? "NEW TITLE");
  const [items, setItems] = useState<Array<WorkoutItem>>(workout?.steps ?? []);
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
        {
          id: String(Math.random()),
          title: "",
          description: "",
          minTime: 0,
          secTime: 30000,
        },
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
  const updateMins = (idx: number) => (mins: number) =>
    setItems((itms) => {
      itms[idx].minTime = mins;
      return itms;
    });
  const updateSecs = (idx: number) => (secs: number) =>
    setItems((itms) => {
      itms[idx].secTime = secs;
      return itms;
    });

  const onSubmit = async () => {
    if (!id) {
      const resp = await fetch(createUrlBase("/api/workouts/create"), {
        method: "POST",
        body: JSON.stringify({
          title,
          steps: items,
        }),
      });

      const newWorkout = await resp.json();
      if (newWorkout?._id) {
        setId(newWorkout?._id);
        window.history.pushState(
          {},
          "",
          `${window.location.pathname}/${newWorkout?._id}`,
        );
      }
    } else {
      const response = await fetch("/api/workouts/update", {
        method: "PUT",
        body: JSON.stringify({
          title,
          steps: items,
          workoutId,
        }),
      });
    }
  };

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
                    updateMins={updateMins(idx)}
                    updateSecs={updateSecs(idx)}
                    onRemove={removeItem}
                    minTime={itm.minTime}
                    secTime={itm.secTime}
                  />
                ))}
              </SortableContext>
            </DndContext>
            <button
              className={`workout-editor-container-dnd-btn ${items.length > 0 && "has-content"}`}
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
            onClick={onSubmit}
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

interface ChildProps {
  id: string;
  onRemove: (id: string) => void;
  editTitle: (title: string) => void;
  editDescription: (title: string) => void;
  updateMins: (time: number) => void;
  updateSecs: (time: number) => void;
  title: string;
  description: string;
  minTime: number;
  secTime: number;
}

function SortableItem(props: ChildProps) {
  const [localSecs, setLocalSecs] = useState(props.secTime);
  const [localMins, setLocalMins] = useState(props.minTime);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  const closeModal = () => {
    props.updateSecs(localSecs);
    props.updateMins(localMins);
    setIsModalOpen(false);
  };
  const openModal = () => setIsModalOpen(true);

  return (
    <>
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
              onInput={(e) => props.editTitle(e.currentTarget.textContent!)}
            >
              {props.title}
            </h2>
            <button onClick={() => props.onRemove(props.id)}>
              <Image src="/trash.svg" height={25} width={25} alt="Delete" />
            </button>
          </div>
          <div className="content-time-selector">
            <button onClick={openModal} className="content-time-selector-btn">
              <Image width={20} height={20} src="/clock.svg" alt="Clock" />
              <p className="time-value">
                {localMins > 0 && `${localMins / 60000} Minutes, `}
                {localSecs > 0 && `${localSecs / 1000} Seconds`}
              </p>
            </button>
            {isModalOpen && (
              <TimeSelect
                onHide={closeModal}
                selectedMins={localMins}
                selectedSecs={localSecs}
                updateSecs={setLocalSecs}
                updateMins={setLocalMins}
              />
            )}
          </div>
          <p
            className="content-p"
            contentEditable
            placeholder="Click here to edit description"
            onInput={(e) => props.editDescription(e.currentTarget.textContent!)}
          >
            {props.description}
          </p>
        </div>
      </div>
    </>
  );
}
