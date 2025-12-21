import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Collection } from "../../lib/types";
import { Button } from "../ui/button";

interface CollectionOrderEditorProps {
  collections: Collection[];
  onSaveOrder: (collectionIds: string[]) => Promise<void>;
  onCancel: () => void;
}

export function CollectionOrderEditor({
  collections,
  onSaveOrder,
  onCancel,
}: CollectionOrderEditorProps) {
  const [orderedCollections, setOrderedCollections] = useState(collections);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOrderedCollections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const collectionIds = orderedCollections.map((c) => c.id);
      await onSaveOrder(collectionIds);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
        <p className="text-navigation tracking-[0.05em] text-blue-900">
          Drag and drop collections to reorder them. This will affect the order
          they appear throughout the site.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedCollections.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {orderedCollections.map((collection, index) => (
              <SortableCollectionItem
                key={collection.id}
                collection={collection}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex gap-2 pt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-black text-white hover:bg-black/90 tracking-[0.05em]"
        >
          {isSaving ? "Saving..." : "Save Order"}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          disabled={isSaving}
          className="tracking-[0.05em]"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

interface SortableCollectionItemProps {
  collection: Collection;
  index: number;
}

function SortableCollectionItem({
  collection,
  index,
}: SortableCollectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: collection.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-black/10 rounded-sm p-4 flex items-center gap-4 ${
        isDragging ? "opacity-50 z-50" : ""
      }`}
    >
      <button
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5 text-black/40" />
      </button>

      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center justify-center w-8 h-8 bg-black/5 rounded-full">
          <span className="text-sm font-semibold text-black/60">
            {index + 1}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="text-navigation font-semibold tracking-[0.05em]">
            {collection.name}
          </h3>
          <p className="text-utility tracking-[0.05em] opacity-60">
            {collection.works?.length || 0} works
          </p>
        </div>

        {!collection.isPublished && (
          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded tracking-[0.05em]">
            Draft
          </span>
        )}
      </div>
    </div>
  );
}
