import classNames from 'classnames';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

type Props = {
  status: Status;
  handleStatus: (value: Status) => void;
  onClear: () => void;
  completedTodos: Todo[];
  taskLeft: number;
};

export const Footer = ({
  status,
  handleStatus,
  onClear,
  completedTodos,
  taskLeft,
}: Props) => {
  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {taskLeft} items left
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: status === Status.all,
            })}
            data-cy="FilterLinkAll"
            onClick={() => handleStatus(Status.all)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: status === Status.active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => handleStatus(Status.active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: status === Status.completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => handleStatus(Status.completed)}
          >
            Completed
          </a>
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={() => onClear()}
          disabled={completedTodos.length === 0}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
