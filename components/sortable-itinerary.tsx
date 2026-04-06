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
import { GripVertical, MapPin, Calendar } from "lucide-react";

interface SortableItineraryProps {
  locations: Location[];
  tripId: string;
}

function SortableItem({ item }: { item: Location }) {
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
      className={`group relative bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-lg ${
        isDragging ? "shadow-2xl scale-[1.02] border-blue-400 z-50" : ""
      }`}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 cursor-grab active:cursor-grabbing transition-colors opacity-0 group-hover:opacity-100"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      <div className="ml-8 flex justify-between items-center">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-shrink-0 w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 truncate">
              {item.locationTitle}
            </h4>
          </div>

          <div className="text-sm text-gray-600 mb-2 break-all">
            <strong>Coordinates:</strong> {item.lat.toFixed(4)},{" "}
            {item.lng.toFixed(4)}
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
            <Calendar className="w-3 h-3" />
            Destination {item.order + 1}
          </div>
        </div>

        {/* Day indicator */}
        <div className="flex-shrink-0 ml-4">
          <div className="bg-linear-to-br from-blue-600 to-purple-600 text-white text-sm font-bold px-3 py-2 rounded-lg shadow-md">
            Day {item.order + 1}
          </div>
        </div>
      </div>

      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200 pointer-events-none" />
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
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-100 to-purple-100 rounded-full mb-4">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No locations yet
        </h3>
        <p className="text-gray-600">
          Start planning by adding your first destination!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <GripVertical className="w-4 h-4" />
        <span>Drag to reorder your itinerary</span>
      </div>

      <DndContext
        id={id}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localLocation.map((loc) => loc.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {localLocation.map((item, key) => (
              <SortableItem key={key} item={item} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
