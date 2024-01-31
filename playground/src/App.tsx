import cpd from "custom-protocol-detection-pkg";
import { useState } from "react";
import "./app.css";

function App() {
  const [status, setStatus] = useState("");

  function check(uri: string) {
    cpd(
      uri,
      () => {
        console.log("failed");
        setStatus("failed");
      },
      () => {
        console.log("successed");
        setStatus("successed");
      },
      () => {
        console.log("unsupported");
        setStatus("unsupported");
      }
    );
  }

  return (
    <div className="wrapper">
      <div className="title">
        The following two buttons, one is to open the non-existent protocol, and
        the other is to open the mailbox on the device. You can click to try it
        out.
      </div>
      <div className="box">
        Status: <span>{status}</span>
      </div>
      <div className="btnBox">
        <div className="btn" onClick={() => check("blahblah:randomstuff")}>
          Non-exist
        </div>
        <div
          className="btn"
          onClick={() => check("mailto:johndoe@somewhere.com")}
        >
          Open email
        </div>
      </div>
    </div>
  );
}

export default App;
