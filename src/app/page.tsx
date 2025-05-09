"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "./firebase/firebase";
import { useAuth } from "./Auth/AuthProvider";
export default function Home() {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const { user, logOut } = useAuth();
  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      alert("登入成功");
    } catch (error) {
      alert("登入失敗");
      console.log((error as any).message);
    }
  };
  const handleRegister: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      alert("註冊成功");
    } catch (error) {
      alert("註冊失敗");
      console.log((error as any).message);
    }
  };

  return (
    <main>
      <header>react練習用專案</header>
      {user ? (
        <>
          <section>
            <p>已使用{user.email}登入</p>
            <button onClick={() => router.push("/dashboard")}>立刻開始</button>
            <button onClick={logOut}>登出</button>
          </section>
        </>
      ) : (
        <>
          <section>
            <h2>登入系統</h2>
            <form onSubmit={handleLogin}>
              <label>
                電郵
                <input
                  type="email"
                  required
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                  }}
                />
              </label>

              <div>
                <label>
                  密碼
                  <input
                    type="password"
                    required
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                    }}
                  />
                </label>
              </div>
              <button type="submit">登入</button>
            </form>
            <h2>註冊系統</h2>
            <form onSubmit={handleRegister}>
              <div>
                <label>
                  電郵
                  <input
                    type="email"
                    required
                    onChange={(e) => {
                      setRegisterEmail(e.target.value);
                    }}
                  />
                </label>
              </div>
              <div>
                <label>
                  密碼
                  <input
                    type="password"
                    required
                    onChange={(e) => {
                      setRegisterPassword(e.target.value);
                    }}
                  />
                </label>
              </div>
              <button type="submit">註冊</button>
            </form>
          </section>
        </>
      )}
    </main>
  );
}
