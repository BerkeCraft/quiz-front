import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Loading from "./components/Loading";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import useAuth from "./hooks/useAuth";
import { service } from "./lib/service";
import AllQuizzesPage from "./pages/dashboard/all/index";
import DashboardLayout from "./pages/dashboard/layout";
import LoginPage from "./pages/login";
import MyQuizes from "./pages/dashboard/myquizes";
import QuizPage from "./pages/dashboard/quiz";
import RegisterPage from "./pages/register";
import { Button } from "./components/ui/button";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="login" />} />
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <LoginPage />
                </AuthRoute>
              }
            />{" "}
            <Route
              path="/register"
              element={
                <AuthRoute>
                  <RegisterPage />
                </AuthRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="all" />} />
              <Route path="all" element={<AllQuizzesPage />} />
              <Route path="my-quizzes" element={<MyQuizes />} />
              {/* /quiz/id */}
              <Route path="quiz/:id" element={<QuizPage />} />

              <Route
                path="*"
                element={
                  <div className="w-full gap-4 flex-col h-full flex items-center justify-center">
                    <div>
                      <div className="text-5xl font-semibold">404</div>
                    </div>
                    The Page you are looking for is not found
                    <Link to={"/dashboard/all"}>
                      <Button>Go Back</Button>
                    </Link>
                  </div>
                }
              />
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (accessToken) {
      service
        .get("/auth/user")
        .then(({ data }) => {
          console.log("here");
          auth.signin(data, () => {
            console.log("asdas");
            setLoading(false);
            navigate("/dashboard");
          });
        })
        .catch(() => {
          setLoading(false);
          console.log("err");
          localStorage.removeItem("accessToken");
        });
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  if (loading) return <Loading />;
  return <>{children}</>;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { auth, signin } = useAuth();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (accessToken) {
      service
        .get("/auth/user")
        .then(({ data }) => {
          signin(data, () => {
            setLoading(false);
          });
        })
        .catch(() => {
          setLoading(false);
          localStorage.removeItem("accessToken");
          navigate("/login");
        });
    } else {
      localStorage.removeItem("accessToken");
      setLoading(false);
      navigate("/login");
    }
  }, [accessToken]);

  if (loading) return <Loading />;
  if (auth?.user) return <>{children}</>;
};
export default App;
