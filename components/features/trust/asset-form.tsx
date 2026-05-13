"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetSchema, AssetFormValues } from "@/lib/validations/trust";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface AssetFormProps {
  onSubmit: (values: AssetFormValues) => void;
  onCancel: () => void;
}

export const AssetForm = ({ onSubmit, onCancel }: AssetFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      dateAcquired: new Date().toISOString().split("T")[0],
    },
  });

  const handleFormSubmit = async (data: AssetFormValues) => {
    try {
      await onSubmit(data);
      toast.success("Asset added to registry");
    } catch (error) {
      toast.error("Failed to add asset");
    }
  };

  return (
    <Card className="border-[var(--go)]/30">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-black text-[var(--go)] uppercase tracking-widest">
            Add New Trust Asset
          </h3>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Description"
            placeholder="e.g. 123 Main St (Rental)"
            {...register("description")}
            error={errors.description?.message}
          />
          <Input
            label="Cost Basis ($)"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("costBasis")}
            error={errors.costBasis?.message}
          />
          <Input
            label="COA Code"
            placeholder="e.g. #126"
            {...register("coa")}
            error={errors.coa?.message}
          />
          <Input
            label="Date Acquired"
            type="date"
            {...register("dateAcquired")}
            error={errors.dateAcquired?.message}
          />
          <div className="md:col-span-2">
            <Input
              label="Note Holder / Seller (Optional)"
              placeholder="Name of individual or entity"
              {...register("noteHolder")}
              error={errors.noteHolder?.message}
            />
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Register Asset & Issue Demand Note
          </Button>
          <p className="text-[10px] text-[var(--mt)] text-center mt-3 leading-relaxed uppercase tracking-tighter">
            Note: This action will automatically generate a Bill of Sale and a 
            corresponding Demand Note for the cost basis amount.
          </p>
        </div>
      </form>
    </Card>
  );
};
