"use client";

import { CollectionEditor } from "../../components/admin/collection-editor";
import { WorkEditor } from "../../components/admin/work-editor";
import { trpc } from "../../lib/trpc/client";
import { Collection, Work } from "../../lib/types";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"collections" | "works">(
    "collections"
  );
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [collectionToPublish, setCollectionToPublish] = useState<string | null>(
    null
  );
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

  const createCollectionMutation = trpc.collections.create.useMutation({
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

  const toggleCollectionPublishMutation =
    trpc.collections.togglePublish.useMutation({
      onSuccess: () => {
        utils.collections.list.invalidate();
      },
    });

  const toggleWorkPublishMutation = trpc.works.togglePublish.useMutation({
    onSuccess: () => {
      utils.works.list.invalidate();
      utils.collections.list.invalidate();
    },
  });

  const collections = collectionsData?.collections || [];
  const works = worksData?.works || [];
  const loading = collectionsLoading || worksLoading;

  const publishedCollections = collections.filter(
    (c) => c.isPublished !== false
  );
  const draftCollections = collections.filter((c) => c.isPublished === false);
  const publishedWorks = works.filter((w) => w.isPublished !== false);
  const draftWorks = works.filter((w) => w.isPublished === false);

  const handleCollectionCreate = async (
    newCollection: Omit<Collection, "works">
  ) => {
    try {
      await createCollectionMutation.mutateAsync({
        id: newCollection.id,
        name: newCollection.name,
        description: newCollection.description,
        curatorNote: newCollection.curatorNote,
        isPublished: newCollection.isPublished,
      });
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  const handleCollectionUpdate = async (updatedCollection: Collection) => {
    try {
      await updateCollectionMutation.mutateAsync({
        id: updatedCollection.id,
        name: updatedCollection.name,
        description: updatedCollection.description,
        curatorNote: updatedCollection.curatorNote,
        isPublished: updatedCollection.isPublished,
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
        isPublished: updatedWork.isPublished,
      });
    } catch (error) {
      console.error("Error updating work:", error);
    }
  };

  const handleWorkCreate = async (newWork: Work) => {
    if (!newWork.collectionId) {
      console.error("Cannot create work without a collection");
      return;
    }
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
        isPublished: newWork.isPublished,
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

  const handleCollectionTogglePublish = async (collectionId: string) => {
    // Find the collection to check its current status
    const collection = collections.find((c) => c.id === collectionId);

    // If it's currently a draft (not published) and has works, show the dialog
    if (collection && !collection.isPublished && collection.works.length > 0) {
      setCollectionToPublish(collectionId);
      setPublishDialogOpen(true);
    } else {
      // Otherwise, just toggle normally
      try {
        await toggleCollectionPublishMutation.mutateAsync({ id: collectionId });
      } catch (error) {
        console.error("Error toggling collection publish status:", error);
      }
    }
  };

  const handleConfirmPublish = async (publishWorks: boolean) => {
    if (!collectionToPublish) return;

    try {
      await toggleCollectionPublishMutation.mutateAsync({
        id: collectionToPublish,
        publishWorks,
      });
      setPublishDialogOpen(false);
      setCollectionToPublish(null);
    } catch (error) {
      console.error("Error publishing collection:", error);
    }
  };

  const handleWorkTogglePublish = async (workId: string) => {
    try {
      await toggleWorkPublishMutation.mutateAsync({ id: workId });
    } catch (error) {
      console.error("Error toggling work publish status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-navigation tracking-[0.05em] opacity-60">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white border border-black/10 rounded-sm p-4 md:p-6">
          <div className="text-utility tracking-[0.05em] opacity-60 mb-2">
            Collections
          </div>
          <div className="text-content-title font-semibold">
            {publishedCollections.length}
            {draftCollections.length > 0 && (
              <span className="text-sm font-normal text-amber-600 ml-2">
                +{draftCollections.length} draft
              </span>
            )}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-sm p-4 md:p-6">
          <div className="text-utility tracking-[0.05em] opacity-60 mb-2">
            Works
          </div>
          <div className="text-content-title font-semibold">
            {publishedWorks.length}
            {draftWorks.length > 0 && (
              <span className="text-sm font-normal text-amber-600 ml-2">
                +{draftWorks.length} draft
              </span>
            )}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 md:p-6">
          <div className="text-utility tracking-[0.05em] text-amber-700 mb-2">
            Draft Collections
          </div>
          <div className="text-content-title font-semibold text-amber-800">
            {draftCollections.length}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 md:p-6">
          <div className="text-utility tracking-[0.05em] text-amber-700 mb-2">
            Draft Works
          </div>
          <div className="text-content-title font-semibold text-amber-800">
            {draftWorks.length}
          </div>
        </div>
      </div>

      <div className="border-b border-black/10">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("collections")}
            className={`py-4 text-navigation tracking-[0.05em] font-medium whitespace-nowrap relative admin-filter-pill ${
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
            className={`py-4 text-navigation tracking-[0.05em] font-medium whitespace-nowrap relative admin-filter-pill ${
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
            onCreate={handleCollectionCreate}
            onUpdate={handleCollectionUpdate}
            onDelete={handleCollectionDelete}
            onTogglePublish={handleCollectionTogglePublish}
          />
        ) : (
          <WorkEditor
            works={works}
            collections={collections}
            onUpdate={handleWorkUpdate}
            onCreate={handleWorkCreate}
            onDelete={handleWorkDelete}
            onTogglePublish={handleWorkTogglePublish}
          />
        )}
      </div>

      <Dialog
        open={publishDialogOpen}
        onOpenChange={(open) => {
          setPublishDialogOpen(open);
          if (!open) {
            setCollectionToPublish(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-content-title tracking-[0.05em]">
              Publish collection
            </DialogTitle>
            <DialogDescription className="text-navigation tracking-[0.05em]">
              Would you like to publish all works in this collection as well?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => handleConfirmPublish(false)}
                variant="outline"
                className="tracking-[0.05em] flex-1"
              >
                Publish collection only
              </Button>
              <Button
                onClick={() => handleConfirmPublish(true)}
                className="tracking-[0.05em] bg-black text-white hover:bg-black/90 flex-1"
              >
                Publish collection + all works
              </Button>
            </div>
            <Button
              onClick={() => setPublishDialogOpen(false)}
              variant="outline"
              className="tracking-[0.05em] w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
