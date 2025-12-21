"use client";

import { Edit3, Trash2 } from "lucide-react";

interface AdminItemCardProps {
  title: string;
  subtitle?: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  editForm: React.ReactNode;
  children: React.ReactNode;
}

export function AdminItemCard({
  title,
  subtitle,
  isEditing,
  onEdit,
  onDelete,
  editForm,
  children,
}: AdminItemCardProps) {
  return (
    <div className="bg-white border border-black/10 rounded-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-navigation font-semibold tracking-[0.05em]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-utility tracking-[0.05em] opacity-60 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            disabled={isEditing}
            className="p-2 hover:opacity-60 opacity-60 transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          {!isEditing && (
            <button
              onClick={onDelete}
              className="p-2 hover:opacity-80 transition-opacity cursor-pointer text-red-900"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {isEditing ? editForm : <div className="space-y-3">{children}</div>}
    </div>
  );
}

