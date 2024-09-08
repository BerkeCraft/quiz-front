import service from "@/lib/service";
import { Quiz } from "@/lib/types";
import { Copy, XIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { Icons } from "./icons";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  answers: Answer[];
}

interface QuizFormValues {
  questions: Question[];
}

const QuizForm = ({ quiz }: { quiz: Quiz }) => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const { control, register, formState, watch } = useForm<QuizFormValues>({
    defaultValues:
      quiz.questions.length > 0
        ? {
            questions: quiz.questions,
          }
        : {
            questions: [
              { questionText: "", answers: [{ text: "", isCorrect: false }] },
            ],
          },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });
  const { toast } = useToast();

  const questions = watch("questions");
  const allQuestionsFilled = questions.every(
    (question: Question) => question.questionText.trim() !== ""
  );

  return (
    <form className="space-y-4">
      {questionFields.map((question, questionIndex) => {
        const answers = watch(`questions.${questionIndex}.answers`);
        const allAnswersFilled = answers.every(
          (answer: Answer) => answer.text.trim() !== ""
        );

        return (
          <div
            key={question.id}
            className="border shadow-sm rounded-lg border-l-blue-500 border-l-4"
          >
            <div className="bg-slate-50 border-b flex justify-between items-center p-3 px-5">
              <span className="font-medium text-lg">
                {questionIndex + 1}. Question
              </span>
              <div>
                <Button
                  variant={"ghost"}
                  type="button"
                  size={"sm"}
                  onClick={() =>
                    //duplicate the question
                    appendQuestion({
                      questionText: question.questionText,
                      answers: question.answers.map((answer) => ({
                        ...answer,
                      })),
                    })
                  }
                >
                  <Copy className="w-5 h-5" />
                </Button>
                <Button
                  variant={"ghost"}
                  type="button"
                  size={"sm"}
                  onClick={() => {
                    if (questionFields.length > 1) {
                      removeQuestion(questionIndex);
                    }
                  }}
                >
                  <XIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex mt-2 gap-2 items-center">
                <Input
                  placeholder="Question text"
                  {...register(`questions.${questionIndex}.questionText`, {
                    required: true,
                  })}
                />
              </div>
            </div>

            <div className="mt-2 border-t">
              <div className="px-5 pt-5 text-muted-foreground">Answers</div>
              <Controller
                control={control}
                name={`questions.${questionIndex}.answers`}
                render={({ field }) => (
                  <>
                    {field.value.map((_: Answer, answerIndex: number) => (
                      <div key={answerIndex} className="p-5">
                        <Badge className="mb-4">Answer {answerIndex + 1}</Badge>
                        <div className="flex gap-2">
                          <Input
                            {...register(
                              `questions.${questionIndex}.answers.${answerIndex}.text`,
                              { required: true }
                            )}
                          />

                          <input
                            type="radio"
                            value={answerIndex}
                            {...register(
                              `questions.${questionIndex}.answers.${answerIndex}.isCorrect`,
                              { required: true }
                            )}
                          />
                          <Button
                            type="button"
                            size={"icon"}
                            variant={"ghost"}
                            onClick={() => {
                              if (field.value.length > 1) {
                                field.onChange(
                                  field.value.filter(
                                    (_, index) => index !== answerIndex
                                  )
                                );
                              }
                            }}
                          >
                            <XIcon className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {/* Add Answer */}
                    <div className="px-4 py-3 w-full">
                      <Button
                        className="w-full"
                        type="button"
                        onClick={() => {
                          field.onChange([
                            ...field.value,
                            { text: "", isCorrect: false },
                          ]);
                        }}
                        disabled={!allAnswersFilled} // Disable button if any answer is empty
                      >
                        Add Answer
                      </Button>
                    </div>
                  </>
                )}
              />
            </div>
          </div>
        );
      })}

      <div className="flex gap-2">
        <Button
          className="flex-1"
          disabled={!allQuestionsFilled}
          onClick={() =>
            appendQuestion({
              questionText: "",
              answers: [{ text: "", isCorrect: false }],
            })
          }
        >
          Add Question
        </Button>

        <Button
          type="button"
          disabled={
            !allQuestionsFilled ||
            !formState.isDirty ||
            formState.isSubmitting ||
            loading
          }
          onClick={() => {
            setLoading(true);
            service
              .patch(`/quiz/${params.id}`, {
                questions: watch().questions,
              })
              .then(() => {
                toast({
                  title: "Success",
                  description: "Quiz updated successfully",
                });
              })
              .catch((e) => {
                toast({
                  title: "Error",
                  description: e.message,
                });
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          {loading && <Icons.spinner className="animate-spin w-5 h-5 mr-2" />}
          Submit Quiz
        </Button>
      </div>
    </form>
  );
};

export default QuizForm;
