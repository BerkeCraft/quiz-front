import CreateQuiz from "@/components/CreateQuiz";
import { MainNav } from "@/components/MainNav";
import { UserNav } from "@/components/user-nav";
import { BookXIcon } from "lucide-react";
function Header() {
  return (
    <div className="border-b w-full flex items-center justify-center">
      <div className="flex h-16 p-5 max-w-7xl w-full items-center px-4">
        <BookXIcon className="w-8 h-8 text-primary" />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <CreateQuiz />
          <UserNav />
        </div>
      </div>
    </div>
  );
}

export default Header;
