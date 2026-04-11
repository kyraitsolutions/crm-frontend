import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const CreateTeamMemberModal = ({ onCreate }: { onCreate: () => void }) => {
  return (
    <div className="flex w-full justify-center items-center h-[75vh]">
      <div className="flex flex-col max-w-xl w-full items-center gap-6 p-10 text-center rounded-2xl border border-dashed border-gray-300">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Plus className="h-8 w-8 text-primary" />
        </div>

        <div>
          <h2 className="text-xl font-medium">No team members found</h2>
          <p className="mt-2 text-sm text-gray-500">
            Add team members to start managing your team.
          </p>
        </div>

        <Button onClick={onCreate}>
          <Plus size={16} /> Create New User
        </Button>
      </div>
    </div>
  );
};

export default CreateTeamMemberModal;
