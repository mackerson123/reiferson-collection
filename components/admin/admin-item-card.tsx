import { Edit3, Trash2, Eye, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface AdminItemCardProps {
  title: string;
  subtitle?: React.ReactNode;
  isEditing: boolean;
  isPublished?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish?: () => void;
  editForm: React.ReactNode;
  children: React.ReactNode;
}

export function AdminItemCard({
  title,
  subtitle,
  isEditing,
  isPublished = true,
  onEdit,
  onDelete,
  onTogglePublish,
  editForm,
  children,
}: AdminItemCardProps) {
  return (
    <div
      className={`bg-white border rounded-sm p-6 ${
        isPublished ? "border-black/10" : "border-amber-400/50 bg-amber-50/30"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-navigation font-semibold tracking-[0.05em]">
                {title}
              </h3>
              {!isPublished && (
                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium tracking-[0.05em]">
                  Draft
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-utility tracking-[0.05em] opacity-60 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {onTogglePublish && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onTogglePublish}
                  disabled={isEditing}
                  className={`p-2 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    isPublished
                      ? "text-green-700 hover:text-green-900"
                      : "text-amber-600 hover:text-amber-800"
                  }`}
                >
                  {isPublished ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black text-white">
                {isPublished ? "Change to draft" : "Publish to site"}
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onEdit}
                disabled={isEditing}
                className="p-2 hover:opacity-60 opacity-60 transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black text-white">
              Edit details
            </TooltipContent>
          </Tooltip>
          {!isEditing && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onDelete}
                  className="p-2 hover:opacity-80 transition-opacity cursor-pointer text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black text-white">
                Delete permanently
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {isEditing ? editForm : <div className="space-y-3">{children}</div>}
    </div>
  );
}
