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

  const taskLeft = tasks.length - completedTodos.length;

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

  const handleTempTodo = (todo: Todo | null) => {
    setTempTodo(todo);
  };

  const handleIsSubmitting = (isSubmitting: boolean) => {
    setIsSubmitting(isSubmitting);
  };

  const handleCompleted = (id: number, completed: boolean) => {
    setIsUpdating(current => [...current, id]);
    let todoToUpdate = tasks.find(todo => todo.id === id);

    if (!todoToUpdate) {
      setErrorMessage(errorType.found);

      return;
    }

    if (!completed) {
      todoToUpdate = {
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      };
    } else {
      todoToUpdate = {
        ...todoToUpdate,
        completed: completed,
      };
    }

    updateCompletedTodo(id, todoToUpdate)
      .then(() => {
        setTasks(prevState =>
          prevState.map(todo => (todo.id === id ? {...todo, completed: !todo.completed} : todo)
        ));
        setIsUpdating([]);
      })
      .catch(() => {
        handleError(errorType.updateTodo);
        setIsUpdating([]);
      });
  };

  const handleAllCompleted = async () => {
    if (!areTasksDone) {
      const tasksToUpdate = tasks.filter(task => !task.completed);
  
      await Promise.all(
        tasksToUpdate.map(task => handleCompleted(task.id, true))
      );
    } else {
      await Promise.all(
        tasks.map(task => handleCompleted(task.id, false))
      );
    }
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
          handleTempTodo={handleTempTodo}
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
