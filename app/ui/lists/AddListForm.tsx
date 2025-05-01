"use client";

import { useListStore } from "@/app/lib/store";
import { useState } from "react";
import toast from "react-hot-toast";
import styles from "./add-list-form.module.scss";

export function AddListForm() {
  const [title, setTitle] = useState("");
  const addList = useListStore((state) => state.addList);
  const loading = useListStore((state) => state.loadingList);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await addList(title.trim());
      setTitle("");
    } catch (error) {
      console.error("Failed to add list:", error);
      toast.error("Something went wrong while adding the list");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Add new list..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.input}
        disabled={loading}
      />

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
