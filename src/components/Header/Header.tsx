import { errorType } from '../../types/ErrorType';
import classNames from 'classnames';
import { LegacyRef, useState } from 'react';
import { addTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  handleAllCompleted: () => void;
  allDone: boolean;
  IsSubmitting: boolean;
  inputRef: LegacyRef<HTMLInputElement>;
  taskCounter: number;
  handleError: (errorMsg: string) => void;
  // taskTitle: string;
  setTempTodo: (todo: Todo | null) => void;
  setTasks: (tasks: Todo[]) => void;
  tasks: Todo[];
  onFocus: () => void;
  handleIsSubmitting: (isSubmitting: boolean) => void;
  isSubmitting: boolean;
  setIsUpdating: (ids: number[]) => void;
};

export const ToDoHeader = ({
  handleAllCompleted,
  allDone,
  inputRef,
  taskCounter,
  handleError,
  setTempTodo,
  setTasks,
  tasks,
  onFocus,
  handleIsSubmitting,
  isSubmitting,
  setIsUpdating,
}: Props) => {
  const [taskTitle, setTaskTitle] = useState('');

  const addNewTodo = (creatNewTodo: Todo) => {
    handleIsSubmitting(true);
    setTempTodo(creatNewTodo);
    setIsUpdating([creatNewTodo.id]);
    // const updatedTasks = [...tasks, creatNewTodo];

    // setTasks(updatedTasks);

    addTodo(creatNewTodo)
      .then(response => {
        // updatedTasks.pop();
        setTasks([...tasks, response]);
        setTaskTitle('');
      })
      .catch(() => {
        // setTasks([...updatedTasks]);
        handleError(errorType.add);
      })
      .finally(() => {
        setTempTodo(null);
        handleIsSubmitting(false);
        setIsUpdating([]);
        onFocus();
      });

    // try {
    //   const newTodo: Todo = await addTodo(creatNewTodo);

    //   if (tempTodo) {
    //     setIsUpdating([tempTodo.id]);
    //   }

    //   setTasks(currentTodos => {
    //     currentTodos.pop();

    //     return [...currentTodos, newTodo];
    //   });
    //   setTaskTitle('');
    // } catch {
    //   setTasks(currentTodos => {
    //     return [...currentTodos];
    //   });
    //   handleError(errorType.add);
    // } finally {
    //   // setTempTodo(null);
    //   setIsSubmitting(false);
    //   focusInput();
    // }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = taskTitle.trim();

    if (!title) {
      handleError(errorType.empty);

      return;
    }

    const newTodo = {
      title: title,
      userId: USER_ID,
      completed: false,
      id: 0,
    };

    addNewTodo(newTodo);
  };

  return (
    <header className="todoapp__header">
      {taskCounter > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: allDone })}
          data-cy="ToggleAllButton"
          onClick={() => handleAllCompleted()}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={taskTitle}
          onChange={event => setTaskTitle(event.target.value)}
          placeholder="What needs to be done?"
          disabled={isSubmitting}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
