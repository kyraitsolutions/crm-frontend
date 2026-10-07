import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  templateSchema,
  type TemplateForm,
} from "../validations/template.schema";
import { createDefaultAuthentication } from "../utils/template/auth.utils";
import { createDefaultCarousel } from "../utils/template/carousel.utils";

export const useTemplateForm = () => {
  return useForm<TemplateForm>({
    mode: "all",
    resolver: zodResolver(templateSchema),
    defaultValues: {
      templateName: "",
      language: "en_IN",
      category: "Utility",
      templateType: "CUSTOM",

      headerType: "Text",
      headerText: "",
      headerVariables: [],

      bodyText: "",
      bodyVariables: [],

      footerText: "",

      variableType: "Number",

      buttons: [],
      carousel: createDefaultCarousel(),
      authentication: createDefaultAuthentication(),
    },
  });
};
