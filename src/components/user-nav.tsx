import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/useAuth";
import { CogIcon, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserNav() {
  const navigate = useNavigate();
  const { auth, signout } = useAuth();
  const user = auth?.user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative w-8 h-8 rounded-full">
          <Avatar className="w-8 h-8">
            <AvatarImage alt={user?.name} />
            <AvatarFallback className="bg-primary-foreground text-primary">
              {user?.name?.charAt(0).toUpperCase() || "N"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-between">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.name}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            Profile
            <DropdownMenuShortcut>
              <User className="w-3.5 h-3.5" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem disabled>
            Settings
            <DropdownMenuShortcut>
              <CogIcon className="w-3.5 h-3.5" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            signout(() => {
              navigate("/login");
            });
          }}
        >
          Logout
          <DropdownMenuShortcut>
            <LogOut className="w-3.5 h-3.5" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
