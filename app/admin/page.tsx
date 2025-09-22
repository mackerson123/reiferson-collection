"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { CollectionEditor } from "../../components/admin/collection-editor";
import { WorkEditor } from "../../components/admin/work-editor";
import { Collection, Work } from "../../lib/types";

export default function AdminPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [collectionsRes, worksRes] = await Promise.all([
        fetch("/api/collections"),
        fetch("/api/works"),
      ]);

      const collectionsData = await collectionsRes.json();
      const worksData = await worksRes.json();

      setCollections(collectionsData.collections);
      setWorks(worksData.works);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionUpdate = async (updatedCollection: Collection) => {
    try {
      const response = await fetch("/api/admin/collections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCollection),
      });

      if (response.ok) {
        setCollections((prev) =>
          prev.map((c) =>
            c.id === updatedCollection.id ? updatedCollection : c
          )
        );
      }
    } catch (error) {
      console.error("Error updating collection:", error);
    }
  };

  const handleWorkUpdate = async (updatedWork: Work) => {
    try {
      const response = await fetch("/api/admin/works", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedWork),
      });

      if (response.ok) {
        setWorks((prev) =>
          prev.map((w) => (w.id === updatedWork.id ? updatedWork : w))
        );
      }
    } catch (error) {
      console.error("Error updating work:", error);
    }
  };

  const handleWorkCreate = async (newWork: Work) => {
    try {
      const response = await fetch("/api/admin/works", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWork),
      });

      if (response.ok) {
        const createdWork = await response.json();
        setWorks((prev) => [...prev, createdWork]);
      }
    } catch (error) {
      console.error("Error creating work:", error);
    }
  };

  const handleWorkDelete = async (workId: string) => {
    try {
      const response = await fetch(`/api/admin/works?id=${workId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setWorks((prev) => prev.filter((w) => w.id !== workId));
      }
    } catch (error) {
      console.error("Error deleting work:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Collection Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => window.open("/", "_blank")} variant="outline">
            Preview Site
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{collections.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Works</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{works.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="collections" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="works">Works</TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="space-y-4">
          <CollectionEditor
            collections={collections}
            onUpdate={handleCollectionUpdate}
          />
        </TabsContent>

        <TabsContent value="works" className="space-y-4">
          <WorkEditor
            works={works}
            collections={collections}
            onUpdate={handleWorkUpdate}
            onCreate={handleWorkCreate}
            onDelete={handleWorkDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
