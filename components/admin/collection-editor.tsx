import { useState } from "react";
import { Plus } from "lucide-react";
import { Collection } from "../../lib/types";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { AdminItemCard } from "./admin-item-card";

interface CollectionEditorProps {
  collections: Collection[];
  onUpdate: (collection: Collection) => void;
  onDelete: (collectionId: string) => void;
  onTogglePublish: (collectionId: string) => void;
  onCreate?: (collection: Omit<Collection, "works">) => void;
}

export function CollectionEditor({
  collections,
  onUpdate,
  onDelete,
  onTogglePublish,
  onCreate,
}: CollectionEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Collection>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft"
  >("all");

  const filteredCollections = collections.filter((c) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "published") return c.isPublished !== false;
    if (filterStatus === "draft") return c.isPublished === false;
    return true;
  });

  const startEditing = (collection: Collection) => {
    setEditingId(collection.id);
    setFormData(collection);
    setShowCreateForm(false);
  };

  const startCreating = () => {
    setShowCreateForm(true);
    setEditingId(null);
    setFormData({
      id: `collection-${Date.now()}`,
      name: "",
      description: "",
      curatorNote: "",
      isPublished: false,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setShowCreateForm(false);
    setFormData({});
  };

  const saveChanges = () => {
    if (formData && formData.name) {
      if (showCreateForm && onCreate) {
        onCreate({
          id: formData.id || `collection-${Date.now()}`,
          name: formData.name,
          description: formData.description,
          curatorNote: formData.curatorNote,
          isPublished: formData.isPublished,
        });
      } else if (editingId) {
        onUpdate(formData as Collection);
      }
      cancelEditing();
    }
  };

  const updateField = (field: keyof Collection, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {onCreate && (
          <button
            onClick={startCreating}
            disabled={showCreateForm}
            className="bg-black text-white px-4 py-2 text-navigation tracking-[0.05em] font-medium rounded-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 admin-btn-primary"
          >
            <Plus className="w-4 h-4" />
            New Collection
          </button>
        )}

        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-sm tracking-[0.05em] rounded-sm admin-filter-pill ${
                filterStatus === status
                  ? "bg-black text-white"
                  : "bg-white border border-black/10 text-black/60 hover:text-black"
              }`}
            >
              {status === "all"
                ? "All"
                : status === "published"
                ? "Published"
                : "Drafts"}
            </button>
          ))}
        </div>
      </div>

      {showCreateForm && (
        <div className="bg-white border-2 border-black/20 rounded-sm p-6">
          <h3 className="text-navigation font-semibold tracking-[0.05em] mb-4">
            Create New Collection
          </h3>
          <CollectionForm
            formData={formData}
            onUpdateField={updateField}
            onSave={saveChanges}
            onCancel={cancelEditing}
            isCreate={true}
          />
        </div>
      )}

      <p className="text-utility tracking-[0.05em] opacity-60">
        Showing {filteredCollections.length} of {collections.length} collections
      </p>

      {filteredCollections.map((collection) => (
        <AdminItemCard
          key={collection.id}
          title={collection.name}
          subtitle={`${collection.works?.length || 0} works`}
          isEditing={editingId === collection.id}
          isPublished={collection.isPublished !== false}
          onEdit={() => startEditing(collection)}
          onTogglePublish={() => onTogglePublish(collection.id)}
          onDelete={() => {
            if (
              confirm(
                `Are you sure you want to delete "${
                  collection.name
                }"? This will also delete all ${
                  collection.works?.length || 0
                } works in this collection. This action cannot be undone.`
              )
            ) {
              onDelete(collection.id);
            }
          }}
          editForm={
            <CollectionForm
              formData={formData}
              onUpdateField={updateField}
              onSave={saveChanges}
              onCancel={cancelEditing}
              isCreate={false}
            />
          }
        >
          <div>
            <div className="text-utility tracking-[0.05em] opacity-60 mb-1">
              Description
            </div>
            <p className="text-navigation tracking-[0.05em]">
              {collection.description || (
                <span className="opacity-40">No description</span>
              )}
            </p>
          </div>

          <div>
            <div className="text-utility tracking-[0.05em] opacity-60 mb-1">
              Curator Note
            </div>
            <p className="text-navigation tracking-[0.05em]">
              {collection.curatorNote || (
                <span className="opacity-40">No curator note</span>
              )}
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

interface CollectionFormProps {
  formData: Partial<Collection>;
  onUpdateField: (field: keyof Collection, value: string | boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isCreate: boolean;
}

function CollectionForm({
  formData,
  onUpdateField,
  onSave,
  onCancel,
  isCreate,
}: CollectionFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
          Collection Name *
        </Label>
        <Input
          value={formData.name || ""}
          onChange={(e) => onUpdateField("name", e.target.value)}
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
          onChange={(e) => onUpdateField("description", e.target.value)}
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
          onChange={(e) => onUpdateField("curatorNote", e.target.value)}
          placeholder="Curator's note about this collection"
          rows={4}
          className="bg-white border-black/10 text-navigation tracking-[0.05em]"
        />
      </div>

      {isCreate && (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="publish-immediately"
            checked={formData.isPublished === true}
            onChange={(e) => onUpdateField("isPublished", e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <Label
            htmlFor="publish-immediately"
            className="text-navigation tracking-[0.05em] cursor-pointer"
          >
            Publish immediately
          </Label>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <button
          onClick={onSave}
          className="bg-black text-white px-4 py-2 text-navigation tracking-[0.05em] font-medium rounded-sm admin-btn-primary"
        >
          {isCreate ? "Create Collection" : "Save Changes"}
        </button>
        <button
          onClick={onCancel}
          className="border border-black/10 px-4 py-2 text-navigation tracking-[0.05em] font-medium rounded-sm admin-btn-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
