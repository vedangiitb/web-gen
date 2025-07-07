"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type AuthContextType = {
  userId: string;
  currentUser: string;
  setUser: (userName: string) => void;
  logout: () => Promise<void>;
  accessToken: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<string>("Login");
  const [userId, setUserId] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const token = session?.access_token;
      if (token) setAccessToken(token);

      if (data?.user) {
        setCurrentUser(
          data.user.user_metadata.full_name ?? data.user.email ?? "User"
        );
        setUserId(data.user.id);
      } else {
        setCurrentUser("Login");
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setCurrentUser(
            session.user.user_metadata.full_name ?? session.user.email ?? "User"
          );
          setUserId(session.user.id);
        } else {
          setCurrentUser("Login");
          setUserId("");
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser("Login");
    setUserId("");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setUser: setCurrentUser,
        logout,
        userId,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
