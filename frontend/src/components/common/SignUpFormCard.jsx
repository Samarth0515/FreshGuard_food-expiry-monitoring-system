import React, { useState } from "react";

export default function SignUpFormCard({ title, userType, onSubmit, submitting }) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleClick = () => {
    onSubmit({ name, id, password, confirmPassword, userType });
  };

  return (
    <div className={`form-card ${userType === "shopkeeper" ? "shopkeeper" : ""}`}>
      <h3>{title}</h3>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder={userType === "shopkeeper" ? "Enter shopkeeper ID" : "Enter member ID"}
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="password"
        placeholder="Set Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleClick} disabled={submitting}>
        {submitting ? "Signing up..." : `Sign Up as ${title}`}
      </button>
    </div>
  );
}
