"use client"

import React from "react"
import { templateList } from "@/components/template"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TemplateSelector({ selectedTemplate, setSelectedTemplate }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Choose Template</label>
      <Select
        value={selectedTemplate}
        onValueChange={setSelectedTemplate}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          {templateList.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
