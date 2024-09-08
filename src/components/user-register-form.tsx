"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form as HookForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
// import useAuth from "@/hooks/useAuth";
import { isLocal } from "@/lib/env";
import service from "@/lib/service";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

export default function Form({ className, ...props }: UserAuthFormProps) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const formSchema = z.object({
    email: z.string(),
    name: z.string(),
    password: z.string(),
  });
  const defaultValues = isLocal ? { email: "", password: "", name: "" } : {};
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { email, password, name } = values;
      if (!email || !password || !name) return;
      setLoading(true);
      const { data } = await service.post("/user/register", {
        email,
        name,
        password,
        confirm: password,
      });
      if (data.name) {
        toast({
          title: "Account created",
          description: "You can now login",
        });
        navigate("/login");
      }
    } catch (err) {
      toast({
        title: "Something went wraong",
        description: "Check your password or email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      form.reset(defaultValues);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <HookForm {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="mail@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading || !form.formState.isValid}>
            {loading && <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />}{" "}
            Register
          </Button>
        </form>
      </HookForm>
    </div>
  );
}
