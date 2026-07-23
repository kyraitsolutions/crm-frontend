import { Button } from "@/components/ui/button";

interface IFooterActionsProps {
  onNext: () => void;
  onDiscard?: () => void;
  nextLabel?: string;
  isSubmitting?: boolean;
}

export const FooterActions = ({
  onDiscard,
  onNext,
  nextLabel = "Next",
  isSubmitting = false,
}: IFooterActionsProps) => {
  return (
    <div className="flex items-center justify-between">
      {onDiscard ? (
        <Button onClick={onDiscard} className="actions-btn px-4! py-2!">
          Discard
        </Button>
      ) : (
        <span />
      )}
      <Button
        onClick={onNext}
        disabled={isSubmitting}
        className="rounded-xl py-2!"
      >
        {isSubmitting ? "Submitting..." : nextLabel}
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
//       <Button onClick={onNext} className="rounded-xl py-2!">
//         Next
//       </Button>
//     </div>
//   );
// };
