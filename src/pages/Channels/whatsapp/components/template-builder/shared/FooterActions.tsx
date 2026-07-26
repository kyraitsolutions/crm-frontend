import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

interface IFooterActionsProps {
  onNext?: () => void;
  onDiscard?: () => void;
  nextLabel?: string;
  submit?: boolean;
  isSubmitting?: boolean;
}

export const FooterActions = ({
  onDiscard,
  onNext,
  nextLabel = "Next",
  submit = false,
  isSubmitting = false,
}: IFooterActionsProps) => {
  return (
    <div className="flex items-center justify-between">
      {onDiscard ? (
        <Button type="button" onClick={onDiscard} className="actions-btn rounded-xl! py-1.5! px-4!">
          Discard
        </Button>
      ) : (
        <span />
      )}
      <Button
        type={submit ? "submit" : "button"}
        onClick={submit ? undefined : onNext}
        disabled={isSubmitting}
        className="rounded-xl! py-1.5! px-4! flex"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            Submitting... <Loader />
          </span>
        ) : (
          nextLabel
        )}
      </Button>
    </div>
  );
};

// import { Button } from "@/components/ui/button";

// interface IFooterActionsProps {
//   onNext: () => void;
//   onDiscard?: () => void;
// }

// export const FooterActions = ({ onDiscard, onNext }: IFooterActionsProps) => {
//   return (
//     <div className="flex items-center justify-between">
//       {onDiscard ? (
//         <Button className="actions-btn px-4! py-2!" onClick={onDiscard}>
//           Discard
//         </Button>
//       ) : (
//         <span />
//       )}
//       <Button onClick={onNext} className="rounded-2xl py-2!">
//         Next
//       </Button>
//     </div>
//   );
// };
