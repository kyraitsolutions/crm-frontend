import type { TTemplateComponent } from "../../../types/templates";
import type { TemplateState } from "../../../types/templates/template.type";

type FooterData = Pick<TemplateState, "footerText">;

export function mapFooter(footer: FooterData): TTemplateComponent | null {
  if (!footer.footerText.trim()) {
    return null;
  }

  return {
    type: "FOOTER",
    text: footer.footerText,
  };
}
