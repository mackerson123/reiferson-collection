"use client";

import { useState } from "react";
import { Collection } from "../../lib/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";

interface CollectionEditorProps {
  collections: Collection[];
  onUpdate: (collection: Collection) => void;
}

export function CollectionEditor({
  collections,
  onUpdate,
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
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Manage Collections</h3>
      </div>

      <div className="grid gap-6">
        {collections.map((collection) => (
          <Card key={collection.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{collection.name}</CardTitle>
                <Button
                  onClick={() => startEditing(collection)}
                  disabled={editingId === collection.id}
                  variant="outline"
                  size="sm"
                >
                  {editingId === collection.id ? "Editing..." : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editingId === collection.id ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Collection Name</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Collection name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      placeholder="Collection description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="curatorNote">Curator Note</Label>
                    <Textarea
                      id="curatorNote"
                      value={formData.curatorNote || ""}
                      onChange={(e) =>
                        updateField("curatorNote", e.target.value)
                      }
                      placeholder="Curator's note about this collection"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={saveChanges}>Save Changes</Button>
                    <Button onClick={cancelEditing} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <strong>Description:</strong>
                    <p className="text-gray-700 mt-1">
                      {collection.description}
                    </p>
                  </div>

                  <div>
                    <strong>Curator Note:</strong>
                    <p className="text-gray-700 mt-1">
                      {collection.curatorNote}
                    </p>
                  </div>

                  <div className="text-sm text-gray-500">
                    ID: {collection.id}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
