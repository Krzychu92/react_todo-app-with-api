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
  handleTempTodo: (todo: Todo | null) => void;
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
  handleTempTodo,
  setTasks,
  tasks,
  onFocus,
  handleIsSubmitting,
  isSubmitting,
  setIsUpdating,
}: Props) => {
  const [taskTitle, setTaskTitle] = useState('');
  const addNewTodo = (creatNewTodo: Todo) => {
    addTodo(creatNewTodo)
      .then(response => {
        setTasks([...tasks, response]);
        setTaskTitle('');
        handleTempTodo(null);
      })
      .catch(() => {
        handleError(errorType.add);
        handleTempTodo(null);
      })
      .finally(() => {
        handleIsSubmitting(false);
        setIsUpdating([]);
        onFocus();
      });
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

    handleIsSubmitting(true);
    setIsUpdating([newTodo.id]);
    handleTempTodo({
      title: title,
      userId: USER_ID,
      completed: false,
      id: 0,
    });
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
