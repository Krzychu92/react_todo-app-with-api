/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  deleteTodo,
  getTodos,
  updateCompletedTodo,
} from './api/todos';
import { ToDoHeader } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { errorType } from './types/ErrorType';
import { Errors } from './components/Error/Error';

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [status, setStatus] = useState<Status>(Status.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState<number[] | []>([]);
  const [canEdit, setCanEdit] = useState(false);
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const completedTodos = tasks?.filter(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement>(null);
  const taskLeft = tempTodo
    ? tasks.length - completedTodos.length + 1
    : tasks.length - completedTodos.length;

  const areTasksDone = tasks.length === completedTodos.length;

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleStatus = (value: Status) => {
    setStatus(value);
  };

  const handleSetTasks = (newTasks: Todo[]) => {
    setTasks(newTasks);
  };

  const handleEdit = (edit: boolean) => {
    setCanEdit(edit);
  };

  const handleError: (errorMsg: string) => void = errorMsg => {
    setErrorMessage(errorMsg);
  };

  const handleErrorClear = () => {
    setErrorMessage('');
  };

  const handleIsSubmitting = (isSubmitting: boolean) => {
    setIsSubmitting(isSubmitting);
  };

  // const handleTaskTitle = (event: string) => {
  //   setTaskTitle(event);
  // };

  const handleAllCompleted = () => {
    const isAllDone = tasks.every(task => task.completed);
    const updatedTasks = tasks.map(task => ({
      ...task,
      completed: !isAllDone,
    }));

    updatedTasks.forEach(updatedTask => {
      const originalTask = tasks.find(task => task.id === updatedTask.id);

      if (originalTask && originalTask.completed !== updatedTask.completed) {
        setIsUpdating(current => [...current, updatedTask.id]);
        updateCompletedTodo(updatedTask.id, updatedTask)
          .then(() => {
            setIsUpdating(current =>
              current.filter(id => id !== updatedTask.id),
            );
          })
          .catch(() => {
            handleError(errorType.updateTodo);
            setIsUpdating(current =>
              current.filter(id => id !== updatedTask.id),
            );
          });
      }
    });

    setTasks(updatedTasks);
  };

  const deleteTask = (id: number) => {
    setDeletingIds(prevIds => [...prevIds, id]);
    deleteTodo(id)
      .then(() => {
        if (canEdit === true) {
          handleEdit(false);
        }

        setTasks(currentTodos => currentTodos.filter(todo => todo.id !== id));
        setDeletingIds(prevIds =>
          prevIds.filter(deletingId => deletingId !== id),
        );
        focusInput();
      })
      .catch(() => {
        if (canEdit === true) {
          handleEdit(true);
        }

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

    const updatedTodo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    updateCompletedTodo(id, updatedTodo)
      .then(() => {
        setTasks(prevState => {
          return prevState.map(todo => (todo.id === id ? updatedTodo : todo));
        });
        setIsUpdating([]);
      })
      .catch(() => {
        handleError(errorType.updateTodo);
        setIsUpdating([]);
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTasks)
      .then(() => focusInput())
      .catch(() => handleError(errorType.load));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => handleErrorClear(), 3000);

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <ToDoHeader
          handleAllCompleted={handleAllCompleted}
          allDone={areTasksDone}
          handleError={handleError}
          inputRef={inputRef}
          taskCounter={tasks.length}
          setTempTodo={setTempTodo}
          IsSubmitting={IsSubmitting}
          setTasks={setTasks}
          tasks={tasks}
          onFocus={focusInput}
          handleIsSubmitting={handleIsSubmitting}
          isSubmitting={IsSubmitting}
          setIsUpdating={setIsUpdating}
        />
        <TodoList
          status={status}
          handleCompleted={handleCompleted}
          tempTodo={tempTodo}
          deleteTask={deleteTask}
          deletingIds={deletingIds}
          onUpdate={isUpdating}
          handleError={handleError}
          onNewTasks={handleSetTasks}
          tasks={tasks}
          setIsUpdating={setIsUpdating}
          handleIsSubmitting={handleIsSubmitting}
          canEdit={canEdit}
          onEdit={handleEdit}
        />

        {tasks.length > 0 && (
          <Footer
            onClear={clearCompleted}
            handleStatus={handleStatus}
            status={status}
            taskLeft={taskLeft}
            completedTodos={completedTodos}
          />
        )}
      </div>

      <Errors errorMessage={errorMessage} OnErrorClean={handleErrorClear} />
    </div>
  );
};
