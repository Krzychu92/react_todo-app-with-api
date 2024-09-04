import classNames from 'classnames';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { errorType } from '../../types/ErrorType';

interface FooterProps {
  status: Status;
  handleStatus: (value: Status) => void;
  completedTodos: Todo[];
  taskLeft: number;
  setTasks: React.Dispatch<React.SetStateAction<Todo[]>>;
  onLoading: (ids: number[]) => void;
  focusInput: () => void;
  handleError: (error: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  status,
  handleStatus,
  completedTodos,
  taskLeft,
  setTasks,
  onLoading,
  focusInput,
  handleError,
}) => {
  const clearCompleted = async () => {
    let updateTasksIds: number[] = [];

    await Promise.all(
      completedTodos.map(todo => {
        updateTasksIds = [...updateTasksIds, todo.id];
        onLoading(updateTasksIds);
        deleteTodo(todo.id)
          .then(() => {
            setTasks(prevState => prevState.filter(el => el.id !== todo.id));
          })
          .catch(() => {
            handleError(errorType.deleteTask);
            onLoading([]);
          })
          .finally(() => {
            focusInput();
          });
      }),
    );
  };

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
          onClick={() => clearCompleted()}
          disabled={completedTodos.length === 0}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
