import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditPage from "./pages/EditPage";
import ListPage from "./pages/ListPage";
import Navbar from "./components/Navbar";
import { useFridgeData } from "./hooks/useFridgeData";

   
function App() {
  const { list, addFood, deleteFood, handleAddMultipleFoods } = useFridgeData(); // 呼叫 Hook

return (
    <Router>
      <div style={{ maxWidth: "100%", margin: "0 auto", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <Routes>
          <Route path="/" element={<EditPage onAdd={addFood} handleAddMultipleFoods={handleAddMultipleFoods} />} />
          <Route path="/list" element={<ListPage list={list} onDelete={deleteFood} />} />
        </Routes>


        <Navbar listCount={list.length} />
      </div>
    </Router>
  );
}


export default App;
