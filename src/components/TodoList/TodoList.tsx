/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { errorType } from '../../types/ErrorType';
import { useRef, useState } from 'react';
import {
  deleteTodo,
  updateCompletedTodo,
  updateTitleTodo,
} from '../../api/todos';
import { Status } from '../../types/Status';
import { TempTodo } from '../TempTodo/TempTodo';

type Props = {
  status: Status;
  tempTodo: Todo | null;
  onUpdate: number[];
  handleError: (error: string) => void;
  onNewTasks: (tasks: Todo[]) => void;
  tasks: Todo[];
  onLoading: (ids: number[]) => void;
  handleIsSubmitting: (isSubmitting: boolean) => void;
  setTasks: (tasks: Todo[]) => void;
  focusInput: () => void;
};

export const TodoList = ({
  status,
  tempTodo,
  onUpdate,
  handleError,
  onNewTasks,
  tasks,
  onLoading,
  handleIsSubmitting,
  setTasks,
  focusInput,
}: Props) => {
  const [newTitle, setNewTitle] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const editRef = useRef<number | null>(null);

  const deleteTask = (id: number) => {
    onLoading([id]);
    deleteTodo(id)
      .then(() => {
        if (canEdit === true) {
          setCanEdit(false);
        }

        const updatedTasks = tasks.filter(todo => todo.id !== id);

        setTasks(updatedTasks);
        focusInput();
      })
      .catch(() => {
        if (canEdit === true) {
          setCanEdit(true);
        }

        handleError(errorType.deleteTask);
        onLoading([]);
      });
  };

  const updateNewTitle = (id: number, newTitl: string) => {
    const updateTitle = newTitl.trim();
    const todoToUpdate = tasks.find(todo => todo.id === id);

    if (!todoToUpdate) {
      handleError(errorType.found);

      return;
    }

    if (todoToUpdate.title === updateTitle) {
      return;
    }

    const updatedTodo = { ...todoToUpdate, title: updateTitle };

    const updatedTasks = tasks.map(todo =>
      todo.id === id ? updatedTodo : todo,
    );

    if (newTitle.trim() === '') {
      deleteTask(id);
    }

    updateTitleTodo(id, updatedTodo)
      .then(() => {
        onNewTasks(updatedTasks);
        onLoading([]);
        setCanEdit(false);
      })
      .catch(() => {
        handleError(errorType.updateTodo);

        setCanEdit(true);
        editRef.current = id;
        const revertedTasks = tasks.map(todo =>
          todo.id === id ? { ...todo, title: todoToUpdate.title } : todo,
        );

        onNewTasks(revertedTasks);

        onLoading([]);
      });
    handleIsSubmitting(false);
  };

  const handleSubmitNewTitle = (id: number, title: string) => {
    const originalTodo = tasks.find(todo => todo.id === id);

    if (!originalTodo) {
      handleError(errorType.found);

      return;
    }

    const trimmedTitle = title.trim();

    if (originalTodo.title === trimmedTitle) {
      return;
    }

    if (!trimmedTitle) {
      deleteTask(id);
      handleIsSubmitting(false);

      return;
    }

    handleIsSubmitting(true);
    onLoading([id]);
    updateNewTitle(id, trimmedTitle);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle((e.target as HTMLInputElement).value);
  };

  const sendTitle = (id: number) => {
    handleSubmitNewTitle(id, newTitle);
    setCanEdit(false);
  };

  const handleDoubleClick = (id: number, updateTitle: string) => {
    if (!canEdit) {
      setCanEdit(true);
      setNewTitle(updateTitle);
      editRef.current = id;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setCanEdit(false);
    }
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

  const handleCompleted = (id: number) => {
    onLoading([id]);
    const todoToUpdate = tasks.find(todo => todo.id === id);

    if (!todoToUpdate) {
      handleError(errorType.found);

      return;
    }

    updateCompletedTodo(id, todoToUpdate)
      .then(() => {
        const updatedTasks = tasks.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        );

        setTasks(updatedTasks);
        onLoading([]);
      })
      .catch(() => {
        handleError(errorType.updateTodo);
        onLoading([]);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(task => {
        const { title, completed, id } = task;

        return (
          <div
            key={id}
            data-cy="Todo"
            className={classNames('todo', { completed: completed })}
          >
            <label
              htmlFor={`Input-task-title#${id}`}
              className="todo__status-label"
            >
              <input
                id={`Input-task-title#${id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onChange={() => handleCompleted(id)}
                checked={completed}
              />
            </label>
            {canEdit && editRef.current === id ? (
              <form
                key={id}
                onSubmit={e => {
                  e.preventDefault();
                  sendTitle(id);
                }}
                onBlur={e => {
                  e.preventDefault();
                  sendTitle(id);
                }}
              >
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={newTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleTitleChange(e)
                  }
                  autoFocus={true}
                  onKeyDown={handleKeyDown}
                />
              </form>
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => handleDoubleClick(id, title)}
                >
                  {title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => deleteTask(id)}
                >
                  ×
                </button>
              </>
            )}
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay ', {
                'is-active': onUpdate.includes(id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && <TempTodo title={tempTodo.title} />}
    </section>
  );
};
