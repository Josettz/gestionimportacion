// App.js
import React, { useEffect } from "react";
import { app, analytics } from "./firebase-config";

function App() {
  useEffect(() => {
    // Aquí podrías agregar alguna funcionalidad adicional usando Firebase Analytics
    console.log("Firebase initialized!");
  }, []);

  return (
    <div className="App">
      <h1>Firebase Test App</h1>
      <p>Firebase has been successfully initialized!</p>
    </div>
  );
}

export default App;
