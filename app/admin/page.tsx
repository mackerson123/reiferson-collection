"use client";

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
import { trpc } from "../../lib/trpc/client";
import { Collection, Work } from "../../lib/types";

export default function AdminPage() {
  const { data: collectionsData, isLoading: collectionsLoading } =
    trpc.collections.list.useQuery();
  const { data: worksData, isLoading: worksLoading } =
    trpc.works.list.useQuery();

  const utils = trpc.useUtils();

  const updateCollectionMutation = trpc.collections.update.useMutation({
    onSuccess: () => {
      utils.collections.list.invalidate();
    },
  });

  const createWorkMutation = trpc.works.create.useMutation({
    onSuccess: () => {
      utils.works.list.invalidate();
      utils.collections.list.invalidate();
    },
  });

  const updateWorkMutation = trpc.works.update.useMutation({
    onSuccess: () => {
      utils.works.list.invalidate();
      utils.collections.list.invalidate();
    },
  });

  const deleteWorkMutation = trpc.works.delete.useMutation({
    onSuccess: () => {
      utils.works.list.invalidate();
      utils.collections.list.invalidate();
    },
  });

  const collections = collectionsData?.collections || [];
  const works = worksData?.works || [];
  const loading = collectionsLoading || worksLoading;

  const handleCollectionUpdate = async (updatedCollection: Collection) => {
    try {
      await updateCollectionMutation.mutateAsync({
        id: updatedCollection.id,
        name: updatedCollection.name,
        description: updatedCollection.description,
        curatorNote: updatedCollection.curatorNote,
      });
    } catch (error) {
      console.error("Error updating collection:", error);
    }
  };

  const handleWorkUpdate = async (updatedWork: Work) => {
    try {
      await updateWorkMutation.mutateAsync({
        id: updatedWork.id,
        title: updatedWork.title,
        artist: updatedWork.artist,
        date: updatedWork.date,
        medium: updatedWork.medium,
        dimensions: updatedWork.dimensions,
        description: updatedWork.description,
        narrative: updatedWork.narrative,
        provenance: updatedWork.provenance,
        exhibition: updatedWork.exhibition,
        relatedObjects: updatedWork.relatedObjects,
        imageUrl: updatedWork.imageUrl,
        thumbnailUrl: updatedWork.thumbnailUrl,
        collectionId: updatedWork.collectionId,
      });
    } catch (error) {
      console.error("Error updating work:", error);
    }
  };

  const handleWorkCreate = async (newWork: Work) => {
    try {
      await createWorkMutation.mutateAsync({
        id: newWork.id,
        title: newWork.title,
        artist: newWork.artist,
        date: newWork.date,
        medium: newWork.medium,
        dimensions: newWork.dimensions,
        description: newWork.description,
        narrative: newWork.narrative,
        provenance: newWork.provenance,
        exhibition: newWork.exhibition,
        relatedObjects: newWork.relatedObjects,
        imageUrl: newWork.imageUrl,
        thumbnailUrl: newWork.thumbnailUrl,
        collectionId: newWork.collectionId,
      });
    } catch (error) {
      console.error("Error creating work:", error);
    }
  };

  const handleWorkDelete = async (workId: string) => {
    try {
      await deleteWorkMutation.mutateAsync({ id: workId });
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
