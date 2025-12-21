"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Collection } from "../../lib/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { AdminItemCard } from "./admin-item-card";

interface CollectionEditorProps {
  collections: Collection[];
  onUpdate: (collection: Collection) => void;
  onDelete: (collectionId: string) => void;
}

export function CollectionEditor({
  collections,
  onUpdate,
  onDelete,
}: CollectionEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Collection>>({});

  const startEditing = (collection: Collection) => {
    setEditingId(collection.id);
    setFormData(collection);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({});
  };

  const saveChanges = () => {
    if (editingId && formData) {
      onUpdate(formData as Collection);
      setEditingId(null);
      setFormData({});
    }
  };

  const updateField = (field: keyof Collection, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {collections.map((collection) => (
        <AdminItemCard
          key={collection.id}
          title={collection.name}
          isEditing={editingId === collection.id}
          onEdit={() => startEditing(collection)}
          onDelete={() => {
            if (
              confirm(
                `Are you sure you want to delete "${collection.name}"? This will also delete all ${collection.works?.length || 0} works in this collection. This action cannot be undone.`
              )
            ) {
              onDelete(collection.id);
            }
          }}
          editForm={
            <div className="space-y-4">
              <div>
                <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
                  Collection Name
                </Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Collection name"
                  className="bg-white border-black/10 text-navigation tracking-[0.05em]"
                />
              </div>

              <div>
                <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
                  Description
                </Label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Collection description"
                  rows={3}
                  className="bg-white border-black/10 text-navigation tracking-[0.05em]"
                />
              </div>

              <div>
                <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
                  Curator Note
                </Label>
                <Textarea
                  value={formData.curatorNote || ""}
                  onChange={(e) => updateField("curatorNote", e.target.value)}
                  placeholder="Curator's note about this collection"
                  rows={4}
                  className="bg-white border-black/10 text-navigation tracking-[0.05em]"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={saveChanges}
                  className="bg-black text-white px-4 py-2 text-navigation tracking-[0.05em] font-medium hover:opacity-80 transition-opacity rounded-sm cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  onClick={cancelEditing}
                  className="border border-black/10 px-4 py-2 text-navigation tracking-[0.05em] font-medium hover:opacity-60 transition-opacity rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          }
        >
          <div>
            <div className="text-utility tracking-[0.05em] opacity-60 mb-1">
              Description
            </div>
            <p className="text-navigation tracking-[0.05em]">
              {collection.description}
            </p>
          </div>

          <div>
            <div className="text-utility tracking-[0.05em] opacity-60 mb-1">
              Curator Note
            </div>
            <p className="text-navigation tracking-[0.05em]">
              {collection.curatorNote}
            </p>
          </div>

          <div className="text-utility tracking-[0.05em] opacity-40 pt-2">
            ID: {collection.id}
          </div>
        </AdminItemCard>
      ))}
    </div>
  );
}
