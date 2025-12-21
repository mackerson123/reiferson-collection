"use client";

import { CollectionEditor } from "../../components/admin/collection-editor";
import { WorkEditor } from "../../components/admin/work-editor";
import { trpc } from "../../lib/trpc/client";
import { Collection, Work } from "../../lib/types";
import { useState } from "react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"collections" | "works">("collections");
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

  const deleteCollectionMutation = trpc.collections.delete.useMutation({
    onSuccess: () => {
      utils.collections.list.invalidate();
      utils.works.list.invalidate();
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

  const handleCollectionDelete = async (collectionId: string) => {
    try {
      await deleteCollectionMutation.mutateAsync({ id: collectionId });
    } catch (error) {
      console.error("Error deleting collection:", error);
      alert("Failed to delete collection. Please try again.");
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
        <p className="text-navigation tracking-[0.05em] opacity-60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-black/10 rounded-sm p-6">
          <div className="text-utility tracking-[0.05em] opacity-60 mb-2">
            Collections
          </div>
          <div className="text-content-title font-semibold">
            {collections.length}
          </div>
        </div>
        
        <div className="bg-white border border-black/10 rounded-sm p-6">
          <div className="text-utility tracking-[0.05em] opacity-60 mb-2">
            Total Works
          </div>
          <div className="text-content-title font-semibold">
            {works.length}
          </div>
        </div>
      </div>

      <div className="border-b border-black/10">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("collections")}
            className={`py-4 text-navigation tracking-[0.05em] font-medium whitespace-nowrap relative transition-colors cursor-pointer ${
              activeTab === "collections"
                ? "text-black"
                : "text-black/60 hover:text-black/80"
            }`}
          >
            Collections ({collections.length})
            {activeTab === "collections" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("works")}
            className={`py-4 text-navigation tracking-[0.05em] font-medium whitespace-nowrap relative transition-colors cursor-pointer ${
              activeTab === "works"
                ? "text-black"
                : "text-black/60 hover:text-black/80"
            }`}
          >
            Works ({works.length})
            {activeTab === "works" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
            )}
          </button>
        </div>
      </div>

      <div className="pt-4">
        {activeTab === "collections" ? (
          <CollectionEditor
            collections={collections}
            onUpdate={handleCollectionUpdate}
            onDelete={handleCollectionDelete}
          />
        ) : (
          <WorkEditor
            works={works}
            collections={collections}
            onUpdate={handleWorkUpdate}
            onCreate={handleWorkCreate}
            onDelete={handleWorkDelete}
          />
        )}
      </div>
    </div>
  );
}
