"use client"


export default function TemplateSelector({ selectedTemplate, setSelectedTemplate }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Choose Template</label>
      <select
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="template1">Template 1</option>
        <option value="template2">Template 2</option>
        <option value="template3">Template 3</option>
      </select>
    </div>
  );
}
