import './app.css'
import UserList from '~/components/UserList'
import UserInput from '~/components/UserInput'

function App() {

  return (
    <>
      <div class="flex gap-4">
        <UserList />
        <UserInput />
      </div>
    </>
  )
}

export default App
