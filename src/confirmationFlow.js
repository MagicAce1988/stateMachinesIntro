import {
  createMachine,
  state,
  transition,
  interpret,
  invoke,
  reduce,
} from "robot3";

const confirmationFlow = createMachine({
  initial: state(
    transition(
      "begin",
      "confirming",
      reduce((context, event) => {
        return { ...context, onCommit: event.onCommit };
      })
    )
  ),
  confirming: state(
    transition("confirm", "loading"),
    transition(
      "cancel",
      "initial",
      reduce((context, event) => {
        return { ...context, error: "" };
      })
    )
  ),
  loading: invoke(
    (context, event) => context.onCommit(context, event),
    transition("done", "initial"),
    transition(
      "error",
      "confirming",
      reduce((context, event) => {
        return { ...context, error: event.error };
      })
    )
  ),
});

const service = interpret(confirmationFlow, () => {
  console.log("state changed to", service.machine.current);
});

service.send("begin");
service.send("cancel");

export { confirmationFlow };
