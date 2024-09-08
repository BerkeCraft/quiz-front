import QuizForm from "@/components/QuizForm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useAuth from "@/hooks/useAuth";
import service from "@/lib/service";
import { Quiz } from "@/lib/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function QuizPage() {
  const { id } = useParams();
  const [data, setData] = useState<Quiz>();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<{
    [questionId: number]: string;
  }>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [edit, setEdit] = useState(false);

  const getData = async () => {
    try {
      const res = await service.get<Quiz>(`/quiz/${id}`);
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

  const handleAnswerChange = (questionId: number, answerText: string) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answerText,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowAnswers(true);
  };

  console.log(data);
  const isMine = data?.userId === auth?.user?.id;

  return (
    <div className="w-full flex items-center justify-center">
      <div className="p-5 max-w-7xl w-full">
        <div>
          {!loading && data && (
            <div className="grid grid-cols-12  gap-5 w-full ">
              <div className="flex col-span-3 max-md:col-span-12 gap-4 flex-col border p-5 shadow-sm rounded-xl h-fit">
                <div className="text-3xl">{data?.title}</div>
                <div className="text-muted-foreground">{data?.description}</div>
                <div className="text-sm text-muted-foreground">
                  Created At : {new Date().toLocaleDateString("en-US")}
                </div>
                {isMine && (
                  <Button
                    onClick={() => {
                      if (isMine) {
                        setEdit(!edit);
                      }
                    }}
                  >
                    {edit ? "Cancel" : "Edit"}
                  </Button>
                )}
              </div>
              <div className="col-span-9 max-md:col-span-12">
                {edit ? (
                  <QuizForm quiz={data} />
                ) : (
                  <form
                    className="flex border rounded-xl flex-col shadow-sm h-full p-5"
                    onSubmit={handleSubmit}
                  >
                    {data.questions.map((question, index) => (
                      <div key={index} className="mb-5">
                        <div className="text-lg">{question.questionText}</div>
                        <RadioGroup
                          value={userAnswers[index] || ""}
                          className="mt-4"
                          onValueChange={(value) =>
                            handleAnswerChange(index, value)
                          }
                        >
                          {question.answers.map((answer, answerIndex) => (
                            <div
                              key={answerIndex}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={answer.text}
                                id={`${index}-${answerIndex}`}
                              />
                              <Label htmlFor={`${index}-${answerIndex}`}>
                                {answer.text}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {showAnswers && (
                          <div
                            className={`mt-2 ${
                              question.answers.find(
                                (a) => a.text === userAnswers[index]
                              )?.isCorrect
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {question.answers.find(
                              (a) => a.text === userAnswers[index]
                            )?.isCorrect
                              ? "Correct!"
                              : "Incorrect"}
                          </div>
                        )}
                      </div>
                    ))}
                    <Button type="submit">Submit</Button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
