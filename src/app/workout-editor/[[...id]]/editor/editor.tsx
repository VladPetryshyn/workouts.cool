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
import { useContext, useRef, useState } from "react";
import "./styles.scss";
import Image from "next/image";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { OutlinedButton } from "@/components/buttons/outlined";
import { TimeSelect } from "./time-select";
import { WorkoutDocument, WorkoutItem } from "@/models/Workout";
import { createUrlBase } from "@/lib/urlCreators";
import { LoadingModal } from "@/components/modal/loading";
import { ValidationErrors } from "@/app/api/workouts/validation";
import { Tooltip } from "@/components/tooltip";
import { NotificationsContext } from "@/components/notifications";
import { NotificationTypes } from "@/components/notifications/reducer";

interface Props {
  workoutId: string;
  workout: WorkoutDocument;
}

interface WorkoutItemError {
  title: string;
  description: string;
}

interface WorkoutItemExtended extends WorkoutItem {
  error?: WorkoutItemError;
}

export default function WorkoutEditor({ workoutId, workout }: Props) {
  const [id, setId] = useState(workoutId);
  const title = useRef<string>(workout?.title ?? "");
  const [items, setItems] = useState<Array<WorkoutItemExtended>>(
    workout?.steps ?? [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const errors = useRef<ValidationErrors | undefined>();
  const notifContext = useContext(NotificationsContext);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const setErrors = (inputErrors: ValidationErrors) => {
    inputErrors.steps.forEach((step) => {
      setItems((itm) => {
        step.stepId = itm[step.idx]?.id;
        itm[step.idx].error = {
          title: step.error.title?.[0],
          description: step.error.description?.[0],
        };

        return itm;
      });
    });

    errors.current = inputErrors;
  };

  const clearErrors = () => {
    if (errors.current) errors.current.title = "";

    errors.current?.steps.forEach((step) => {
      setItems((itms) => {
        const idx = itms.findIndex((v) => v.id === step.stepId);
        itms[idx] = { ...itms[idx], error: undefined };

        return itms;
      });
    });
  };

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
          totalTime: 30000,
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
      itms[idx].totalTime = mins + itms[idx].secTime;
      return itms;
    });
  const updateSecs = (idx: number) => (secs: number) =>
    setItems((itms) => {
      itms[idx].secTime = secs;
      itms[idx].totalTime = secs + itms[idx].minTime;
      return itms;
    });

  const onSubmit = async () => {
    setIsLoading(true);
    clearErrors();
    const body = JSON.stringify({
      title: title.current,
      steps: items,
      workoutId: id ?? undefined,
    });

    if (!id) {
      const resp = await fetch("/api/workouts/create", {
        method: "POST",
        body,
      });

      const newWorkout = await resp.json();
      if (resp.ok && newWorkout?._id) {
        setId(newWorkout?._id);
        window.history.pushState(
          {},
          "",
          `${window.location.pathname}/${newWorkout?._id}`,
        );
        notifContext.pushNotification(
          "Succssfully created new workout",
          NotificationTypes.SUCCESS,
        );
      } else {
        if (newWorkout.stepsBody)
          notifContext.pushNotification(
            newWorkout.stepsBody,
            NotificationTypes.ERROR,
          );
        setErrors(newWorkout);
      }
    } else {
      const response = await fetch("/api/workouts/update", {
        method: "PUT",
        body,
      });
      const newWorkout = await response.json();
      if (response.ok) {
        notifContext.pushNotification(
          "Succssfully updated workout",
          NotificationTypes.SUCCESS,
        );
      } else {
        if (newWorkout.stepsBody)
          notifContext.pushNotification(
            newWorkout.stepsBody,
            NotificationTypes.ERROR,
          );
        setErrors(newWorkout);
      }
    }

    setIsLoading(false);
  };

  return (
    <>
      <title>Editor </title>
      <div className="workout-editor-container">
        <input
          className="displayFontH1 workout-editor-title"
          defaultValue={title.current}
          onChange={(e) => (title.current = e.target.value)}
          placeholder="New title"
        />
        {errors.current?.title && (
          <span className="workout-editor-error">{errors.current.title}</span>
        )}
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
                  error={itm.error}
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
      {isLoading && <LoadingModal />}
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
  error?: WorkoutItemError;
}

function SortableItem(props: ChildProps) {
  const [localSecs, setLocalSecs] = useState(props.secTime);
  const [localMins, setLocalMins] = useState(props.minTime);

  const localTitle = useRef<string>(props.title);
  const localDescription = useRef<string>(props.title);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const updateTitle = () => {
    props.editTitle(localTitle.current);
  };

  const updateDescription = () => {
    props.editDescription(localDescription.current);
  };

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
              // @ts-ignore
              placeholder="Click here to edit title"
              onBlur={updateTitle}
              onInput={(e) =>
                (localTitle.current = e.currentTarget.textContent!)
              }
            >
              {props.title}
            </h2>
            <button onClick={() => props.onRemove(props.id)}>
              <Image src="/trash.svg" height={25} width={25} alt="Delete" />
            </button>
            <div className="content-title-tooltip">
              {props.error?.title && (
                <Tooltip text={props.error.title} className="tooltip-expanded">
                  <Image width={25} height={25} src="/info.svg" alt="info" />
                </Tooltip>
              )}
            </div>
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
            // @ts-ignore
            placeholder="Click here to edit description"
            onBlur={updateDescription}
            onInput={(e) =>
              (localDescription.current = e.currentTarget.textContent!)
            }
          >
            {props.description}
          </p>

          {props.error?.description && (
            <span className="workout-editor-error">
              {props.error.description}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
