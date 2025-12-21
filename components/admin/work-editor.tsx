"use client";

import { useState } from "react";
import { Work, Collection } from "../../lib/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Trash2, Plus, Edit3 } from "lucide-react";
import { ImageUpload } from "./image-upload";
import { AdminItemCard } from "./admin-item-card";

interface WorkEditorProps {
  works: Work[];
  collections: Collection[];
  onUpdate: (work: Work) => void;
  onCreate: (work: Work) => void;
  onDelete: (workId: string) => void;
}

export function WorkEditor({
  works,
  collections,
  onUpdate,
  onCreate,
  onDelete,
}: WorkEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Work>>({});
  const [filterCollection, setFilterCollection] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWorks = works.filter((work) => {
    const matchesCollection =
      filterCollection === "all" || work.collectionId === filterCollection;
    const matchesSearch =
      work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work.artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCollection && matchesSearch;
  });

  const startEditing = (work: Work) => {
    setEditingId(work.id);
    setFormData(work);
    setShowCreateForm(false);
  };

  const startCreating = () => {
    setShowCreateForm(true);
    setEditingId(null);
    setFormData({
      id: `work-${Date.now()}`,
      title: "",
      artist: "",
      date: "",
      medium: "",
      dimensions: "",
      description: "",
      narrative: "",
      provenance: "",
      exhibition: "",
      imageUrl: "",
      collectionId: collections[0]?.id || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setShowCreateForm(false);
    setFormData({});
  };

  const saveChanges = () => {
    if (formData && formData.title && formData.collectionId) {
      if (showCreateForm) {
        onCreate(formData as Work);
      } else if (editingId) {
        onUpdate(formData as Work);
      }
      cancelEditing();
    }
  };

  const updateField = (field: keyof Work, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = (workId: string) => {
    if (confirm("Are you sure you want to delete this work?")) {
      onDelete(workId);
    }
  };

  const getCollectionName = (collectionId: string) => {
    return collections.find((c) => c.id === collectionId)?.name || collectionId;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={startCreating}
          disabled={showCreateForm}
          className="bg-black text-white px-4 py-2 text-navigation tracking-[0.05em] font-medium hover:opacity-80 transition-opacity rounded-sm disabled:opacity-40 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add New Work
        </button>
      </div>

      <div className="bg-white border border-black/10 rounded-sm p-4 flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search works by title, artist, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white border-black/10 text-navigation tracking-[0.05em]"
          />
        </div>
        <div className="min-w-[200px]">
          <Select value={filterCollection} onValueChange={setFilterCollection}>
            <SelectTrigger className="bg-white border-black/10 text-navigation tracking-[0.05em]">
              <SelectValue placeholder="Filter by collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Collections</SelectItem>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {showCreateForm && (
        <div className="bg-white border-2 border-black/20 rounded-sm p-6">
          <h3 className="text-navigation font-semibold tracking-[0.05em] mb-4">
            Create New Work
          </h3>
          <WorkForm
            formData={formData}
            collections={collections}
            onUpdateField={updateField}
            onSave={saveChanges}
            onCancel={cancelEditing}
            isCreate={true}
          />
        </div>
      )}

      <div className="space-y-4">
        <p className="text-utility tracking-[0.05em] opacity-60">
          Showing {filteredWorks.length} of {works.length} works
        </p>

        {filteredWorks.map((work) => (
          <AdminItemCard
            key={work.id}
            title={work.title}
            subtitle={`${work.artist || "Unknown Artist"} • ${getCollectionName(
              work.collectionId
            )}`}
            isEditing={editingId === work.id}
            onEdit={() => startEditing(work)}
            onDelete={() => handleDelete(work.id)}
            editForm={
              <WorkForm
                formData={formData}
                collections={collections}
                onUpdateField={updateField}
                onSave={saveChanges}
                onCancel={cancelEditing}
                isCreate={false}
              />
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-utility tracking-[0.05em] opacity-60 mb-1">
                  Image
                </div>
                {work.imageUrl ? (
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    className="w-20 h-20 object-cover rounded-sm border border-black/10"
                  />
                ) : (
                  <div className="w-20 h-20 bg-black/5 rounded-sm border border-black/10 flex items-center justify-center text-xs opacity-40">
                    No image
                  </div>
                )}
              </div>
              <div>
                <div className="text-utility tracking-[0.05em] opacity-60 mb-1">
                  Details
                </div>
                <div className="text-sm text-navigation tracking-[0.05em]">
                  {work.date && <div>Date: {work.date}</div>}
                  {work.medium && <div>Medium: {work.medium}</div>}
                  {work.dimensions && <div>Dimensions: {work.dimensions}</div>}
                </div>
              </div>
            </div>

            {work.description && (
              <div>
                <div className="text-utility tracking-[0.05em] opacity-60 mb-1">
                  Description
                </div>
                <p className="text-navigation tracking-[0.05em]">
                  {work.description}
                </p>
              </div>
            )}

            {work.narrative && (
              <div>
                <div className="text-utility tracking-[0.05em] opacity-60 mb-1">
                  Narrative
                </div>
                <p className="text-navigation tracking-[0.05em]">
                  {work.narrative}
                </p>
              </div>
            )}

            <div className="text-utility tracking-[0.05em] opacity-40 pt-2">
              ID: {work.id}
            </div>
          </AdminItemCard>
        ))}
      </div>
    </div>
  );
}

interface WorkFormProps {
  formData: Partial<Work>;
  collections: Collection[];
  onUpdateField: (field: keyof Work, value: string | string[]) => void;
  onSave: () => void;
  onCancel: () => void;
  isCreate: boolean;
}

function WorkForm({
  formData,
  collections,
  onUpdateField,
  onSave,
  onCancel,
  isCreate,
}: WorkFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
            Title *
          </Label>
          <Input
            value={formData.title || ""}
            onChange={(e) => onUpdateField("title", e.target.value)}
            placeholder="Work title"
            required
            className="bg-white border-black/10 text-navigation tracking-[0.05em]"
          />
        </div>

        <div>
          <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
            Artist
          </Label>
          <Input
            value={formData.artist || ""}
            onChange={(e) => onUpdateField("artist", e.target.value)}
            placeholder="Artist name"
            className="bg-white border-black/10 text-navigation tracking-[0.05em]"
          />
        </div>

        <div>
          <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
            Date
          </Label>
          <Input
            value={formData.date || ""}
            onChange={(e) => onUpdateField("date", e.target.value)}
            placeholder="e.g. c. 1920s"
            className="bg-white border-black/10 text-navigation tracking-[0.05em]"
          />
        </div>

        <div>
          <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
            Medium
          </Label>
          <Input
            value={formData.medium || ""}
            onChange={(e) => onUpdateField("medium", e.target.value)}
            placeholder="e.g. Gelatin silver print"
            className="bg-white border-black/10 text-navigation tracking-[0.05em]"
          />
        </div>

        <div>
          <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
            Dimensions
          </Label>
          <Input
            value={formData.dimensions || ""}
            onChange={(e) => onUpdateField("dimensions", e.target.value)}
            placeholder="e.g. 8 x 10 in."
            className="bg-white border-black/10 text-navigation tracking-[0.05em]"
          />
        </div>

        <div>
          <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
            Collection *
          </Label>
          <Select
            value={formData.collectionId || ""}
            onValueChange={(value) => onUpdateField("collectionId", value)}
          >
            <SelectTrigger className="bg-white border-black/10 text-navigation tracking-[0.05em]">
              <SelectValue placeholder="Select collection" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ImageUpload
        value={formData.imageUrl || ""}
        onChange={(url) => onUpdateField("imageUrl", url)}
        label="Image"
      />

      <div>
        <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
          Description
        </Label>
        <Textarea
          value={formData.description || ""}
          onChange={(e) => onUpdateField("description", e.target.value)}
          placeholder="Brief description of the work"
          rows={3}
          className="bg-white border-black/10 text-navigation tracking-[0.05em]"
        />
      </div>

      <div>
        <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
          Narrative
        </Label>
        <Textarea
          value={formData.narrative || ""}
          onChange={(e) => onUpdateField("narrative", e.target.value)}
          placeholder="Detailed story or context about the work"
          rows={4}
          className="bg-white border-black/10 text-navigation tracking-[0.05em]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
            Provenance
          </Label>
          <Textarea
            value={formData.provenance || ""}
            onChange={(e) => onUpdateField("provenance", e.target.value)}
            placeholder="Origin and ownership history"
            rows={2}
            className="bg-white border-black/10 text-navigation tracking-[0.05em]"
          />
        </div>

        <div>
          <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
            Exhibition
          </Label>
          <Textarea
            value={formData.exhibition || ""}
            onChange={(e) => onUpdateField("exhibition", e.target.value)}
            placeholder="Exhibition history"
            rows={2}
            className="bg-white border-black/10 text-navigation tracking-[0.05em]"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={onSave}
          className="bg-black text-white px-4 py-2 text-navigation tracking-[0.05em] font-medium hover:opacity-80 transition-opacity rounded-sm cursor-pointer"
        >
          {isCreate ? "Create Work" : "Save Changes"}
        </button>
        <button
          onClick={onCancel}
          className="border border-black/10 px-4 py-2 text-navigation tracking-[0.05em] font-medium hover:opacity-60 transition-opacity rounded-sm cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
