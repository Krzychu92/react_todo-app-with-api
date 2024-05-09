/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateCompletedTodo,
  updateTitleTodo,
} from './api/todos';
import { ToDoHeader } from './components/Header/todoapp_header';
import { TodoList } from './components/TodoList/todoapp_todolist';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorType } from './types/ErrorType';
import { Errors } from './components/Error/Error';
import { Footer } from './components/Footer/footer';

type TempTodo = {
  id: number;
  completed: boolean;
  title: string;
  userId: number;
};

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [status, setStatus] = useState<Status>(Status.all);
  const [taskTitle, setTaskTitle] = useState('');
  const [allDone, setAllDone] = useState(false);
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState<number[] | []>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const completedTodos = tasks?.filter(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement>(null);

  const errorType: ErrorType = {
    empty: 'Title should not be empty',
    load: 'Unable to load todos',
    add: 'Unable to add a todo',
    found: 'Todo not found',
    deleteTask: 'Unable to delete a todo',
    updateTodo: 'Unable to update a todo',
  };

  const taskLeft = tasks?.filter(
    task => !task.completed && task.id != 0,
  ).length;

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const filterTodo: (todos: Todo[], mode: Status) => Todo[] = (todos, mode) => {
    switch (mode) {
      case Status.completed:
        return todos.filter(task => task.completed);
      case Status.active:
        return todos.filter(task => !task.completed);
      case Status.all:
      default:
        return tasks;
    }
  };

  const filteredTodos = filterTodo(tasks, status);

  const handleError: (errorMsg: string) => void = errorMsg => {
    setErrorMessage(errorMsg);
  };

  const addNewTodo = async (creatNewTodo: Todo) => {
    try {
      setTasks(currentTodos => [...currentTodos, creatNewTodo]);
      setIsUpdating([0]);

      const newTodo: Todo = await addTodo(creatNewTodo);

      setTasks(currentTodos => {
        currentTodos.pop();

        return [...currentTodos, newTodo];
      });
      setTaskTitle('');
    } catch {
      setTasks(currentTodos => {
        currentTodos.pop();

        return [...currentTodos];
      });
      handleError(errorType.add);
    } finally {
      setTempTodo(null);
      setIsSubmitting(false);
      focusInput();
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const title = taskTitle.trim();

    if (!title) {
      handleError(errorType.empty);

      return;
    }

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
      id: 0,
    };

    setIsSubmitting(true);
    addNewTodo(newTodo);
  };

  const handleAllCompleted = () => {
    const allCompleted = tasks.map(todo => {
      if (!todo.completed) {
        setAllDone(true);

        return { ...todo, completed: true };
      }

      if (allDone && taskLeft == 0) {
        setAllDone(false);

        return { ...todo, completed: false };
      }

      return todo;
    });

    allCompleted.map(task => {
      setIsUpdating(current => [...current, task.id]);
      updateCompletedTodo(task.id, task).then(() => {
        setTasks(allCompleted);
        setIsUpdating([]);
      });
    });
  };

  const deleteTask = (id: number) => {
    setDeletingIds(prevIds => [...prevIds, id]);
    deleteTodo(id)
      .then(() => {
        setTasks(currentTodos => currentTodos.filter(todo => todo.id !== id));
        setDeletingIds(prevIds =>
          prevIds.filter(deletingId => deletingId !== id),
        );
        focusInput();
      })
      .catch(() => {
        handleError(errorType.deleteTask);
        setDeletingIds([]);
      });
  };

  const clearCompleted = () => {
    Promise.all(
      completedTodos.map(todo => {
        deleteTask(todo.id);
        setIsUpdating([]);
      }),
    ).then(() => {
      focusInput();
    });
  };

  const handleCompleted = (id: number) => {
    setIsUpdating(current => [...current, id]);
    const todoToUpdate = tasks.find(todo => todo.id === id);

    if (!todoToUpdate) {
      setErrorMessage(errorType.found);

      return;
    }

    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

    updateCompletedTodo(id, updatedTodo)
      .then(() => {
        const updatedTasks = tasks.map(todo =>
          todo.id === id ? updatedTodo : todo,
        );

        setTasks(updatedTasks);
        setIsUpdating([]);
      })
      .catch(() => setErrorMessage(errorType.updateTodo));
  };

  const handleEdit = (id: number | null) => {
    setIsEditing(id);
  };

  const updateNewTitle = (id: number, newTitl: string) => {
    const todoToUpdate = tasks.find(todo => todo.id === id);

    if (!todoToUpdate) {
      setErrorMessage(errorType.found);

      return;
    }

    const updatedTodo = { ...todoToUpdate, title: newTitl };

    const updatedTasks = tasks.map(todo =>
      todo.id === id ? { ...todo, title: newTitl } : todo,
    );

    setTasks(updatedTasks);

    updateTitleTodo(id, updatedTodo)
      .then(() => {
        setIsUpdating([]);
      })
      .catch(() => {
        handleError(errorType.updateTodo);

        const revertedTasks = tasks.map(todo =>
          todo.id === id ? { ...todo, title: todoToUpdate.title } : todo,
        );

        setIsEditing(id);
        setTasks(revertedTasks);

        setIsUpdating([]);
      });
    setIsSubmitting(false);
  };

  const handleSubmitNewTitle = (id: number, title: string) => {
    setIsSubmitting(true);
    setIsUpdating([id]);

    if (!title.trim()) {
      deleteTask(id);
      setIsSubmitting(false);

      return;
    }

    updateNewTitle(id, title);
  };

  useEffect(() => {
    getTodos()
      .then(setTasks)
      .then(() => focusInput())
      .catch(() => handleError(errorType.load));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  // useEffect(() => {
  //   if (taskLeft > 0) {
  //     return setAllDone(false);
  //   } else if (taskLeft == 0) {
  //     return setAllDone(true);
  //   }
  // }, [taskLeft]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <ToDoHeader
          handleAllCompleted={handleAllCompleted}
          allDone={allDone}
          handleSubmit={handleSubmit}
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          IsSubmitting={IsSubmitting}
          inputRef={inputRef}
          taskLengthForButton={tasks.length}
        />
        <TodoList
          filteredTodos={filteredTodos}
          handleCompleted={handleCompleted}
          tempTodo={tempTodo}
          deleteTask={deleteTask}
          deletingIds={deletingIds}
          onUpdate={isUpdating}
          onEdit={handleEdit}
          editId={isEditing}
          onSubmitNewTitle={handleSubmitNewTitle}
          setNewTitle={setNewTitle}
          newTitle={newTitle}
        />
        {tasks.length > 0 && (
          <Footer
            taskLeft={taskLeft}
            setStatus={setStatus}
            status={status}
            clearCompleted={clearCompleted}
            completedTodos={completedTodos.length}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Errors errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
