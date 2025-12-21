import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface Settings {
  id: string;
  aboutTitle: string;
  aboutContent: string;
  updatedAt: Date;
}

interface SettingsEditorProps {
  settings: Settings;
  onUpdate: (settings: {
    aboutTitle: string;
    aboutContent: string;
  }) => Promise<void>;
}

export function SettingsEditor({ settings, onUpdate }: SettingsEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    aboutTitle: settings.aboutTitle,
    aboutContent: settings.aboutContent,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData({
      aboutTitle: settings.aboutTitle,
      aboutContent: settings.aboutContent,
    });
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      aboutTitle: settings.aboutTitle,
      aboutContent: settings.aboutContent,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-black/10 rounded-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-content-title font-semibold tracking-[0.05em] mb-1">
              About Page Settings
            </h2>
            <p className="text-utility tracking-[0.05em] opacity-60">
              Edit the content displayed on the About page
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="border border-black/10 px-4 py-2 text-navigation tracking-[0.05em] font-medium rounded-sm admin-btn-secondary hover:bg-gray-50"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
                Page Title *
              </Label>
              <Input
                value={formData.aboutTitle}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    aboutTitle: e.target.value,
                  }))
                }
                placeholder="The Reiferson Collection"
                className="bg-white border-black/10 text-navigation tracking-[0.05em]"
              />
            </div>

            <div>
              <Label className="text-utility tracking-[0.05em] opacity-60 mb-1 block">
                Page Content *
              </Label>
              <Textarea
                value={formData.aboutContent}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    aboutContent: e.target.value,
                  }))
                }
                placeholder="Enter the about page content. Use double line breaks to separate paragraphs."
                rows={15}
                className="bg-white border-black/10 text-navigation tracking-[0.05em] leading-relaxed"
              />
              <p className="text-xs tracking-[0.05em] opacity-60 mt-2">
                Tip: Separate paragraphs with a blank line (double Enter)
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                disabled={
                  isSaving || !formData.aboutTitle || !formData.aboutContent
                }
                className="bg-black text-white hover:bg-black/90 tracking-[0.05em]"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={isSaving}
                className="tracking-[0.05em]"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-utility tracking-[0.05em] opacity-60 mb-1">
                Page Title
              </div>
              <p className="text-navigation tracking-[0.05em]">
                {settings.aboutTitle}
              </p>
            </div>

            <div>
              <div className="text-utility tracking-[0.05em] opacity-60 mb-1">
                Page Content
              </div>
              <div className="text-navigation tracking-[0.05em] space-y-3">
                {settings.aboutContent.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="text-utility tracking-[0.05em] opacity-40 pt-2">
              Last updated:{" "}
              {new Date(settings.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
