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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Trash2, Plus, Edit3 } from "lucide-react";
import { ImageUpload } from "./image-upload";

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
        <h3 className="text-xl font-semibold">Manage Works</h3>
        <Button onClick={startCreating} disabled={showCreateForm}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Work
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg border">
        <div className="flex-1">
          <Input
            placeholder="Search works by title, artist, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="min-w-[200px]">
          <Select value={filterCollection} onValueChange={setFilterCollection}>
            <SelectTrigger>
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

      {/* Create Form */}
      {showCreateForm && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700">Create New Work</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkForm
              formData={formData}
              collections={collections}
              onUpdateField={updateField}
              onSave={saveChanges}
              onCancel={cancelEditing}
              isCreate={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Works List */}
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Showing {filteredWorks.length} of {works.length} works
        </p>

        {filteredWorks.map((work) => (
          <Card key={work.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{work.title}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {work.artist} • {getCollectionName(work.collectionId)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => startEditing(work)}
                    disabled={editingId === work.id}
                    variant="outline"
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(work.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingId === work.id ? (
                <WorkForm
                  formData={formData}
                  collections={collections}
                  onUpdateField={updateField}
                  onSave={saveChanges}
                  onCancel={cancelEditing}
                  isCreate={false}
                />
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong>Date:</strong> {work.date}
                    </div>
                    <div>
                      <strong>Medium:</strong> {work.medium}
                    </div>
                    <div>
                      <strong>Dimensions:</strong> {work.dimensions}
                    </div>
                    <div>
                      <strong>Image URL:</strong>
                      <span className="text-xs text-gray-600 block truncate">
                        {work.imageUrl}
                      </span>
                    </div>
                  </div>

                  {work.description && (
                    <div>
                      <strong>Description:</strong>
                      <p className="text-gray-700 mt-1">{work.description}</p>
                    </div>
                  )}

                  {work.narrative && (
                    <div>
                      <strong>Narrative:</strong>
                      <p className="text-gray-700 mt-1">{work.narrative}</p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">ID: {work.id}</div>
                </div>
              )}
            </CardContent>
          </Card>
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
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title || ""}
            onChange={(e) => onUpdateField("title", e.target.value)}
            placeholder="Work title"
            required
          />
        </div>

        <div>
          <Label htmlFor="artist">Artist</Label>
          <Input
            id="artist"
            value={formData.artist || ""}
            onChange={(e) => onUpdateField("artist", e.target.value)}
            placeholder="Artist name"
          />
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            value={formData.date || ""}
            onChange={(e) => onUpdateField("date", e.target.value)}
            placeholder="e.g. c. 1920s"
          />
        </div>

        <div>
          <Label htmlFor="medium">Medium</Label>
          <Input
            id="medium"
            value={formData.medium || ""}
            onChange={(e) => onUpdateField("medium", e.target.value)}
            placeholder="e.g. Gelatin silver print"
          />
        </div>

        <div>
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input
            id="dimensions"
            value={formData.dimensions || ""}
            onChange={(e) => onUpdateField("dimensions", e.target.value)}
            placeholder="e.g. 8 x 10 in."
          />
        </div>

        <div>
          <Label htmlFor="collection">Collection *</Label>
          <Select
            value={formData.collectionId || ""}
            onValueChange={(value) => onUpdateField("collectionId", value)}
          >
            <SelectTrigger>
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => onUpdateField("description", e.target.value)}
          placeholder="Brief description of the work"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="narrative">Narrative</Label>
        <Textarea
          id="narrative"
          value={formData.narrative || ""}
          onChange={(e) => onUpdateField("narrative", e.target.value)}
          placeholder="Detailed story or context about the work"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="provenance">Provenance</Label>
          <Textarea
            id="provenance"
            value={formData.provenance || ""}
            onChange={(e) => onUpdateField("provenance", e.target.value)}
            placeholder="Origin and ownership history"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="exhibition">Exhibition</Label>
          <Textarea
            id="exhibition"
            value={formData.exhibition || ""}
            onChange={(e) => onUpdateField("exhibition", e.target.value)}
            placeholder="Exhibition history"
            rows={2}
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={onSave}>
          {isCreate ? "Create Work" : "Save Changes"}
        </Button>
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
}
