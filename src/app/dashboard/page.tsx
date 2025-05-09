"use client";
import Check from "./Check";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../Auth/AuthProvider";
type Record = {
  type: "income" | "expense";
  amount: number;
  content: string;
  userId: string;
  createAt: Date;
  id: string;
};
export default function Account() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [record, setRecord] = useState<Record[]>([]);
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/");
      return;
    }
    const fetchData = async () => {
      const databaseData = query(
        collection(db, "records"),
        where("userId", "==", user.uid)
      );
      const getInfo = await getDocs(databaseData);
      const recordsFromDb = getInfo.docs.map((doc) => {
        return {
          id: doc.id,
          ...(doc.data() as Omit<Record, "id">),
        };
      });
      setRecord(recordsFromDb);
    };
    fetchData();
  }, [user, router, isLoading]);
  if (isLoading) return <Check />;
  const handleAdd = async () => {
    if (!user || amount === 0 || content === "") return;
    try {
      const docRef = await addDoc(collection(db, "records"), {
        type,
        amount,
        content,
        userId: user.uid,
        createAt: new Date(),
      });
      const newRecord: Record = {
        type,
        amount,
        content,
        userId: user.uid,
        createAt: new Date(),
        id: docRef.id,
      };

      setType("income");
      setAmount(0);
      setContent("");
      setRecord([...record, newRecord]);
      alert("新增成功");
    } catch {
      alert("新增失敗,請重試");
    }
  };
  const total = record.reduce(
    (acc, r) => (r.type === "income" ? acc + r.amount : acc - r.amount),
    0
  );
  const handleDel = async (id: string) => {
    try {
      await deleteDoc(doc(db, "records", id));
      setRecord(function (prevRecord) {
        const newRecord = prevRecord.filter((r) => r.id !== id);
        return newRecord;
      });
    } catch (e) {
      console.log(console.log(e));
    }
  };
  return (
    <>
      <main>
        <div className={styles.account_form}>
          <p>你已使用{user?.email}登入</p>
          <div className={styles.input_form}>
            <select
              value={type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setType(e.target.value as "income" | "expense")
              }
            >
              <option value="income">收入</option>
              <option value="expense">支出</option>
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAmount(Number(e.target.value));
              }}
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                if (amount == 0) e.target.value = "";
              }}
            />
            <input
              type="text"
              placeholder="說明"
              value={content}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setContent(e.target.value);
              }}
            />
            <button onClick={handleAdd}>新增紀錄</button>
          </div>
        </div>
        <hr />
        <div className={styles.account_detail}>
          <div>
            {record.map((r) => (
              <div className={styles.list} key={r.id}>
                <div
                  className={styles.amount}
                  style={{ color: r.type === "income" ? "green" : "red" }}
                >
                  {r.type === "income" ? r.amount : -r.amount}
                </div>
                <div className={styles.content}>{r.content}</div>
                <button onClick={() => handleDel(r.id)}>刪除</button>
              </div>
            ))}
          </div>
          <div className={styles.total}>小計:{total}</div>
          <button
            onClick={() => {
              router.push("/");
            }}
          >
            返回首頁
          </button>
        </div>
      </main>
    </>
  );
}
