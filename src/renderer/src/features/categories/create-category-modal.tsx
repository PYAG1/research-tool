import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form";

import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@renderer/components/ui/input";
import ColorPicker from "@renderer/components/ui/color-picker";
import { CreateCategorySchemaType } from "@renderer/lib";
import { Textarea } from "@renderer/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategoryMutation } from "@renderer/services/category";
import { toast } from "sonner";
import { queryKey } from "@renderer/constants";

export default function CreateCategoryModal() {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: CreateCategoryMutation,
  });
  const form = useForm<CreateCategorySchemaType>({
    defaultValues: {
      name: "",
      color: "",
      description: "",
    },
  });

  const onSubmit: SubmitHandler<CreateCategorySchemaType> = async (data) => {
    toast.promise(mutateAsync(data), {
      loading: "Creating category...",
      success: () => {
        form.reset();
        queryClient.invalidateQueries({ queryKey: [queryKey.categories] });
        return "Category created successfully!";
      },
      error: (err) => {
        console.error(err);
        return "Failed to create category";
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className=" text-left  text-sm font-semibold">
          New Category
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new Category</DialogTitle>
          <DialogDescription>
            Create custom categories to organize your content efficiently. Add a
            color to make your categories visually distinct.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. Space" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorPicker
                      color={field?.value ?? ""}
                      onChange={field?.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Color is just for customization.
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button isLoading={isPending} type="submit">
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
