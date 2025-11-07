import React from "react";

type LanguageContent = { en: string; ar: string };

type Card = {
  title: LanguageContent;
  content: LanguageContent;
  image: File | null;
    imageUrl?: string; // ✅ new
};

type CardsTabContentProps = {
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  message: string;
};

function InputField({
  label,
  value,
  onChange,
  textarea = false,
  required = true,
  type = "text",
  accept,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  required?: boolean;
  type?: string;
  accept?: string;
}) {
  return (
    <div className="form-field">
      <label>{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} required={required} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} accept={accept} />
      )}
    </div>
  );
}

export default function CardsTabContent({ cards, setCards, handleSubmit, loading, message }: CardsTabContentProps) {
  const updateCardField = (index: number, field: "title" | "content", lang: "en" | "ar", value: string) => {
    const updated = [...cards];
    updated[index][field][lang] = value;
    setCards(updated);
  };

  const updateCardImage = (index: number, file: File | null) => {
    const updated = [...cards];
    updated[index].image = file;
    setCards(updated);
  };

  return (
    <form onSubmit={handleSubmit}>
      {cards.map((card, idx) => (
        <div key={idx} className="card-section">
          <h3>Card {idx + 1}</h3>

          <InputField
            label="Title (English)"
            value={card.title.en}
            onChange={(v) => updateCardField(idx, "title", "en", v)}
          />
          <InputField
            label="Title (Arabic)"
            value={card.title.ar}
            onChange={(v) => updateCardField(idx, "title", "ar", v)}
          />
          <InputField
            label="Content (English)"
            value={card.content.en}
            onChange={(v) => updateCardField(idx, "content", "en", v)}
            textarea
          />
          <InputField
            label="Content (Arabic)"
            value={card.content.ar}
            onChange={(v) => updateCardField(idx, "content", "ar", v)}
            textarea
          />

         <div className="form-field">
  <label>Image</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => updateCardImage(idx, e.target.files?.[0] ?? null)}
  />

  {/* ✅ Show preview (local or backend) */}
  {card.image ? (
    <img
      src={URL.createObjectURL(card.image)}
      alt={`Card ${idx + 1} Preview`}
      style={{
        width: "160px",
        height: "auto",
        marginTop: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
  ) : card.imageUrl ? (
    <img
      src={card.imageUrl}
      alt={`Card ${idx + 1} Existing`}
      style={{
        width: "160px",
        height: "auto",
        marginTop: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />
  ) : null}
</div>


          <hr />
        </div>
      ))}
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Cards"}
      </button>
      {message && <p className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</p>}
    </form>
  );
}
