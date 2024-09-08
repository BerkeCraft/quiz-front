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
import useAuth from "@/hooks/useAuth";
import { isLocal } from "@/lib/env";
import service from "@/lib/service";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import * as z from "zod";
interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

export default function Form({ className, ...props }: UserAuthFormProps) {
  // const { login, isLoading, setLoading, stopLoading } = useAuthStore();
  // const auth = useAuth();
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const formSchema = z.object({
    email: z.string(),
    password: z.string(),
  });
  const defaultValues = isLocal ? { email: "", password: "" } : {};
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const from = location.state?.from?.pathname || "/dashboard";
    try {
      const { email, password } = values;
      if (!email || !password) return;
      setLoading(true);
      const { data } = await service.post("/auth/login", {
        username: email,
        password,
      });
      const accessToken = data.access_token;
      console.log(accessToken);
      localStorage.setItem("accessToken", accessToken);
      const { data: userData } = await service.get("/auth/user");
      console.log(userData);
      auth.signin(userData, () => {
        navigate(from, { replace: true });
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Something went wraong",
        description: "Check your password or email",
        variant: "destructive",
      });
      form.resetField("email");
    } finally {
      setLoading(false);
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
            Sign in
          </Button>
        </form>
      </HookForm>
    </div>
  );
}
