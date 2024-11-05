"use client"

import * as React from "react"
import { Check, ChevronsUpDown, FileIcon } from "lucide-react"
import { useQuery } from "convex/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"

interface ParentSelectorProps {
  value?: Id<"documents">
  onChange: (value: Id<"documents"> | undefined) => void
  currentDocumentId?: Id<"documents">
}

export function ParentSelector({ 
  value, 
  onChange,
  currentDocumentId 
}: ParentSelectorProps) {
  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: undefined // Get root level documents
  }) as Doc<"documents">[] | undefined
  
  const [open, setOpen] = React.useState(false)

  // Filter out the current document and its children to prevent circular references
  const availableDocuments = documents?.filter((doc: Doc<"documents">) => 
    doc._id !== currentDocumentId && 
    doc.parentDocument !== currentDocumentId
  ) || []

  const selectedDocument = documents?.find((doc: Doc<"documents">) => doc._id === value)

  const onSelect = (documentId: string) => {
    const isCurrentlySelected = value === documentId
    if (isCurrentlySelected) {
      onChange(undefined)
    } else {
      onChange(documentId as Id<"documents">)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedDocument ? (
            <span className="flex items-center gap-2">
              <FileIcon className="h-4 w-4" />
              {selectedDocument.title}
            </span>
          ) : (
            "Select parent..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search documents..." />
          <CommandList>
            <CommandEmpty>No documents found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="root"
                value="root"
                onSelect={() => {
                  onChange(undefined)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    !value ? "opacity-100" : "opacity-0"
                  )}
                />
                Root Level
              </CommandItem>
              {availableDocuments.map((document: Doc<"documents">) => (
                <CommandItem
                  key={document._id}
                  value={document._id}
                  onSelect={() => onSelect(document._id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === document._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4" />
                    {document.title}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
