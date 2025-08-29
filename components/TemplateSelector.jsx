"use client"

import React from "react"
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
          <SelectItem value="template1">Template 1</SelectItem>
          <SelectItem value="template2">Template 2</SelectItem>
          <SelectItem value="template3">Template 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
