// components/resume-form/SettingsSection.tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResumeData } from "@/types/resume"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

export default function SettingsSection({
  resumeData,
  handleChange,
}: {
  resumeData: ResumeData
  handleChange: (field: keyof ResumeData, value: any) => void
}) {
  const settings = resumeData.settings || {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="font">Font</Label>
          <select
            id="font"
            value={settings.font || "Roboto"}
            onChange={(e) =>
              handleChange("settings", { ...settings, font: e.target.value })
            }
            className="w-full border rounded-md p-2"
          >
            {[
              "Roboto",
              "Lato",
              "Montserrat",
              "Open Sans",
              "Raleway",
              "Lora",
              "Merriweather",
              "Playfair Display",
            ].map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontSize">Font Size</Label>
          <select
            id="fontSize"
            value={settings.fontSize || "Standard"}
            onChange={(e) =>
              handleChange("settings", {
                ...settings,
                fontSize: e.target.value,
              })
            }
            className="w-full border rounded-md p-2"
          >
            <option value="Compact">Compact</option>
            <option value="Standard">Standard</option>
            <option value="Large">Large</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="themeColor">Theme Color</Label>
          <Input
            id="themeColor"
            type="color"
            value={settings.themeColor || "#000000"}
            onChange={(e) =>
              handleChange("settings", {
                ...settings,
                themeColor: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentSize">Document Size</Label>
          <select
            id="documentSize"
            value={settings.documentSize || "A4"}
            onChange={(e) =>
              handleChange("settings", {
                ...settings,
                documentSize: e.target.value,
              })
            }
            className="w-full border rounded-md p-2"
          >
            <option value="A4">A4 (Other countries)</option>
            <option value="Letter">Letter (US, Canada)</option>
          </select>
        </div>
      </CardContent>
    </Card>
  )
}
