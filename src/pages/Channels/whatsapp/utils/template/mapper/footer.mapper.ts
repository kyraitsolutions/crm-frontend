import type {
  TemplateComponent,
  TemplateState,
} from "../../../types/template.type";

type FooterData = Pick<TemplateState, "footerText">;

export function mapFooter(footer: FooterData): TemplateComponent | null {
  if (!footer.footerText.trim()) {
    return null;
  }

  return {
    type: "FOOTER",
    text: footer.footerText,
  };
}
