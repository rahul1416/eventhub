"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2, Plus } from "lucide-react";
import { Badge } from "./ui/badge";

const eventPricingSchema = z.object({
  standardPrice: z.coerce.number().min(0, "Price cannot be negative"),
  vipPrice: z.coerce.number().min(0, "Price cannot be negative"),
  maxAttendees: z.coerce.number().min(1, "Must allow at least 1 attendee"),
  discountCodes: z.array(
    z.object({
      code: z.string().min(3, "Code must be at least 3 characters"),
      percentage: z.coerce.number().min(1).max(100, "Must be between 1-100%"),
    })
  ),
});

type EventPricingFormValues = z.infer<typeof eventPricingSchema>;

export default function ManageEventModal({
  event,
  isOpen,
  onClose,
}: {
  event: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<EventPricingFormValues>({
    resolver: zodResolver(eventPricingSchema),
    defaultValues: {
      standardPrice: event.standardPrice || 0,
      vipPrice: event.vipPrice || 0,
      maxAttendees: event.maxAttendees || 100,
      discountCodes: event.discountCodes || [],
    },
  });

  // Update form values when event changes
  useEffect(() => {
    if (event) {
      form.reset({
        standardPrice: event.standardPrice || 0,
        vipPrice: event.vipPrice || 0,
        maxAttendees: event.maxAttendees || 100,
        discountCodes: event.discountCodes || [],
      });
    }
  }, [event, form]);

  const addDiscountCode = () => {
    const currentCodes = form.getValues("discountCodes") || [];
    form.setValue("discountCodes", [
      ...currentCodes,
      { code: "", percentage: 10 },
    ]);
  };

  const removeDiscountCode = (index: number) => {
    const currentCodes = form.getValues("discountCodes") || [];
    form.setValue(
      "discountCodes",
      currentCodes.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: EventPricingFormValues) => {
    setIsSaving(true);
    try {
      // Save the data to the event in the database
      const response = await fetch(`/api/events/${event._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      // Close the modal after successful save
      onClose();
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Event: {event?.title}</DialogTitle>
          <DialogDescription>
            Configure pricing, capacity and discount codes for this event.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="standardPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standard Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" step="0.01" />
                    </FormControl>
                    <FormDescription>
                      Price for standard tickets
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vipPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIP Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" step="0.01" />
                    </FormControl>
                    <FormDescription>Price for VIP tickets</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maxAttendees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Attendees</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min="1" />
                  </FormControl>
                  <FormDescription>
                    Set the maximum capacity for this event
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Discount Codes</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDiscountCode}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Code
                </Button>
              </div>

              {form.watch("discountCodes")?.map((_, index) => (
                <div
                  key={index}
                  className="flex items-end gap-2 border p-3 rounded-md"
                >
                  <FormField
                    control={form.control}
                    name={`discountCodes.${index}.code`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Discount Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="SUMMER2023" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`discountCodes.${index}.percentage`}
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <FormLabel>Discount %</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="1" max="100" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDiscountCode(index)}
                    className="mb-2"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}

              {(!form.watch("discountCodes") ||
                form.watch("discountCodes").length === 0) && (
                <p className="text-sm text-muted-foreground py-2">
                  No discount codes added yet
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
