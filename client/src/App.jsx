import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { Button } from "./components/ui/button"
import Layout from "./Layouts/Layout"
import { RouteIndex } from "./helpers/RouteName"
import Index from "./pages"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RouteIndex} element={<Layout />}>
          <Route index element={<Index />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
