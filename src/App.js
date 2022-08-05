import './App.css';
import {useState, useEffect} from 'react'
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Fab from '@mui/material/Fab';
// import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'
import ClearIcon from '@mui/icons-material/Clear';

const  App = () => {
  const [todo, setTodo] = useState('')
  const [todos,setTodos] = useState([])
  const [selectedTodoId,setSelectedTodoId] = useState(0)

  const addTodo = (e) => {
    e.preventDefault()
    if(todo === '')
      return
    const tempTodo = JSON.parse(JSON.stringify(todos))
    tempTodo.push({
      id: new Date(),
      title: todo,
      completed: false,
    })
    setTodos(tempTodo)
    setTodo("")
  }
  const deleteTodo = (todoElement) => {
    setTodos(todos.filter((Todo) => {
      return Todo.id !== todoElement
    }))
    if(todos.length === 1) localStorage.setItem("todos",JSON.stringify([]))
  }
  const editTodo = (todoElement) => {
    setTodo(todoElement.title)
    setSelectedTodoId(todoElement.id)
    document.querySelector(".todo-text").focus()
    document.querySelector(".submit-todo").style.display = "none"
    document.querySelector(".edit-todo").style.display = "inline-block"
  }
  const updateTodo = () => {
    setTodos(
      todos.map((Todo) => {
        if (Todo.id === selectedTodoId)
          return{...Todo, title: todo}
        return Todo
      })
    )
    document.querySelector(".submit-todo").style.display = "inline-block"
    document.querySelector(".edit-todo").style.display = "none"
    setTodo("")
  }
  const completedTodo = (todoId) => {
    setTodos(
      todos.map((Todo) => {
        if (Todo.id === todoId) 
          return{...Todo, completed: !(Todo.completed)}
        return Todo
      })
    )
  }
  const removeCompletedTodo = () => {
    setTodos(todos.filter((Todo) => {
      return Todo.completed === false
    }))
    if(todos.length === 1) localStorage.setItem("todos",JSON.stringify([]))
  }

  useEffect(() => {
    if(todos && todos.length > 0)
      localStorage.setItem("todos",JSON.stringify(todos))
  }, [todos])
  useEffect(() => {
    setTodos(JSON.parse(localStorage.getItem("todos")) || [])
  },[])

  return (
    <div className='todo-parent'>
      <div className='todo-child shadow-inset'>
        <div className='todo'>
          <div className='todoSection'>
            <input 
              type='text'
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              className='todo-text'
              placeholder='Todo Name'
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTodo(e)
                }
              }}
              style={todo ? {boxShadow: '-2px -2px 1px white, 1px 1px 5px rgb(116, 138, 171)'}: null}
            />
            <input 
              type='button'
              className='submit-todo submit-todo-style'
              value='ADD TODO'
              onClick={addTodo}
              style={todo ? {boxShadow: '-2px -2px 1px white, 1px 1px 5px rgb(116, 138, 171)',color:"green"}: {color:"red"}}
            />
          </div>
          <input 
            type='button'
            className='edit-todo submit-todo-style'
            value='EDIT TODO'
            onClick={updateTodo}
          />
          <br/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            {todos.filter(Todo => Todo.completed === true).length} / {todos.length}
            <Button variant="contained" onClick={removeCompletedTodo}>Remove completed todos</Button>
          </div>
          <br/>
          {
            todos.map((todoItem) => {
              return (
                <div key={todoItem.id} className="todoItem">    
                  <div className='todoDisplay'>
                    <span className={ todoItem.completed ? 'line-through' : ''} onClick={() => {completedTodo(todoItem.id)}}>{todoItem.title}</span>
                  <div className='actions'>
                    <Checkbox  checked={todoItem.completed} onChange={() => {completedTodo(todoItem.id)}} type="checkbox"/>
                    <Fab size="small" color="primary" aria-label="add">
                      <ClearIcon className='deleteItem' onClick={() => {deleteTodo(todoItem.id)}}/>
                    </Fab>
                    <Fab size="small" color="primary" aria-label="add">
                      <EditIcon onClick={() => {editTodo(todoItem)}}/>
                    </Fab>
                  </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
}

export default App;
