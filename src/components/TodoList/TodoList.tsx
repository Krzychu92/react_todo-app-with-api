import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { errorType } from '../../types/ErrorType';
import { useRef, useState } from 'react';
import { deleteTodo, updateCompletedTodo } from '../../api/todos';
import { Status } from '../../types/Status';
import { TempTodo } from '../TempTodo/TempTodo';
import { TodoEditForm } from '../TodoEditForm/TodoEditForm';
import { useTodoContext } from '../../context/TodoProvider';

export const TodoList = () => {
  const {
    focusInput,
    tasks,
    setTasks,
    tempTodo,
    setErrorMessage,
    setIsUpdating,
    isUpdating,
    status,
  } = useTodoContext();
  const [newTitle, setNewTitle] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  const deleteTask = (id: number) => {
    setIsUpdating([id]);
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

        setErrorMessage(errorType.deleteTask);
        setIsUpdating([]);
      });
  };

  const handleDoubleClick = (updateTitle: string) => {
    if (!canEdit) {
      setCanEdit(true);
      setNewTitle(updateTitle);
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
    setIsUpdating([id]);
    const todoToUpdate = tasks.find(todo => todo.id === id);

    if (!todoToUpdate) {
      setErrorMessage(errorType.found);

      return;
    }

    updateCompletedTodo(id, {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    })
      .then(() => {
        const updatedTasks = tasks.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        );

        setTasks(updatedTasks);
        setIsUpdating([]);
      })
      .catch(() => {
        setErrorMessage(errorType.updateTodo);
        setIsUpdating([]);
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
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              htmlFor={`Input-task-title#${id}`}
              className="todo__status-label"
            >
              <input
                id={`Input-task-title#${id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onClick={() => handleCompleted(id)}
                checked={completed}
              />
            </label>
            {canEdit ? (
              <TodoEditForm
                tasks={tasks}
                setCanEdit={setCanEdit}
                setNewTitle={setNewTitle}
                newTitle={newTitle}
                deleteTask={deleteTask}
                taskId={id}
                editRef={editRef}
              />
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => handleDoubleClick(title)}
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
                'is-active': isUpdating.includes(id),
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};
