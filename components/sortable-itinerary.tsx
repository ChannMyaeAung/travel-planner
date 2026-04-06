import { Location } from "@/app/generated/prisma";
import { reorderItinerary } from "@/lib/actions/reorder-itinerary";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useId, useState } from "react";
import { GripVertical, MapPin } from "lucide-react";

interface SortableItineraryProps {
  locations: Location[];
  tripId: string;
}

function SortableItem({ item, index }: { item: Location; index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative bg-white border border-slate-200 rounded-xl p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm ${
        isDragging ? "shadow-lg border-blue-300 opacity-90 z-50 scale-[1.01]" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-100 cursor-grab active:cursor-grabbing transition-colors opacity-0 group-hover:opacity-100"
        >
          <GripVertical className="w-4 h-4 text-slate-400" />
        </div>

        {/* Stop number */}
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
          {index + 1}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-900 text-sm truncate">
            {item.locationTitle}
          </h4>
          {item.formattedAddress ? (
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {item.formattedAddress}
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
            </p>
          )}
        </div>

        {/* Country badge */}
        {item.country && item.country !== "Unknown" && (
          <span className="flex-shrink-0 text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
            {item.country}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SortableItinerary({
  locations,
  tripId,
}: SortableItineraryProps) {
  const id = useId();
  const [localLocation, setLocalLocation] = useState(locations);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = localLocation.findIndex((loc) => loc.id === active.id);
      const newIndex = localLocation.findIndex((loc) => loc.id === over?.id);

      const newLocationsOrder = arrayMove(
        localLocation,
        oldIndex,
        newIndex
      ).map((item, index) => ({ ...item, order: index }));

      setLocalLocation(newLocationsOrder);

      await reorderItinerary(
        tripId,
        newLocationsOrder.map((item) => item.id)
      );
    }
  };

  if (localLocation.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-3">
          <MapPin className="w-5 h-5 text-slate-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 mb-1">No locations yet</h3>
        <p className="text-sm text-slate-500">Start planning by adding your first destination.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-3">
        <GripVertical className="w-3.5 h-3.5" />
        Drag to reorder
      </p>

      <DndContext
        id={id}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localLocation.map((loc) => loc.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {localLocation.map((item, index) => (
              <SortableItem key={item.id} item={item} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
