import { Button } from "./components/ui/button"

function App() {
  return (
    <>
      <Button className={dark ? "dark" : ""}>
        hello
      </Button>
    </>
  )
}

export default App
