import React from "react";
import { useMoralis } from "react-moralis";
import VotingForm from "./VotingForm"

export default function App() {
  const { authenticate, isAuthenticated,logout, user } = useMoralis();

  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={() => authenticate()}>Authenticate</button>
      </div>
    );
  }

  return (
    <>
    <VotingForm />
      <button onClick={logout}>logout</button>
    </>
  );
}
