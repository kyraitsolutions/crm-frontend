import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores";
import { Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useAutomationStore } from "../../store/automation.store";
import AutomationCard from "../cards/AutomationCard";
import EmptyAutomation from "../Empty/EmptyAutomation";
import CreateAutomationStepper from "../stepper/CreateAutomationStepper";
import { ToastMessageService } from "@/services";
import type { ApiError } from "@/types";
import { alertManager } from "@/stores/alert.store";

const AutomationSection: React.FC = () => {
  const toastService = new ToastMessageService();
  const { accountId } = useAuthStore((state) => state);
  const {
    loading,
    automations,
    fetchAutomations,
    isCreating,
    setIsCreating,
    toggleAutomation,
    updateStatus,
    deleteAutomation,
  } = useAutomationStore();

  const handleUpdateStatus = async (
    id: string,
    status: "published" | "draft",
  ) => {
    try {
      const response = await updateStatus(String(accountId), id, status);
      if (response?.status === 200) {
        toastService.success(
          response?.message || "Automation updated successfully!",
        );
      }
    } catch (error) {
      const err = error as ApiError;
      if (err) {
        toastService.error(err.message);
      }
    }
  };

  const handleToggleActiveAndInactive = async (id: string, active: boolean) => {
    try {
      const response = await toggleAutomation(String(accountId), id, active);
      if (response?.status === 200) {
        toastService.success(
          response?.message || "Automation updated successfully!",
        );
      }
    } catch (error) {
      console.log("erro hai kya", error);
      const err = error as ApiError;
      if (err) {
        toastService.error(err.message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    alertManager.show({
      type: "warning",
      title: "Delete Automation",
      message: "Are you sure you want to delete this automation?",
      onConfirm: async () => {
        try {
          const response = await deleteAutomation(String(accountId), id);
          if (response?.status === 200) {
            toastService.success(
              response?.message || "Automation deleted successfully!",
            );
          }
        } catch (error) {
          const err = error as ApiError;
          if (err) {
            toastService.error(err.message);
          }
        }
      },
    });
  };

  useEffect(() => {
    if (!accountId) return;
    fetchAutomations(accountId);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center mt-4">
        <Loader size={25} color="gray" className="border-3" />
      </div>
    );

  if (automations.length === 0) {
    return <EmptyAutomation />;
  }

  return (
    <div className="w-full h-full space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Automations</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {automations.length} automation{automations.length !== 1 ? "s" : ""}{" "}
            configured
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="actions-btn py-2! px-4!"
        >
          <Plus className="size-4" /> Create Automation
        </Button>
      </div>

      {/* Empty state */}

      <div className="space-y-2">
        {automations.map((automation) => (
          <AutomationCard
            key={automation.id}
            automation={automation}
            onToggle={(id, active) => handleToggleActiveAndInactive(id, active)}
            onStatusChange={(id, status) => {
              handleUpdateStatus(id, status);
            }}
            onDelete={(id) => handleDelete(id)}
          />
        ))}
      </div>

      {/* Stepper modal */}
      {isCreating && <CreateAutomationStepper />}
    </div>
  );
};

export default AutomationSection;
