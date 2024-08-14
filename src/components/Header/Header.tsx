import classNames from 'classnames';
import { LegacyRef } from 'react';

type Props = {
  handleAllCompleted: () => void;
  allDone: boolean;
  handleSubmit: (event: { preventDefault: () => void }) => void;
  taskTitle: string;
  IsSubmitting: boolean;
  inputRef: LegacyRef<HTMLInputElement>;
  taskLengthForButton: number;
  onNewTitle: (value: string) => void;
};

export const ToDoHeader = ({
  handleAllCompleted,
  allDone,
  onNewTitle,
  handleSubmit,
  taskTitle,
  IsSubmitting,
  inputRef,
  taskLengthForButton,
}: Props) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {taskLengthForButton > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', { active: allDone })}
          data-cy="ToggleAllButton"
          onClick={() => handleAllCompleted()}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={taskTitle}
          onChange={event => onNewTitle(event.target.value)}
          placeholder="What needs to be done?"
          disabled={IsSubmitting}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
