"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface ErrorInfo {
  message: string;
  details?: string;
  timestamp: Date;
}

class ErrorManager {
  private errors: ErrorInfo[] = [];
  private listeners: Set<(errors: ErrorInfo[]) => void> = new Set();

  addError(error: unknown) {
    const errorInfo: ErrorInfo = {
      message:
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "An unknown error occurred",
      details:
        error instanceof Error
          ? error.stack || error.toString()
          : typeof error === "object" && error !== null
          ? JSON.stringify(error, null, 2)
          : undefined,
      timestamp: new Date(),
    };

    this.errors.push(errorInfo);
    this.notifyListeners();
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
    this.notifyListeners();
  }

  subscribe(listener: (errors: ErrorInfo[]) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const errors = this.getErrors();
    this.listeners.forEach((listener) => listener(errors));
  }
}

const errorManager = new ErrorManager();

export function addError(error: unknown) {
  errorManager.addError(error);
}

function useErrorQueue() {
  const [errors, setErrors] = useState<ErrorInfo[]>(() =>
    errorManager.getErrors()
  );

  useEffect(() => {
    const unsubscribe = errorManager.subscribe((newErrors) => {
      setErrors(newErrors);
    });

    return unsubscribe;
  }, []);

  return errors;
}

export function ErrorModal() {
  const errors = useErrorQueue();
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (errors.length > 0) {
      setIsOpen(true);
      setCurrentErrorIndex(errors.length - 1);
    } else {
      setIsOpen(false);
    }
  }, [errors.length]);

  const currentError = errors[currentErrorIndex];
  const hasMultipleErrors = errors.length > 1;

  const handleClose = () => {
    setIsOpen(false);
    errorManager.clearErrors();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentErrorIndex > 0) {
      setCurrentErrorIndex(currentErrorIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentErrorIndex < errors.length - 1) {
      setCurrentErrorIndex(currentErrorIndex + 1);
    }
  };

  if (!currentError) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-content-title tracking-[0.05em]">
            Error
          </DialogTitle>
          <DialogDescription className="text-navigation tracking-[0.05em]">
            {hasMultipleErrors
              ? `Error ${currentErrorIndex + 1} of ${errors.length}`
              : "An error occurred"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          <div>
            <div className="text-utility tracking-[0.05em] opacity-60 mb-2">
              Message
            </div>
            <div className="text-navigation tracking-[0.05em] bg-red-50 border border-red-200 rounded-sm p-3 font-mono text-sm">
              {currentError.message}
            </div>
          </div>

          {currentError.details && (
            <div>
              <div className="text-utility tracking-[0.05em] opacity-60 mb-2">
                Details
              </div>
              <pre className="text-navigation tracking-[0.05em] bg-black/5 border border-black/10 rounded-sm p-3 overflow-x-auto text-xs font-mono max-h-64 overflow-y-auto">
                {currentError.details}
              </pre>
            </div>
          )}

          <div>
            <div className="text-utility tracking-[0.05em] opacity-60 mb-2">
              Timestamp
            </div>
            <div className="text-navigation tracking-[0.05em] text-sm opacity-60">
              {currentError.timestamp.toLocaleString()}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {hasMultipleErrors && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handlePrevious}
                disabled={currentErrorIndex === 0}
                variant="outline"
                className="tracking-[0.05em] flex-1 sm:flex-none"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentErrorIndex === errors.length - 1}
                variant="outline"
                className="tracking-[0.05em] flex-1 sm:flex-none"
              >
                Next
              </Button>
            </div>
          )}
          <Button
            onClick={handleClose}
            className="tracking-[0.05em] bg-black text-white hover:bg-black/90 flex-1 sm:flex-none"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

