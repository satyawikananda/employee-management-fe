"use client"

import { useState, useCallback, useRef } from "react"
import { UploadCloud, FileText, X } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AppProgressIndicator } from "@/components/base/app-progress-indicator"
import useEmployeeServices from "@/lib/api/employee/use-employee.api"

interface EmployeeBulkImportDialogProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EmployeeBulkImportDialog({
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: EmployeeBulkImportDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = (value: boolean) => {
    if (isControlled) {
      setControlledOpen?.(value)
    } else {
      setInternalOpen(value)
    }
  }

  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [progress, setProgress] = useState(0)

  const { useBulkUploadEmployee } = useEmployeeServices()
  const { mutate: bulkUpload, isPending: isUploading } = useBulkUploadEmployee()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile)
      } else {
        toast.error("Please upload a CSV file")
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile)
      } else {
        toast.error("Please upload a CSV file")
      }
    }
  }

  const handleRemoveFile = () => {
    if (!isUploading) {
      setFile(null)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
      setProgress(0)
    }
  }

  const handleSubmit = () => {
    if (!file) return

    bulkUpload(
      {
        file,
        onProgress: (percent) => setProgress(percent)
      },
      {
        onSuccess: () => {
          setOpen(false)
          setFile(null)
          setProgress(0)
        },
      }
    )
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (isUploading && !newOpen) {
      // Prevent closing while uploading
      return
    }
    setOpen(newOpen)
    if (!newOpen) {
      // Reset state on close if not uploading (which shouldn't happen due to check above, but good practice)
      if (!isUploading) {
        setFile(null)
        setProgress(0)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Import Employees</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple employees at once.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!file ? (
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-10 transition-colors hover:bg-muted/50 w-full cursor-pointer",
                dragActive && "border-primary bg-muted/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">
                  Click to select or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  CSV files only (max 10MB)
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                onChange={handleChange}
                className="hidden"
                disabled={isUploading}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium line-clamp-1 max-w-[200px]" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <AppProgressIndicator
                    value={progress}
                    label="Importing employees..."
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!file || isUploading}
          >
            {isUploading ? "Importing..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}