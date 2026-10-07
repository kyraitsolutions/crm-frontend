import { AddButtonAction } from "../ui/buttons/AddButtonAction";
import { ButtonsList } from "../ui/buttons/ButtonList";
import { FormButtonsProvider } from "../ui/buttons/buttons-field.context";

export const ButtonsEditor = () => {
  return (
    <FormButtonsProvider>
      <section className="rounded-2xl border border-gray-200 px-5 py-3">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-gray-800">
                Buttons
              </span>
              <span className="ml-2 text-xs text-gray-400">(Optional)</span>
            </div>
          </div>

          <p className="mb-4 text-xs text-gray-500">
            Add buttons to encourage action. Maximum 10 buttons allowed.
          </p>
        </div>

        <div className="space-y-2">
          <ButtonsList />
          <AddButtonAction />
        </div>
      </section>
    </FormButtonsProvider>
  );
};
