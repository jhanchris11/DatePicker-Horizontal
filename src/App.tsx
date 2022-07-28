import './App.css'
import { DatePickerHorizontal } from './components/DatePickerHorizontal'

function App() {
  const onSelectDays = (d: Date) => {
    console.log(d)
  }
  return (
    <div className="App">
      <DatePickerHorizontal
        selectedDay={onSelectDays}
        enableScroll={true}
        enableDays={180}
      />
    </div>
  )
}

export default App
