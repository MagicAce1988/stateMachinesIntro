import React from "react";
import Modal from "react-modal";
import { useMachine } from "react-robot";
import { confirmationFlow } from "./confirmationFlow";

const doSomethingCustom = async () => {
  return new Promise((resolve, reject) => {
    console.log("Beginning custom action....");
    setTimeout(() => {
      console.log("Done Custom Action");
      // resolve();
      reject("Oh no");
    }, 1000);
  });
}; //call an api to do something

function App() {
  const [current, send] = useMachine(confirmationFlow);
  const isLoading = current.name === "loading";
  return (
    <div>
      <h1>Modal Test</h1>
      Current State: {current.name}
      <button
        onClick={() =>
          send({
            type: "begin",
            onCommit: (context, event) => doSomethingCustom(),
          })
        }
      >
        Destroy something Important
      </button>
      <Modal
        onRequestClose={() => send("cancel")}
        isOpen={["confirming", "loading"].includes(current.name)}
      >
        {current.context.error && <div>{current.context.error}</div>}
        Are you sure?!
        <button
          disabled={current.name === "loading"}
          onClick={() => send("cancel")}
        >
          Cancel
        </button>
        <button
          disabled={current.name === "loading"}
          onClick={() => send("confirm")}
        >
          Yes Definitely
        </button>
      </Modal>
    </div>
  );
}

export default App;
