/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos } from './api/todos';
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
  // const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState<number[] | []>([]);
  const [IsSubmitting, setIsSubmitting] = useState(false);
  const completedTodos = tasks?.filter(todo => todo.completed);
  const inputRef = useRef<HTMLInputElement>(null);

  const taskLeft = tasks.length - completedTodos.length;

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

  const clearCompleted = async () => {
    let updateTasksIds: number[] = [];

    await Promise.all(
      completedTodos.map(todo => {
        updateTasksIds = [...updateTasksIds, todo.id];
        setIsUpdating(updateTasksIds);
        deleteTodo(todo.id)
          .then(() => {
            getTodos().then(setTasks);
          })
          .catch(() => {
            handleError(errorType.deleteTask);
            setIsUpdating([]);
          })
          .finally(() => {
            focusInput();
          });
      }),
    );
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
          completedTodos={completedTodos}
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
          tempTodo={tempTodo}
          onUpdate={isUpdating}
          handleError={handleError}
          onNewTasks={handleSetTasks}
          tasks={tasks}
          setIsUpdating={setIsUpdating}
          handleIsSubmitting={handleIsSubmitting}
          focusInput={focusInput}
          setTasks={setTasks}
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
