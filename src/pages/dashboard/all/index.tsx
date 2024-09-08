import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import service from "@/lib/service";
import { Edit, EllipsisVertical, TrashIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface QuizType {
  id: string;
  title: string;
  description: string;
  user: {
    name: string;
    email: string;
    id: string;
  };
}
function AllQuizzesPage() {
  const [data, setData] = useState<QuizType[]>();
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    try {
      const res = await service.get("/quiz/getAll?page=1&limit=100");
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="p-5 max-w-7xl w-full">
        <div className="lg:grid-cols-4 grid-cols-1 md:grid-cols-2 grid gap-3 w-full">
          {(loading ? Array(5).fill({}) : data)?.map((object) => {
            return object.id ? <QuizCard quiz={object} /> : <CardSkeleton />;
          })}
        </div>
        <div className="text-muted-foreground"></div>
      </div>
    </div>
  );
}

export const QuizCard = ({ quiz }: { quiz: QuizType }) => {
  const { auth } = useAuth();
  const isMine = String(quiz?.user?.id) === String(auth?.user?.id);
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => {
        navigate("/dashboard/quiz/" + quiz.id);
      }}
      className="p-3 hover:bg-muted cursor-pointer"
    >
      <div className="flex flex-col gap-4">
        <div>
          <div className="font-medium text-lg">{quiz.title}</div>
          <div className="text-sm text-muted-foreground">
            {quiz.description}
          </div>
        </div>
        <div className="flex items-center gap-2 justify-between">
          {quiz.user && (
            <div className="flex gap-2 items-center">
              <div className="border rounded-full p-2">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="text-sm text-muted-foreground">
                <div>{quiz?.user && quiz.user.name}</div>
                <div className="text-xs">{quiz.user && quiz.user.email}</div>
              </div>
            </div>
          )}

          <div className="flex gap-1">
            {/* <Link to={"/dashboard/quiz/" + quiz.id}>
              <Button size={"sm"} className="w-fit">
                View
              </Button>
            </Link> */}
            {isMine && (
              <div onClick={(e) => e.stopPropagation()}>
                <QuizCardActions id={quiz.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
export const CardSkeleton = () => {
  return (
    <div className="p-3 border animate-pulse bg-muted cursor-pointer">
      <div className="flex flex-col gap-4">
        <div>
          <div className="font-medium text-lg animate-pulse bg-gray-300 h-6 w-3/4 rounded"></div>
          <div className="text-sm bg-gray-200  animate-pulse h-4 w-full mt-2 rounded"></div>
        </div>
        <div className="self-end w-fit">
          <div className="bg-gray-300 animate-pulse h-8 w-16 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default AllQuizzesPage;

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export function QuizCardActions({ id }: { id: string }) {
  const [deleteoOpen, setDeleteOpen] = useState(false);
  return (
    <>
      <DeleteDialog id={+id} open={deleteoOpen} setOpen={setDeleteOpen} />
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setDeleteOpen(true);
              }}
            >
              <div className="w-full h-full flex items-center">
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </div>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>
    </>
  );
}

import { Icons } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const DeleteDialog = ({
  id,
  open,
  setOpen,
}: {
  id: number;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const deleteQuiz = async () => {
    console.log(id);
    setLoading(true);
    service
      .delete(`/quiz/${id}`)
      .then(() => {
        setOpen(false);
        setLoading(false);
        toast({
          title: "Success",
          description: "Quiz deleted successfully",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to delete quiz",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this quiz?</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum,
            consequuntur.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteQuiz();
            }}
            disabled={loading}
          >
            {loading && <Icons.spinner className="animate-spin mr-2 w-5 h-5" />}
            Delete
          </Button>
          <Button variant={"outline"}>Cancel </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
