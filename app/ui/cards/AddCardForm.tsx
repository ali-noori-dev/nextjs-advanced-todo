"use client";

import { useListStore } from "@/app/lib/store";
import { useState } from "react";
import toast from "react-hot-toast";

type CardFormProps = {
  listId: string;
};

export function AddCardForm({ listId }: CardFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addCard = useListStore((state) => state.addCard);
  const loading = useListStore((state) => state.loadingCard);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const cardData = {
        title: title.trim(),
        description: description.trim(),
      };

      await addCard(listId, cardData);

      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Failed to add card:", err);
      toast.error("Something went wrong while adding the card");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Card title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        required
      />

      <textarea
        placeholder="Card description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Card"}
      </button>
    </form>
  );
}
