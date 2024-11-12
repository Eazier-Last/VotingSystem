// import React from "react";
import React, { lazy, Suspense, useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Header from "./components/Header";
const Two = lazy(() => import("./components/Two"));
const Three = lazy(() => import("./components/Three"));
const Four = lazy(() => import("./components/Four"));

function App() {
  const [activeComponent, setActiveComponent] = useState("");

  const loadComponent = (path) => {
    switch (path) {
      case "/home":
        setActiveComponent(<Home />);
        break;
      case "/two":
        setActiveComponent(
          <Suspense fallback={<div>Loading...</div>}>
            <Two />
          </Suspense>
        );
        break;
      case "/three":
        setActiveComponent(
          <Suspense fallback={<div>Loading...</div>}>
            <Three />
          </Suspense>
        );
        break;
      case "/four":
        setActiveComponent(
          <Suspense fallback={<div>Loading...</div>}>
            <Four />
          </Suspense>
        );
        break;
      default:
        setActiveComponent(<div>Select a component from the sidebar.</div>);
        break;
    }
  };

  useEffect(() => {
    loadComponent(window.location.pathname);
  }, []);

  return (
    <div className="App">
      <Sidebar loadComponent={loadComponent} />
      <Header />
      <div className="ContentArea">{activeComponent}</div>
    </div>
  );
}

export default App;
