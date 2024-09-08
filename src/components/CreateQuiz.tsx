"use client";
import { Icons } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import service from "@/lib/service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

function CreateQuiz() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const formSchema = z.object({
    title: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(50, { message: "Name must be at most 50 characters long" }),

    description: z
      .string()
      .min(10, {
        message: "Description must be at least 10 characters long",
      })
      .max(160, {
        message: "Description must be at most 160 characters long",
      })
      .optional(),
  });

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { mutate: createMenu, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      service.post("/quiz/create-quiz", {
        title: values.title,
        description: values.description,
      }),
    onSuccess: (data) => {
      const id = data?.data?.id;
      if (id) {
        toast({
          title: "Quiz created",
          description: "You have successfully created a new quiz.",
        });
        navigate(`/dashboard/quiz/${id}`);
      } else {
        toast({
          title: "Error",
          description: "An error occurred while creating the quiz.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "An error occurred while creating the menu.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setOpen(false);
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <span className="max-md:hidden">Create Quiz</span>
          <span className="md:hidden">
            <PlusIcon className="h-5 w-5" />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create a new quiz</DialogTitle>
          <DialogDescription>
            Fill in the form below to create a new quiz.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              createMenu(values);
            })}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="title"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Lorem ipsum dolor sit amet.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Lorem ipsum dolor sit amet.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert className="">
              <Sparkles className="h-4 w-4" />
              <AlertTitle>Try the Examples</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                You can start with a pre-built example to get a feel for how
                things work.
              </AlertDescription>
            </Alert>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Icons.spinner className="h-5 w-5 animate-spin" />
              ) : (
                "Create Menu"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateQuiz;
