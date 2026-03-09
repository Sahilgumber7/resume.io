import Template1 from "./template1";
import Template2 from "./template2";
import Template3 from "./template3";

export const DEFAULT_TEMPLATE_ID = "template1";

export const templateList = [
  { id: "template1", label: "Template 1", component: Template1 },
  { id: "template2", label: "Template 2", component: Template2 },
  { id: "template3", label: "Template 3", component: Template3 },
];

export const templates = {
  [DEFAULT_TEMPLATE_ID]: templateList[0].component,
  template2: templateList[1].component,
  template3: templateList[2].component,
};
