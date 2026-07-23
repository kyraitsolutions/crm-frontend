import { AddButtonAction } from "../ui/buttons/AddButtonAction";
import { ButtonsList } from "../ui/buttons/ButtonList";
// import { ButtonStrategySelector } from "./ButtonStrategySelector";

export const ButtonsEditor = () => {
  return (
    <section className="rounded-xl border border-gray-200 p-4">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-800">Buttons</span>
            <span className="ml-2 text-xs text-gray-400">(Optional)</span>
          </div>

          {/* <button className="text-xs text-blue-600 underline">
            Button Guidelines ↗
          </button> */}
        </div>

        <p className="mb-4 text-xs text-gray-500">
          Add buttons to encourage action. Maximum 10 buttons allowed.
        </p>
      </div>

      <div className="space-y-2">
        {/* <ButtonStrategySelector /> */}
        <ButtonsList />
        <AddButtonAction />
      </div>
    </section>
  );
};
