import { useEffect, useState } from "react";
import { i18n } from "@/src/lib/i18n";
import type { CraftedInverseImage } from "@/src/tli/core";
import { InverseImageInventoryItem } from "./InverseImageInventoryItem";

interface InverseImageInventoryProps {
  inverseImages: CraftedInverseImage[];
  onEdit: (inverseImage: CraftedInverseImage) => void;
  onCopy: (inverseImage: CraftedInverseImage) => void;
  onDelete: (inverseImageId: string) => void;
  selectedInverseImageId?: string;
  onSelectInverseImage?: (inverseImageId: string | undefined) => void;
  hasInverseImagePlaced?: boolean;
  hasPrismPlaced?: boolean;
  isOnGodGoddessTree?: boolean;
  treeHasPoints?: boolean;
}

export const InverseImageInventory: React.FC<InverseImageInventoryProps> = ({
  inverseImages,
  onEdit,
  onCopy,
  onDelete,
  selectedInverseImageId,
  onSelectInverseImage,
  hasInverseImagePlaced = false,
  hasPrismPlaced = false,
  isOnGodGoddessTree = false,
  treeHasPoints = false,
}) => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleLocaleChange = () => {
      forceUpdate({});
    };
    window.addEventListener("locale-changed", handleLocaleChange);
    return () => {
      window.removeEventListener("locale-changed", handleLocaleChange);
    };
  }, []);

  const selectionMode = !!onSelectInverseImage;

  const handleSelect = (inverseImageId: string) => {
    if (!onSelectInverseImage) return;
    if (selectedInverseImageId === inverseImageId) {
      onSelectInverseImage(undefined);
    } else {
      onSelectInverseImage(inverseImageId);
    }
  };

  const getStatusMessage = (): string => {
    if (hasInverseImagePlaced) {
      return i18n._("An inverse image is already placed. Remove it first to place a different one.");
    }
    if (selectedInverseImageId) {
      if (isOnGodGoddessTree) {
        return i18n._("Switch to a Profession Tree (Slots 2-4) to place the inverse image.");
      }
      if (hasPrismPlaced) {
        return i18n._("Switch to a tree without a prism to place the inverse image.");
      }
      if (treeHasPoints) {
        return i18n._("Reset the tree's points to 0 before placing an inverse image.");
      }
      return i18n._("Click on an empty talent node (not in center column) to place the inverse image, or click it again to deselect.");
    }
    return i18n._("Click an inverse image to select it for placement.");
  };

  // Only block selection if an inverse image is already placed (only one allowed anywhere)
  // Prism-in-same-tree check happens at placement time, not selection time
  const canSelect = !hasInverseImagePlaced && selectionMode;

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-4">
      <h3 className="mb-4 text-lg font-medium text-zinc-200">
        {i18n._("Inverse Image Inventory")} ({inverseImages.length})
      </h3>

      {selectionMode && (
        <div className="mb-3 p-2 rounded bg-cyan-500/10 border border-cyan-500/30">
          <p className="text-sm text-cyan-300">{getStatusMessage()}</p>
        </div>
      )}

      {inverseImages.length === 0 ? (
        <p className="text-sm text-zinc-500">
          {i18n._("No inverse images crafted yet. Create one using the crafter!")}
        </p>
      ) : (
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
          {inverseImages.map((inverseImage) => (
            <InverseImageInventoryItem
              key={inverseImage.id}
              inverseImage={inverseImage}
              onEdit={() => onEdit(inverseImage)}
              onCopy={() => onCopy(inverseImage)}
              onDelete={() => onDelete(inverseImage.id)}
              isSelected={selectedInverseImageId === inverseImage.id}
              onSelect={
                canSelect ? () => handleSelect(inverseImage.id) : undefined
              }
              selectionMode={canSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
