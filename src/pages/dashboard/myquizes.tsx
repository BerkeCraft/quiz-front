import service from "@/lib/service";
import { useEffect, useState } from "react";
import { CardSkeleton, QuizCard } from "./all";

interface QuizType {
  id: string;
  title: string;
  description: string;
}
function MyQuizes() {
  const [data, setData] = useState<QuizType[]>();
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    try {
      const res = await service.get("/quiz/get-my-quiz?page=1&limit=100");
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
          {(loading ? Array(5).fill({}) : data)?.map((object, idx) => {
            return object.id ? (
              <QuizCard key={"quiz-" + object.title + idx} quiz={object} />
            ) : (
              <CardSkeleton key={"skel-" + object.title + idx} />
            );
          })}
        </div>
        {data && data.length === 0 && (
          <div className="text-muted-foreground  w-full">
            <p className="">You don't have any quizzes yet</p>
            <p>You can create a quiz by clicking on the "Create Quiz" button</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyQuizes;
